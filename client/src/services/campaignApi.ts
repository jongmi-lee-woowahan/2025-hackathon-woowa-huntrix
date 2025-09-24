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

  // Huntrix Agent-2 - 선택된 세그먼트 성과 분석 (3번 재시도)
  async getHuntrixAnalytics(conditions: HuntrixCondition[]): Promise<ApiResponse<any>> {
    const MAX_RETRIES = 3
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`🚀 Huntrix Analytics API 호출 시작 (${attempt}/${MAX_RETRIES}):`, conditions)
        console.log('⏰ 최대 5분간 성과 분석이 진행됩니다...')
        
        // 5분 타임아웃 설정
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
          controller.abort()
        }, 5 * 60 * 1000) // 5분
        
        const response = await fetch('https://buds-n8n.willing-snipe.dp.deliveryhero.io/webhook/huntrix-agent-2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          signal: controller.signal,
          body: JSON.stringify({ message: conditions }) // conditions를 message 배열로 전송
        })

        clearTimeout(timeoutId)
        console.log(`📡 Huntrix Analytics API 응답 상태 (시도 ${attempt}):`, response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`❌ Huntrix Analytics API 에러 응답 (시도 ${attempt}):`, errorText)
          throw new Error(`Huntrix Analytics API Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log(`✅ Huntrix Analytics API 응답 데이터 (시도 ${attempt}):`, data)
        
        // output 필드 유효성 검사 및 필수 데이터 검증
        if (!data.output || typeof data.output !== 'string' || data.output.trim().length < 10) {
          console.warn(`⚠️ API 응답에 유효한 output이 없음 (시도 ${attempt}):`, {
            hasOutput: !!data.output,
            outputType: typeof data.output,
            outputLength: data.output?.length || 0,
            fullResponse: data
          })
          
          if (attempt === MAX_RETRIES) {
            throw new Error('API가 유효한 데이터를 반환하지 않았습니다.')
          }
          
          console.log(`🔄 ${2}초 후 재시도합니다... (output 검증 실패)`)
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }
        
        // JSON 파싱 및 필수 데이터 구조 검증
        try {
          let parsedData: any
          const outputString = data.output
          
          // JSON 코드 블록에서 추출
          const jsonStart = outputString.indexOf('```json\n')
          const jsonEnd = outputString.lastIndexOf('\n```')
          
          if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            const jsonString = outputString.substring(jsonStart + 8, jsonEnd)
            parsedData = JSON.parse(jsonString)
          } else {
            parsedData = JSON.parse(outputString)
          }
          
          // 필수 필드 검증: conversionRate, revisitRate, predRevenueRate
          const requiredFields = ['conversion_rate', 'revisit_rate', 'pred_revenue_rate']
          let validationPassed = true
          const validationResults: any = {}
          
          for (const field of requiredFields) {
            const fieldData = parsedData[field]
            if (!fieldData || !fieldData.target || !fieldData.all) {
              validationPassed = false
              validationResults[field] = 'Missing field or target/all structure'
              continue
            }
            
            const targetAvg = fieldData.target.avg
            const allAvg = fieldData.all.avg
            
            if (typeof targetAvg !== 'number' || typeof allAvg !== 'number' || 
                isNaN(targetAvg) || isNaN(allAvg) || targetAvg <= 0 || allAvg <= 0) {
              validationPassed = false
              validationResults[field] = {
                targetAvg: { value: targetAvg, type: typeof targetAvg, valid: typeof targetAvg === 'number' && !isNaN(targetAvg) && targetAvg > 0 },
                allAvg: { value: allAvg, type: typeof allAvg, valid: typeof allAvg === 'number' && !isNaN(allAvg) && allAvg > 0 }
              }
            } else {
              validationResults[field] = 'Valid'
            }
          }
          
          if (!validationPassed) {
            console.warn(`⚠️ API 응답 데이터 검증 실패 (시도 ${attempt}):`, {
              parsedData: parsedData,
              validationResults: validationResults,
              requiredFields: requiredFields
            })
            
            if (attempt === MAX_RETRIES) {
              throw new Error(`API 응답에 유효한 성과 지표 데이터가 없습니다. 검증 결과: ${JSON.stringify(validationResults)}`)
            }
            
            console.log(`🔄 ${2}초 후 재시도합니다... (데이터 검증 실패)`)
            await new Promise(resolve => setTimeout(resolve, 2000))
            continue
          }
          
          console.log(`✅ 데이터 검증 성공 (시도 ${attempt}):`, validationResults)
          
        } catch (parseError) {
          console.warn(`⚠️ JSON 파싱 실패 (시도 ${attempt}):`, {
            error: parseError,
            outputSample: data.output.substring(0, 200) + '...'
          })
          
          if (attempt === MAX_RETRIES) {
            throw new Error(`API 응답 데이터를 파싱할 수 없습니다: ${parseError instanceof Error ? parseError.message : '알 수 없는 오류'}`)
          }
          
          console.log(`🔄 ${2}초 후 재시도합니다... (JSON 파싱 실패)`)
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }
        
        return {
          data,
          success: true,
          message: 'Huntrix 성과 분석이 완료되었습니다.'
        }
      } catch (error) {
        lastError = error as Error
        console.error(`🚨 Huntrix Analytics API 요청 실패 (시도 ${attempt}/${MAX_RETRIES}):`, error)
        
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('성과 분석이 5분을 초과하여 중단되었습니다. 다시 시도해주세요.')
        }
        
        if (attempt === MAX_RETRIES) {
          break
        }
        
        console.log(`🔄 ${2}초 후 재시도합니다...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    
    console.error(`❌ ${MAX_RETRIES}번 시도 후 실패. 마지막 오류:`, lastError)
    
    if (lastError instanceof TypeError && lastError.message.includes('fetch')) {
      throw new Error('네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.')
    }
    
    throw lastError || new Error('성과 분석 API 호출에 실패했습니다.')
  },

  // Huntrix Agent-3 - 채널 배분 최적화 (3번 재시도, 최대 5분)
  async getHuntrixChannelOptimization(conditions: HuntrixCondition[]): Promise<ApiResponse<any>> {
    const MAX_RETRIES = 3
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`🚀 Huntrix Channel API 호출 시작 (${attempt}/${MAX_RETRIES}):`, conditions)
        console.log('⏰ 최대 5분간 채널 최적화 분석이 진행됩니다...')
        
        // 5분 타임아웃 설정
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
          controller.abort()
        }, 5 * 60 * 1000) // 5분
        
        const response = await fetch('https://buds-n8n.willing-snipe.dp.deliveryhero.io/webhook/huntrix-agent-3', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          signal: controller.signal,
          body: JSON.stringify({ message: conditions }) // conditions를 message 배열로 전송
        })

        clearTimeout(timeoutId)
        console.log(`📡 Huntrix Channel API 응답 상태 (시도 ${attempt}):`, response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`❌ Huntrix Channel API 에러 응답 (시도 ${attempt}):`, errorText)
          throw new Error(`Huntrix Channel API Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log(`✅ Huntrix Channel API 응답 데이터 (시도 ${attempt}):`, data)
        
        // output 필드 유효성 검사
        if (!data.output || typeof data.output !== 'string' || data.output.trim().length < 10) {
          console.warn(`⚠️ Channel API 응답에 유효한 output이 없음 (시도 ${attempt}):`, {
            hasOutput: !!data.output,
            outputType: typeof data.output,
            outputLength: data.output?.length || 0,
            fullResponse: data
          })
          
          if (attempt === MAX_RETRIES) {
            throw new Error('Channel API가 유효한 데이터를 반환하지 않았습니다.')
          }
          
          console.log(`🔄 ${2}초 후 재시도합니다... (Channel output 검증 실패)`)
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }
        
        // JSON 배열 파싱 및 채널 데이터 검증
        try {
          let parsedChannels: any[]
          const outputString = data.output
          
          // JSON 배열 추출 (설명 텍스트와 함께 있을 수 있음)
          const jsonStart = outputString.indexOf('[')
          const jsonEnd = outputString.lastIndexOf(']')
          
          if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            const jsonString = outputString.substring(jsonStart, jsonEnd + 1)
            parsedChannels = JSON.parse(jsonString)
          } else {
            throw new Error('JSON 배열을 찾을 수 없습니다.')
          }
          
          // 채널 데이터 검증
          if (!Array.isArray(parsedChannels) || parsedChannels.length === 0) {
            throw new Error('유효한 채널 배열이 없습니다.')
          }
          
          // 필수 필드 검증
          let validationPassed = true
          const validationResults: any = {}
          
          for (const [index, channel] of parsedChannels.entries()) {
            const channelValidation: any = {}
            
            if (!channel.name || typeof channel.name !== 'string') {
              validationPassed = false
              channelValidation.name = 'Missing or invalid name'
            }
            
            if (typeof channel.customer_ratio !== 'number' || channel.customer_ratio <= 0) {
              validationPassed = false
              channelValidation.customer_ratio = { value: channel.customer_ratio, valid: false }
            }
            
            if (!Array.isArray(channel.conditions) || channel.conditions.length === 0) {
              validationPassed = false
              channelValidation.conditions = 'Missing or empty conditions'
            }
            
            validationResults[`channel_${index}`] = channelValidation
          }
          
          if (!validationPassed) {
            console.warn(`⚠️ Channel API 응답 데이터 검증 실패 (시도 ${attempt}):`, {
              parsedChannels: parsedChannels,
              validationResults: validationResults
            })
            
            if (attempt === MAX_RETRIES) {
              throw new Error(`Channel API 응답에 유효한 채널 데이터가 없습니다. 검증 결과: ${JSON.stringify(validationResults)}`)
            }
            
            console.log(`🔄 ${2}초 후 재시도합니다... (Channel 데이터 검증 실패)`)
            await new Promise(resolve => setTimeout(resolve, 2000))
            continue
          }
          
          console.log(`✅ Channel 데이터 검증 성공 (시도 ${attempt}):`, validationResults)
          
        } catch (parseError) {
          console.warn(`⚠️ Channel JSON 파싱 실패 (시도 ${attempt}):`, {
            error: parseError,
            outputSample: data.output.substring(0, 500) + '...'
          })
          
          if (attempt === MAX_RETRIES) {
            throw new Error(`Channel API 응답 데이터를 파싱할 수 없습니다: ${parseError instanceof Error ? parseError.message : '알 수 없는 오류'}`)
          }
          
          console.log(`🔄 ${2}초 후 재시도합니다... (Channel JSON 파싱 실패)`)
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }
        
        return {
          data,
          success: true,
          message: 'Huntrix 채널 최적화가 완료되었습니다.'
        }
      } catch (error) {
        lastError = error as Error
        console.error(`🚨 Huntrix Channel API 요청 실패 (시도 ${attempt}/${MAX_RETRIES}):`, error)
        
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('채널 최적화가 5분을 초과하여 중단되었습니다. 다시 시도해주세요.')
        }
        
        if (attempt === MAX_RETRIES) {
          break
        }
        
        console.log(`🔄 ${2}초 후 재시도합니다...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    
    console.error(`❌ ${MAX_RETRIES}번 시도 후 실패. 마지막 오류:`, lastError)
    
    if (lastError instanceof TypeError && lastError.message.includes('fetch')) {
      throw new Error('네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.')
    }
    
    throw lastError || new Error('채널 최적화 API 호출에 실패했습니다.')
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
  },

  // 세그먼트 생성 API
  async createSegment(segmentData: {
    title: string,
    description: string,
    conditions: HuntrixCondition[]
  }): Promise<ApiResponse<any>> {
    try {
      console.log('🚀 세그먼트 생성 API 호출 시작:', segmentData)
      
      const payload = {
        title: `[Woowa Huntrix AI generated ✨] ${segmentData.title}`,
        description: segmentData.description,
        sharingScope: "PUBLIC",
        createdBy: {
          email: "jongmin.park@woowahan.com"
        },
        conditions: segmentData.conditions
      }
      
      console.log('📋 세그먼트 생성 페이로드:', payload)
      
      const response = await fetch('https://segmentum-admin-apac-staging.deliveryhero.io/hackdays/api/segments', {
        method: 'POST',
        headers: {
          'x-client-id': 'BUDS',
          'x-global-entity-id': 'FP_PH',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      console.log('📡 세그먼트 생성 API 응답 상태:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ 세그먼트 생성 API 에러 응답:', errorText)
        throw new Error(`Segment API Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('✅ 세그먼트 생성 완료:', data)
      
      return {
        data,
        success: true,
        message: '세그먼트가 성공적으로 생성되었습니다.'
      }
    } catch (error) {
      console.error('❌ 세그먼트 생성 실패:', error)
      throw error
    }
  },

  // channelData 배열을 활용한 다중 세그먼트 생성
  async createSegmentsFromChannelData(channelData: any, campaignObjective: string): Promise<ApiResponse<any[]>> {
    if (!channelData || !channelData.output) {
      console.log('⚠️ channelData가 없어서 세그먼트 생성 건너뜀')
      return {
        data: [],
        success: true,
        message: 'channelData가 없어서 세그먼트 생성을 건너뛰었습니다.'
      }
    }

    try {
      console.log('🎯 channelData를 활용한 다중 세그먼트 생성 시작:', channelData)
      
      // channelData에서 채널 배열 파싱
      let parsedChannels: any[]
      const outputString = channelData.output
      
      const jsonStart = outputString.indexOf('[')
      const jsonEnd = outputString.lastIndexOf(']')
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const jsonString = outputString.substring(jsonStart, jsonEnd + 1)
        parsedChannels = JSON.parse(jsonString)
      } else {
        throw new Error('channelData에서 JSON 배열을 찾을 수 없습니다.')
      }
      
      if (!Array.isArray(parsedChannels) || parsedChannels.length === 0) {
        throw new Error('유효한 채널 배열이 없습니다.')
      }
      
      console.log(`📊 ${parsedChannels.length}개의 채널에 대해 세그먼트 생성 시작`)
      
      const segmentResults: any[] = []
      const errors: string[] = []
      
      // 각 채널에 대해 세그먼트 생성 API 호출
      for (let i = 0; i < parsedChannels.length; i++) {
        const channel = parsedChannels[i]
        
        try {
          console.log(`🔄 채널 ${i + 1}/${parsedChannels.length} 세그먼트 생성 중:`, channel.name)
          
          const segmentData = {
            title: `${channel.name} - ${campaignObjective.substring(0, 50)}${campaignObjective.length > 50 ? '...' : ''}`,
            description: `AI가 생성한 ${channel.name} 채널 타겟 세그먼트 (고객 비율: ${(channel.customer_ratio * 100).toFixed(1)}%)`,
            conditions: channel.conditions || []
          }
          
          const result = await this.createSegment(segmentData)
          
          if (result.success) {
            segmentResults.push({
              channelName: channel.name,
              customerRatio: channel.customer_ratio,
              segmentId: result.data?.id || `segment_${Date.now()}_${i}`,
              segmentData: result.data,
              success: true
            })
            console.log(`✅ 채널 "${channel.name}" 세그먼트 생성 완료`)
          } else {
            throw new Error(result.message || '세그먼트 생성 실패')
          }
          
          // API 호출 간격 (429 에러 방지)
          if (i < parsedChannels.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000)) // 1초 대기
          }
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
          console.error(`❌ 채널 "${channel.name}" 세그먼트 생성 실패:`, errorMessage)
          
          errors.push(`${channel.name}: ${errorMessage}`)
          segmentResults.push({
            channelName: channel.name,
            customerRatio: channel.customer_ratio,
            error: errorMessage,
            success: false
          })
        }
      }
      
      const successCount = segmentResults.filter(r => r.success).length
      const failureCount = segmentResults.filter(r => !r.success).length
      
      console.log(`📈 세그먼트 생성 완료: 성공 ${successCount}개, 실패 ${failureCount}개`)
      
      return {
        data: segmentResults,
        success: successCount > 0, // 하나라도 성공하면 성공으로 처리
        message: `${successCount}개 세그먼트 생성 성공, ${failureCount}개 실패`,
        errors: errors.length > 0 ? errors : undefined
      }
      
    } catch (error) {
      console.error('❌ 다중 세그먼트 생성 중 전체 오류:', error)
      throw error
    }
  }
}

// 실제 API만 사용 (Mock API 제거됨)
export const api = campaignApi
