<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Header -->
      <div 
        class="text-center space-y-4 mb-12 opacity-0 animate-in fade-in duration-500"
        style="animation-delay: 0ms"
      >
        <h1 class="text-4xl font-bold text-foreground">
          마케팅 캠페인 파이프라인
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          AI 기반 3단계 마케팅 캠페인 생성 및 최적화 도구
        </p>
      </div>

      <!-- Back Button -->
      <div 
        v-if="canGoBack" 
        class="mb-6 opacity-0 animate-in fade-in slide-in-from-left duration-300"
      >
        <button
          @click="goBack"
          class="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          data-testid="button-go-back"
        >
          <ArrowLeft class="h-4 w-4" />
          <span>이전 단계</span>
        </button>
      </div>

      <!-- AI Processing Indicator -->
      <div class="mb-8">
        <AIProcessingIndicator :status="aiStatus" :message="aiMessage" />
      </div>

      <!-- Campaign Objective Input -->
      <div 
        v-if="currentStep === 'objective'"
        class="mb-12 opacity-0 animate-in fade-in slide-in-from-bottom duration-500 space-y-4"
      >
        <div class="text-center space-y-3">
          <h3 class="text-2xl font-bold text-foreground">1단계: 캠페인 목표 설정</h3>
          <p class="text-muted-foreground max-w-2xl mx-auto">
            마케팅 캠페인의 핵심 목표를 명확히 설정하세요. AI가 목표를 분석하여 최적의 고객 세분화와 채널 전략을 제안합니다.
          </p>
        </div>
        <CampaignObjectiveInput
          @objective-set="handleObjectiveSet"
          :is-processing="aiStatus === 'processing'"
          :ai-status="aiStatus"
        />
      </div>

      <!-- Step Progress Indicator -->
      <div 
        v-if="currentStep !== 'objective'"
        class="mb-12 opacity-0 animate-in fade-in scale-in-95 duration-300"
      >
        <StepProgressIndicator 
          :steps="steps" 
          :current-step="stepOrder.indexOf(currentStep) + 1"
        />
      </div>

      <!-- Step Content -->
      <div class="space-y-12">
        <!-- Customer Segmentation -->
        <div 
          v-if="currentStep === 'segmentation'"
          class="opacity-0 animate-in fade-in slide-in-from-bottom duration-500 space-y-6"
        >
          <div class="text-center space-y-3">
            <h3 class="text-2xl font-bold text-foreground">2단계: 고객 세분화</h3>
            <p class="text-muted-foreground max-w-2xl mx-auto">
              AI가 분석한 고객 세그먼트 중 캠페인 목표에 가장 적합한 타겟 그룹을 선택하세요. 각 세그먼트의 특성과 규모를 확인할 수 있습니다.
            </p>
          </div>
        <CustomerSegmentation 
          @segments-selected="handleSegmentsSelected"
          :is-processing="aiStatus === 'processing'"
          :huntrix-recommendations="huntrixRecommendations"
          :objective="objective"
        />
        </div>

        <!-- Performance Metrics -->
        <div
          v-if="currentStep === 'metrics'"
          class="space-y-8 opacity-0 animate-in fade-in slide-in-from-bottom duration-500"
        >
          <div class="text-center space-y-3">
            <h3 class="text-2xl font-bold text-foreground">3단계: 성과 분석</h3>
            <p class="text-muted-foreground max-w-2xl mx-auto">
              선택한 고객 세그먼트의 예상 성과 지표를 확인하세요. CTR, 전환율, ROI 등 주요 메트릭을 통해 캠페인 성과를 예측할 수 있습니다.
            </p>
          </div>
          <PerformanceMetrics :segment-name="selectedSegmentNames" :analytics-data="analyticsData" :channel-data="channelData" />
          <div class="border-0 bg-card/50 backdrop-blur-sm rounded-lg">
            <button
              @click="handleMetricsNext"
              :disabled="aiStatus === 'processing'"
              class="w-full p-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 text-base font-semibold"
              data-testid="button-metrics-next"
            >
              채널 배분 단계로
            </button>
          </div>
        </div>

        <!-- Channel Distribution -->
        <div 
          v-if="currentStep === 'channels'"
          class="opacity-0 animate-in fade-in slide-in-from-bottom duration-500 space-y-6"
        >
          <div class="text-center space-y-3">
            <h3 class="text-2xl font-bold text-foreground">4단계: 채널 배분</h3>
            <p class="text-muted-foreground max-w-2xl mx-auto">
              AI가 최적화한 마케팅 채널별 예산 배분을 확인하세요. 각 채널의 특성과 예상 성과를 바탕으로 최적의 배분이 제안됩니다.
            </p>
          </div>
          <ChannelDistribution 
            :selected-conditions="selectedSegments.flatMap(s => s.conditions || [])"
            :channel-data="channelData"
            @channels-configured="handleChannelsConfigured" 
          />
        </div>
      </div>

        <!-- Campaign Summary Modal -->
        <CampaignSummaryModal
          :open="showSummaryModal"
          @close="showSummaryModal = false"
          @execute="handleCampaignExecute"
          @error="handleCampaignError"
          @retry="handleRetryExecution"
          :campaign-data="campaignSummaryData"
          :auto-load="false"
        />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'

import CampaignObjectiveInput from './CampaignObjectiveInput.vue'
import StepProgressIndicator from './StepProgressIndicator.vue'
import CustomerSegmentation from './CustomerSegmentation.vue'
import PerformanceMetrics from './PerformanceMetrics.vue'
import ChannelDistribution from './ChannelDistribution.vue'
import AIProcessingIndicator from './AIProcessingIndicator.vue'
import CampaignSummaryModal from './CampaignSummaryModal.vue'

// API imports
import { api, type CampaignExecutionResponse, type HuntrixCampaignRecommendation } from '@/services/campaignApi'

// Types
type PipelineStep = 'objective' | 'segmentation' | 'metrics' | 'channels' | 'summary'
type StepStatus = 'pending' | 'active' | 'completed'
type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error'

interface Segment {
  id: string
  name: string
  size: number
  description: string
  tags: string[]
  selected: boolean
}

interface Channel {
  id: string
  name: string
  allocation: number
  cost: string
  customerCount?: number
  labels?: string[]
  description?: string
}

// Reactive state
const currentStep = ref<PipelineStep>('objective')
const objective = ref('')
const selectedSegments = ref<Segment[]>([])
const channels = ref<Channel[]>([])
const aiStatus = ref<ProcessingStatus>('idle')
const aiMessage = ref('')
const showSummaryModal = ref(false)
const huntrixRecommendations = ref<HuntrixCampaignRecommendation[]>([])
const isLoadingRecommendations = ref(false)

// Constants
const stepOrder: PipelineStep[] = ['segmentation', 'metrics', 'channels']

// Computed values
const canGoBack = computed(() => currentStep.value !== 'objective')

const selectedSegmentNames = computed(() => 
  selectedSegments.value.map(s => s.name).join(', ')
)

// Analytics API 응답 데이터 저장
const analyticsData = ref<any>(null)

// 채널 최적화 API 응답 데이터 저장
const channelData = ref<any>(null)

const steps = computed(() => [
  {
    id: 1,
    title: '고객 세분화',
    description: '타겟 고객 선택',
    status: getStepStatus('segmentation')
  },
  {
    id: 2,
    title: '성과 분석',
    description: '지표 시각화',
    status: getStepStatus('metrics')
  },
  {
    id: 3,
    title: '채널 배분',
    description: '마케팅 채널 설정',
    status: getStepStatus('channels')
  }
])

const campaignSummaryData = computed(() => {
  // 총 예산 계산 (모든 채널의 실제 비용 합계)
  const totalBudgetAmount = channels.value.reduce((sum, channel) => {
    const cost = parseInt(channel.cost.replace(/[₩K,]/g, '')) * 1000
    return sum + cost
  }, 0)

  // 총 도달 고객 수
  const totalReach = channels.value.reduce((sum, channel) => {
    return sum + (channel.customerCount || 0)
  }, 0)

  // Analytics API 데이터에서 실제 성과 지표 추출
  const getMetricsFromAnalytics = () => {
    if (!analyticsData.value) {
      console.warn('⚠️ Analytics 데이터가 없습니다. 기본값을 사용합니다.')
      return {
        expectedRevisitRate: '3.4회',
        expectedConversion: '2.8%',
        expectedROI: '340'
      }
    }

    try {
      console.log('📊 Analytics 데이터에서 성과 지표 추출:', analyticsData.value)
      
      // output 필드에서 JSON 추출
      let parsedData: any
      if (analyticsData.value.output) {
        const outputString = analyticsData.value.output
        
        // JSON 코드 블록에서 추출
        const jsonStart = outputString.indexOf('```json\n')
        const jsonEnd = outputString.lastIndexOf('\n```')
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          const jsonString = outputString.substring(jsonStart + 8, jsonEnd)
          parsedData = JSON.parse(jsonString)
        } else {
          // 직접 JSON 파싱 시도
          parsedData = JSON.parse(outputString)
        }
      } else {
        parsedData = analyticsData.value
      }

      const conversionRate = parsedData.conversion_rate
      const revisitRate = parsedData.revisit_rate  
      const predRevenueRate = parsedData.pred_revenue_rate

      if (conversionRate?.target?.avg && conversionRate?.all?.avg &&
          revisitRate?.target?.avg && revisitRate?.all?.avg &&
          predRevenueRate?.target?.avg && predRevenueRate?.all?.avg) {
        
        // 전환율: target.avg 값을 백분율로 표시
        const conversionValue = (conversionRate.target.avg * 100).toFixed(1)
        
        // Revisit Rate: 재방문율의 target 값을 직접 사용
        const revisitValue = (revisitRate.target.avg).toFixed(1)
        
        // ROI: 타겟 수익률 직접 사용 (비율 계산 없이)
        const roiValue = (predRevenueRate.target.avg).toFixed(1)

        console.log('✅ 추출된 성과 지표:', {
          expectedRevisitRate: `${revisitValue}회`,
          expectedConversion: `${conversionValue}%`,
          expectedROI: `${roiValue}`
        })

        return {
          expectedRevisitRate: `${revisitValue}회`,
          expectedConversion: `${conversionValue}%`,
          expectedROI: `${roiValue}`
        }
      } else {
        throw new Error('필수 성과 데이터 필드가 누락되었습니다.')
      }
    } catch (error) {
      console.error('❌ Analytics 데이터 파싱 실패:', error)
      return {
        expectedRevisitRate: '3.4회',
        expectedConversion: '2.8%',
        expectedROI: '340'
      }
    }
  }

  const metricsData = getMetricsFromAnalytics()
  
  // ROI 값에서 숫자만 추출하여 예상 수익 계산 (이제 ROI는 순수 숫자값)
  const roiValue = parseFloat(metricsData.expectedROI) || 340
  const roiPercentage = roiValue / 100

  return {
  objective: objective.value,
  segments: selectedSegments.value.map(s => s.name),
    metrics: metricsData,
  channels: channels.value.map(c => ({
      id: c.id,
    name: c.name,
    allocation: c.allocation,
      cost: c.cost,
      reach: `${(c.customerCount || 0).toLocaleString()}명`
    })),
    totalBudget: `₩${Math.round(totalBudgetAmount / 1000)}K`,
    expectedRevenue: `₩${Math.round(totalBudgetAmount * roiPercentage / 1000)}K` // 실제 ROI 기준
  }
})

// Methods
function getStepStatus(step: PipelineStep): StepStatus {
  const currentIndex = stepOrder.indexOf(currentStep.value)
  const stepIndex = stepOrder.indexOf(step)
  
  if (stepIndex < currentIndex) return 'completed'
  if (stepIndex === currentIndex) return 'active'
  return 'pending'
}

const simulateAIProcessing = (message: string, duration = 2000) => {
  aiStatus.value = 'processing'
  aiMessage.value = message
  
  setTimeout(() => {
    aiStatus.value = 'completed'
    aiMessage.value = '분석이 완료되었습니다!'
    
    setTimeout(() => {
      aiStatus.value = 'idle'
    }, 1500)
  }, duration)
}

const handleObjectiveSet = async (newObjective: string) => {
  console.log('🎯 handleObjectiveSet 시작:', newObjective)
  objective.value = newObjective
  
  try {
    // Huntrix Agent-1 API 호출 시작 (name, description 검증 포함)
    console.log('📡 Huntrix Agent-1 API 호출 시작')
    isLoadingRecommendations.value = true
    aiStatus.value = 'processing'
    aiMessage.value = 'AI가 캠페인을 분석하고 있습니다... (최대 5분 소요)'
    
    const response = await api.getHuntrixRecommendations(newObjective)
    console.log('📡 Huntrix Agent-1 API 응답 받음:', response)
    
    if (response.success && response.data) {
      huntrixRecommendations.value = response.data
      console.log('✅ Huntrix 추천 설정됨:', {
        length: huntrixRecommendations.value.length,
        data: huntrixRecommendations.value
      })
      
      // API 응답 성공 후 완료 메시지 표시
      aiStatus.value = 'completed'
      aiMessage.value = response.message || 'AI 분석이 완료되었습니다!'
      
      // 1.5초 후 다음 단계로 이동
      setTimeout(() => {
        aiStatus.value = 'idle'
        console.log('🔄 currentStep을 segmentation으로 변경')
        currentStep.value = 'segmentation'
      }, 1500)
      
    } else {
      console.error('❌ Huntrix Agent-1 API 응답에 데이터가 없음:', response)
      huntrixRecommendations.value = []
      aiStatus.value = 'error'
      aiMessage.value = 'AI 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
    }
  } catch (error) {
    console.error('❌ Huntrix Agent-1 API 호출 실패:', error)
    aiStatus.value = 'error'
    
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    
    // name, description 누락으로 인한 재시도 정보를 사용자에게 알림
    if (errorMessage.includes('name 또는 description이 누락')) {
      aiMessage.value = `AI 분석에서 필수 정보가 누락되어 재시도했으나 실패했습니다: ${errorMessage}`
    } else {
      aiMessage.value = `AI 분석 중 오류가 발생했습니다: ${errorMessage}`
    }
    
    huntrixRecommendations.value = []
    console.log('🚫 에러로 인해 huntrixRecommendations를 빈 배열로 설정')
  } finally {
    isLoadingRecommendations.value = false
  }
}

const handleSegmentsSelected = async (segments: Segment[]) => {
  selectedSegments.value = segments
  console.log('📊 선택된 세그먼트들:', segments)
  
  // 선택된 세그먼트들에서 conditions 추출
  const allConditions = segments
    .filter(segment => segment.conditions && segment.conditions.length > 0)
    .flatMap(segment => segment.conditions)
  
  console.log('🔍 추출된 조건들:', allConditions)
  
  if (allConditions.length > 0) {
    // 진행률 애니메이션을 위한 변수들
    let progressCount = 0
    let progressInterval: NodeJS.Timeout | null = null
    let analyticsRetryCount = 0
    let channelRetryCount = 0
    
    try {
      aiStatus.value = 'processing'
      aiMessage.value = '성과 분석 및 채널 최적화를 위한 AI 분석 중...'
      
      // 5분에 걸쳐 0-100%로 천천히 올라가는 카운팅 애니메이션
      const totalDuration = 5 * 60 * 1000 // 5분 (밀리초)
      const updateInterval = 1000 // 1초마다 업데이트
      const incrementPerSecond = 100 / (totalDuration / updateInterval) // 1초당 증가량
      
      progressInterval = setInterval(() => {
        if (progressCount < 100) {
          progressCount = Math.min(100, progressCount + incrementPerSecond)
          const displayPercent = Math.floor(progressCount)
          aiMessage.value = `성과 분석 및 채널 최적화 중... ${displayPercent}% (최대 5분 소요)`
        } else {
          aiMessage.value = `성과 분석 및 채널 최적화 중... 100% (API 응답 대기 중...)`
        }
      }, updateInterval)
      
      // API 호출 및 재시도 처리 함수들
      const callAnalyticsAPI = async (conditions: any) => {
        try {
          return await api.getHuntrixAnalytics(conditions)
        } catch (error) {
          analyticsRetryCount++
          console.log(`❌ Analytics API 호출 실패 (${analyticsRetryCount}번째):`, error)
          throw error
        }
      }

      const callChannelAPI = async (conditions: any) => {
        try {
          return await api.getHuntrixChannelOptimization(conditions)
        } catch (error) {
          channelRetryCount++
          console.log(`❌ Channel API 호출 실패 (${channelRetryCount}번째):`, error)
          throw error
        }
      }
      
      // agent-2와 agent-3를 동시에 호출
      console.log('📡 Analytics API (agent-2)와 Channel API (agent-3) 동시 호출')
      const [analyticsResponse, channelResponse] = await Promise.all([
        callAnalyticsAPI(allConditions),
        callChannelAPI(allConditions)
      ])
      
      console.log('📈 Analytics 응답:', analyticsResponse)
      console.log('🎯 Channel 응답:', channelResponse)
      
      // 카운팅 애니메이션 정리
      clearInterval(progressInterval)
      progressInterval = null
      
      // Analytics 데이터 저장 및 검증
      if (analyticsResponse.success && analyticsResponse.data) {
        analyticsData.value = analyticsResponse.data
        console.log('💾 Analytics 데이터 저장됨:', analyticsData.value)
      } else {
        console.warn('⚠️ Analytics API 응답에 문제가 있습니다.')
      }
      
      // Channel 데이터 저장 및 검증
      if (channelResponse.success && channelResponse.data) {
        channelData.value = channelResponse.data
        console.log('💾 Channel 데이터 저장됨:', channelData.value)
      } else {
        console.warn('⚠️ Channel API 응답에 문제가 있습니다.')
      }
      
      // 성공 메시지
      const retryInfo = []
      if (analyticsRetryCount > 0) retryInfo.push(`Analytics ${analyticsRetryCount}번`)
      if (channelRetryCount > 0) retryInfo.push(`Channel ${channelRetryCount}번`)
      
      let successMessage = '성과 분석 및 채널 최적화가 완료되었습니다!'
      if (retryInfo.length > 0) {
        successMessage += ` (${retryInfo.join(', ')} 재시도 후 성공)`
      }
      
      aiStatus.value = 'completed'
      aiMessage.value = successMessage
      
      setTimeout(() => {
        aiStatus.value = 'idle'
        console.log('🔄 currentStep을 metrics로 변경')
        currentStep.value = 'metrics'
      }, 1500)
      
    } catch (error) {
      console.error('❌ API 호출 실패:', error)
      
      // 카운팅 애니메이션 정리
      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
      }
      
      aiStatus.value = 'error'
      const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류'
      const retryInfo = []
      if (analyticsRetryCount > 0) retryInfo.push(`Analytics ${analyticsRetryCount}번`)
      if (channelRetryCount > 0) retryInfo.push(`Channel ${channelRetryCount}번`)
      
      const retryText = retryInfo.length > 0 ? ` (${retryInfo.join(', ')} 재시도 실패)` : ''
      aiMessage.value = `분석 실패: ${errorMsg}${retryText}`
      
      // 에러가 발생해도 metrics 단계로 진행 (기본 데이터 사용)
      setTimeout(() => {
        aiStatus.value = 'idle'
        console.log('🔄 currentStep을 metrics로 변경 (에러 발생으로 기본 데이터 사용)')
        currentStep.value = 'metrics'
      }, 3000)
    }
  } else {
    console.log('⚠️ 조건이 없는 세그먼트만 선택됨, 기본 플로우 진행')
    simulateAIProcessing('세그먼트 선택이 완료되었습니다...')
    setTimeout(() => {
      aiStatus.value = 'idle'
      currentStep.value = 'metrics'
    }, 1500)
  }
}

const handleMetricsNext = async () => {
  // 이미 세그먼트 선택 시 agent-2, agent-3 데이터를 받았으므로 바로 다음 단계로 이동
  console.log('📊 성과 분석 완료, 채널 배분 단계로 이동')
  
  simulateAIProcessing('채널 배분 준비 중...')
  setTimeout(() => {
    aiStatus.value = 'idle'
    console.log('🔄 currentStep을 channels로 변경')
    currentStep.value = 'channels'
  }, 1000)
}

const handleChannelsConfigured = (configuredChannels: any[]) => {
  // ChannelDistribution의 Channel 타입을 CampaignPipeline의 Channel 타입으로 변환
  channels.value = configuredChannels.map(c => ({
    id: c.id,
    name: c.name,
    allocation: c.allocation,
    cost: c.cost,
    customerCount: c.customerCount,
    labels: c.labels,
    description: c.description
  }))
  
  console.log('🎉 채널 설정 완료! Summary Modal 표시:', campaignSummaryData.value)
  showSummaryModal.value = true
}

const handleCampaignExecute = async (executionResponse: CampaignExecutionResponse) => {
  showSummaryModal.value = false
  
  // 실행 성공 메시지 표시
  aiStatus.value = 'processing'
  aiMessage.value = `캠페인이 실행되었습니다. 실행 ID: ${executionResponse.executionId}`
  
  setTimeout(() => {
    aiStatus.value = 'completed'
    aiMessage.value = '캠페인이 성공적으로 시작되었습니다!'
    
    setTimeout(() => {
      aiStatus.value = 'idle'
    }, 2000)
  }, 2000)
}

const handleCampaignError = (error: string) => {
  aiStatus.value = 'error'
  aiMessage.value = `오류: ${error}`
  
  setTimeout(() => {
    aiStatus.value = 'idle'
  }, 5000)
}

const handleRetryExecution = () => {
  // 재시도 로직 - 필요에 따라 구현
  aiStatus.value = 'idle'
}

const goBack = () => {
  const allSteps: PipelineStep[] = ['objective', 'segmentation', 'metrics', 'channels']
  const currentIndex = allSteps.indexOf(currentStep.value)
  if (currentIndex > 0) {
    currentStep.value = allSteps[currentIndex - 1]
  }
}
</script>

<style scoped>
.animate-in {
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fadeIn;
}

.slide-in-from-bottom {
  animation-name: slideInFromBottom;
}

.slide-in-from-left {
  animation-name: slideInFromLeft;
}

.scale-in-95 {
  animation-name: scaleIn95;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInFromBottom {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromLeft {
  from { 
    opacity: 0;
    transform: translateX(-20px);
  }
  to { 
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn95 {
  from { 
    opacity: 0;
    transform: scale(0.95);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}
</style>
