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

// Huntrix Agent API Response Types
export interface HuntrixCondition {
  orConditions: Array<{
    key: string
    operator: string
    values: string[]
  }>
  joinType: string
}

export interface HuntrixCampaignRecommendation {
  name: string
  description: string
  customer_cnt: number
  lables: string[] // API에서 'lables' 사용 (오타)
  conditions: HuntrixCondition[] // API 서버 전달용 조건
}

export interface HuntrixApiRequest {
  message: string
}

export interface HuntrixApiResponse {
  output: string // JSON 문자열 형태
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
  // 캠페인 데이터 조회 (Mock 구현)
  async getCampaign(campaignId: string): Promise<ApiResponse<CampaignData>> {
    // 실제 백엔드 API가 없으므로 기본 데이터 반환
    return {
      data: {
        id: campaignId,
        objective: "AI 기반 캠페인 목표",
        segments: ["AI 추천 세그먼트"],
        metrics: {
          expectedCTR: "3.4%",
          expectedConversion: "2.8%",
          expectedROI: "340%"
        },
        channels: [],
        totalBudget: "₩1.0M",
        expectedRevenue: "₩12.4M",
        status: 'draft'
      },
      success: true,
      message: "캠페인 데이터를 불러왔습니다."
    }
  },

  // 캠페인 생성/저장 (Mock 구현)
  async createCampaign(campaignData: Omit<CampaignData, 'id'>): Promise<ApiResponse<CampaignData>> {
    return {
      data: { ...campaignData, id: `campaign_${Date.now()}` },
      success: true,
      message: "캠페인이 생성되었습니다."
    }
  },

  // 캠페인 업데이트 (Mock 구현) 
  async updateCampaign(campaignId: string, campaignData: Partial<CampaignData>): Promise<ApiResponse<CampaignData>> {
    return {
      data: { ...campaignData, id: campaignId } as CampaignData,
      success: true,
      message: "캠페인이 업데이트되었습니다."
    }
  },

  // 캠페인 실행 (Mock 구현)
  async executeCampaign(payload: CampaignExecutionPayload): Promise<ApiResponse<CampaignExecutionResponse>> {
    await new Promise(resolve => setTimeout(resolve, 1000)) // 실행 시뮬레이션
    
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
  },

  // 캠페인 실행 상태 조회 (Mock 구현)
  async getCampaignExecutionStatus(executionId: string): Promise<ApiResponse<CampaignExecutionResponse>> {
    return {
      data: {
        campaignId: 'campaign_123',
        status: 'executing',
        executionId,
        estimatedCompletionTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      success: true,
      message: "실행 상태를 조회했습니다."
    }
  },

  // AI 기반 성과 예측 (Mock 구현)
  async predictPerformance(segments: string[], budget: number): Promise<ApiResponse<CampaignMetrics>> {
    return {
      data: {
        expectedCTR: "3.4%",
        expectedConversion: "2.8%",
        expectedROI: "340%"
      },
      success: true,
      message: "성과 예측이 완료되었습니다."
    }
  },

  // 채널별 최적 배분 추천 (Mock 구현)
  async getOptimalChannelAllocation(segments: string[], budget: number): Promise<ApiResponse<CampaignChannel[]>> {
    return {
      data: [
        { id: "social", name: "소셜미디어", allocation: 35, cost: "₩350K", reach: "45.2K" },
        { id: "mobile", name: "모바일 광고", allocation: 25, cost: "₩250K", reach: "38.8K" },
        { id: "search", name: "검색 광고", allocation: 20, cost: "₩200K", reach: "42.1K" },
        { id: "email", name: "이메일 마케팅", allocation: 15, cost: "₩150K", reach: "25.5K" },
        { id: "messaging", name: "메신저", allocation: 5, cost: "₩50K", reach: "15.2K" }
      ],
      success: true,
      message: "채널 배분 최적화가 완료되었습니다."
    }
  },

  // Huntrix Agent - AI 기반 캠페인 추천 (최대 5분 대기)
  async getHuntrixRecommendations(message: string): Promise<ApiResponse<HuntrixCampaignRecommendation[]>> {
    try {
      console.log('🚀 Huntrix API 호출 시작:', { message })
      console.log('⏰ 최대 5분간 AI 분석이 진행됩니다...')
      
      // 5분 (300초) 타임아웃 설정
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, 5 * 60 * 1000) // 5분
      
      const response = await fetch('https://buds-n8n.willing-snipe.dp.deliveryhero.io/webhook/huntrix-agent-1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        signal: controller.signal, // AbortController 연결
        body: JSON.stringify({ message })
      })

      clearTimeout(timeoutId) // 성공시 타임아웃 해제
      console.log('📡 Huntrix API 응답 상태:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Huntrix API 에러 응답:', errorText)
        throw new Error(`Huntrix API Error: ${response.status} ${response.statusText}`)
      }

      const rawData = await response.json() as HuntrixApiResponse
      console.log('✅ Huntrix API 원본 응답:', rawData)
      
      // output 필드에서 JSON 문자열 추출 및 파싱
      if (!rawData.output) {
        throw new Error('Huntrix API 응답에 output 필드가 없습니다.')
      }
      
      console.log('📄 output 필드 (마크다운 코드블록):', rawData.output)
      
      // output 필드에서 ```json과 ``` 사이의 JSON만 추출
      let jsonString = rawData.output
      console.log('📄 원본 output:', rawData.output)
      console.log('📄 원본 output 길이:', jsonString.length)
      console.log('📄 output trimmed 길이:', jsonString.trim().length)
      
      // 빈 응답 체크
      if (!jsonString || jsonString.trim().length <= 10) {
        console.log('⚠️ API 응답이 비어있거나 너무 짧음:', jsonString)
        throw new Error('Huntrix API가 빈 응답을 반환했습니다. 나중에 다시 시도해주세요.')
      }
      
      // ```json과 ``` 사이의 내용 추출
      const jsonStart = jsonString.indexOf('```json\n')
      const jsonEnd = jsonString.lastIndexOf('\n```')
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonString = jsonString.substring(jsonStart + 8, jsonEnd) // '```json\n' 길이는 8
        console.log('🧹 추출된 JSON 문자열 길이:', jsonString.length)
        console.log('🔍 JSON 시작 부분:', jsonString.substring(0, 200) + '...')
      } else {
        console.log('⚠️ JSON 코드 블록을 찾을 수 없음')
        console.log('🔍 전체 output 내용:', jsonString)
        throw new Error('Huntrix API 응답에서 JSON 데이터를 찾을 수 없습니다.')
      }
      
      let parsedData: HuntrixCampaignRecommendation[]
      try {
        parsedData = JSON.parse(jsonString)
        console.log('🔄 파싱된 데이터:', parsedData)
      } catch (parseError) {
        console.error('❌ JSON 파싱 실패:', parseError)
        console.error('파싱 시도한 문자열:', jsonString.substring(0, 500))
        throw new Error('Huntrix API 응답의 output 필드를 JSON으로 파싱할 수 없습니다.')
      }
      
      // 응답 데이터 검증
      if (!Array.isArray(parsedData)) {
        console.error('⚠️ 파싱된 데이터가 배열이 아님:', parsedData)
        throw new Error('Huntrix API의 output 데이터가 배열 형태가 아닙니다.')
      }

      console.log('📊 최종 데이터:', parsedData)
      console.log('📈 캠페인 개수:', parsedData.length)

      return {
        data: parsedData,
        success: true,
        message: `AI가 ${parsedData.length}개의 캠페인을 추천했습니다.`
      }
    } catch (error) {
      console.error('🚨 Huntrix API request failed:', error)
      
      // AbortController에 의한 타임아웃
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('AI 분석이 5분을 초과하여 중단되었습니다. 다시 시도해주세요.')
      }
      
      // 네트워크 에러
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.')
      }
      
      throw error
    }
  }
}

// 실제 API만 사용 (Mock API 제거됨)
export const api = campaignApi
