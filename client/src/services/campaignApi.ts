// Campaign API Service Layer
export interface CampaignMetrics {
  expectedCTR: string
  expectedConversion: string
  expectedROI: string
  impressions?: number
  clicks?: number
  conversions?: number
  revenue?: number
}

export interface CampaignChannel {
  id: string
  name: string
  allocation: number
  cost: string
  reach?: string
  affinity?: number
  icon?: string
}

export interface CampaignSegment {
  id: string
  name: string
  size: number
  description?: string
  tags?: string[]
}

export interface CampaignData {
  id?: string
  objective: string
  segments: string[] | CampaignSegment[]
  metrics: CampaignMetrics
  channels: CampaignChannel[]
  totalBudget: string
  expectedRevenue: string
  status?: 'draft' | 'active' | 'paused' | 'completed'
  createdAt?: string
  updatedAt?: string
}

export interface CampaignExecutionPayload {
  campaignId?: string
  objective: string
  selectedSegments: string[]
  channelAllocation: CampaignChannel[]
  totalBudget: number
  executionDate?: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

export interface CampaignExecutionResponse {
  campaignId: string
  status: 'executing' | 'scheduled' | 'failed'
  executionId: string
  estimatedCompletionTime?: string
}

// API Base URL - 환경변수로 설정 가능
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// HTTP Client 기본 설정
const apiClient = {
  async request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  },

  get<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' })
  },

  post<T>(url: string, data: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  put<T>(url: string, data: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' })
  }
}

// Campaign API Functions
export const campaignApi = {
  // 캠페인 데이터 조회
  async getCampaign(campaignId: string): Promise<ApiResponse<CampaignData>> {
    return apiClient.get<CampaignData>(`/campaigns/${campaignId}`)
  },

  // 캠페인 생성/저장
  async createCampaign(campaignData: Omit<CampaignData, 'id'>): Promise<ApiResponse<CampaignData>> {
    return apiClient.post<CampaignData>('/campaigns', campaignData)
  },

  // 캠페인 업데이트  
  async updateCampaign(campaignId: string, campaignData: Partial<CampaignData>): Promise<ApiResponse<CampaignData>> {
    return apiClient.put<CampaignData>(`/campaigns/${campaignId}`, campaignData)
  },

  // 캠페인 실행
  async executeCampaign(payload: CampaignExecutionPayload): Promise<ApiResponse<CampaignExecutionResponse>> {
    return apiClient.post<CampaignExecutionResponse>('/campaigns/execute', payload)
  },

  // 캠페인 실행 상태 조회
  async getCampaignExecutionStatus(executionId: string): Promise<ApiResponse<CampaignExecutionResponse>> {
    return apiClient.get<CampaignExecutionResponse>(`/campaigns/execution/${executionId}/status`)
  },

  // AI 기반 성과 예측
  async predictPerformance(segments: string[], budget: number): Promise<ApiResponse<CampaignMetrics>> {
    return apiClient.post<CampaignMetrics>('/campaigns/predict-performance', {
      segments,
      budget
    })
  },

  // 채널별 최적 배분 추천
  async getOptimalChannelAllocation(segments: string[], budget: number): Promise<ApiResponse<CampaignChannel[]>> {
    return apiClient.post<CampaignChannel[]>('/campaigns/optimize-channels', {
      segments,
      budget
    })
  }
}

// Mock API for development - 실제 API가 준비될 때까지 사용
export const mockCampaignApi = {
  async getCampaign(campaignId: string): Promise<ApiResponse<CampaignData>> {
    // 실제 API 응답 형식 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000)) // API 지연 시뮬레이션
    
    return {
      data: {
        id: campaignId,
        objective: "신제품 런칭을 위한 브랜드 인지도 향상 및 초기 고객 확보",
        segments: ["젊은 전문직", "Z세대"],
        metrics: {
          expectedCTR: "3.4%",
          expectedConversion: "2.8%", 
          expectedROI: "340%",
          impressions: 450000,
          clicks: 15300,
          conversions: 428
        },
        channels: [
          { id: "social", name: "소셜미디어", allocation: 35, cost: "₩350K", reach: "45.2K" },
          { id: "mobile", name: "모바일 광고", allocation: 25, cost: "₩250K", reach: "38.8K" },
          { id: "search", name: "검색 광고", allocation: 20, cost: "₩200K", reach: "42.1K" },
          { id: "email", name: "이메일 마케팅", allocation: 15, cost: "₩150K", reach: "25.5K" },
          { id: "messaging", name: "메신저", allocation: 5, cost: "₩50K", reach: "15.2K" }
        ],
        totalBudget: "₩1.0M",
        expectedRevenue: "₩12.4M",
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      success: true,
      message: "캠페인 데이터를 성공적으로 조회했습니다."
    }
  },

  async executeCampaign(payload: CampaignExecutionPayload): Promise<ApiResponse<CampaignExecutionResponse>> {
    await new Promise(resolve => setTimeout(resolve, 2000)) // 실행 시뮬레이션
    
    return {
      data: {
        campaignId: payload.campaignId || `campaign_${Date.now()}`,
        status: 'executing',
        executionId: `exec_${Date.now()}`,
        estimatedCompletionTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      success: true,
      message: "캠페인 실행이 시작되었습니다."
    }
  }
}

// Development/Production API 스위처
export const api = import.meta.env.VITE_USE_MOCK_API === 'true' ? mockCampaignApi : campaignApi
