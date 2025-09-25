<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Dropdowns above header -->
      <div class="relative mb-4">
        <div 
          class="absolute right-0 top-0 flex gap-2 z-50"
          style="right: 1.5rem;"
        >
          <!-- Platform Dropdown -->
          <div class="relative">
            <button
              ref="platformButton"
              @click="togglePlatformDropdown"
              class="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors bg-background"
            >
              <span class="text-sm font-medium">{{ selectedPlatform }}</span>
              <svg 
                class="w-4 h-4 transition-transform" 
                :class="{ 'rotate-180': showPlatformDropdown }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Platform Dropdown Content -->
            <div 
              v-if="showPlatformDropdown"
              class="absolute top-full right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-xl z-[999999] max-w-[calc(100vw-2rem)]"
              data-dropdown="platform"
              @click.stop
            >
              <!-- Platform List -->
              <div class="max-h-60 overflow-y-auto">
                <button
                  v-for="platform in platforms"
                  :key="platform"
                  @click="selectPlatform(platform)"
                  :disabled="platform !== 'Foodpanda'"
                  class="w-full px-3 py-2 text-left text-sm transition-colors"
                  :class="{ 
                    'bg-primary text-primary-foreground': platform === selectedPlatform,
                    'hover:bg-muted': platform === 'Foodpanda',
                    'opacity-50 cursor-not-allowed': platform !== 'Foodpanda'
                  }"
                >
                  {{ platform }}
                  <span v-if="platform !== 'Foodpanda'" class="text-xs text-muted-foreground ml-2">(Coming Soon)</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Region Dropdown -->
          <div class="relative">
            <button
              ref="regionButton"
              @click="toggleRegionDropdown"
              class="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors bg-background"
            >
              <span class="text-sm font-medium">{{ selectedRegion }}</span>
              <svg 
                class="w-4 h-4 transition-transform" 
                :class="{ 'rotate-180': showRegionDropdown }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Region Dropdown Content -->
            <div 
              v-if="showRegionDropdown"
              class="absolute top-full right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-xl z-[999999] max-w-[calc(100vw-2rem)]"
              data-dropdown="region"
              @click.stop
            >
              <!-- Search Bar -->
              <div class="p-3 border-b border-border">
                <input
                  v-model="regionSearch"
                  type="text"
                  placeholder="Search"
                  class="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <!-- Region List -->
              <div class="max-h-60 overflow-y-auto">
                <button
                  v-for="region in filteredRegions"
                  :key="region"
                  @click="selectRegion(region)"
                  :disabled="region !== 'Philippines'"
                  class="w-full px-3 py-2 text-left text-sm transition-colors"
                  :class="{ 
                    'bg-primary text-primary-foreground': region === selectedRegion,
                    'hover:bg-muted': region === 'Philippines',
                    'opacity-50 cursor-not-allowed': region !== 'Philippines'
                  }"
                >
                  {{ region }}
                  <span v-if="region !== 'Philippines'" class="text-xs text-muted-foreground ml-2">(Coming Soon)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Header -->
      <div 
        class="text-center mb-12 opacity-0 animate-in fade-in duration-500 py-8"
        style="animation-delay: 0ms"
      >
        <!-- Title with Logo (Centered) -->
        <div class="flex items-center justify-center mb-2">
          <div class="flex items-center justify-center gap-1">
            <h1 class="text-3xl font-bold text-foreground">
              SegMA
            </h1>
            <!-- Logo -->
            <img 
              src="/logo.png" 
              alt="SegMA Logo" 
              class="w-8 h-8 object-contain"
            />
          </div>
        </div>
        
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto pt-1">
          Segmentum Marketing Agent
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
        class="px-5 mb-12 opacity-0 animate-in fade-in slide-in-from-bottom duration-500"
      >
        <CampaignObjectiveInput
          @objective-set="handleObjectiveSet"
          :is-processing="aiStatus === 'processing'"
          :ai-status="aiStatus"
          :initial-objective="objective"
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
            <p class="text-muted-foreground max-w-2xl mx-auto pb-4">
              AI가 분석한 고객 세그먼트 중 캠페인 목표에 가장 적합한 타겟 그룹을 선택하세요.<br> 각 세그먼트의 특성과 규모를 확인할 수 있습니다.
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
            <p class="text-muted-foreground max-w-2xl mx-auto pb-4">
              선택한 고객 세그먼트의 예상 성과 지표를 확인하세요.<br> CTR, 전환율, ROI 등 주요 메트릭을 통해 캠페인 성과를 예측할 수 있습니다.
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
            <p class="text-muted-foreground max-w-2xl mx-auto pb-4">
              AI가 최적화한 마케팅 채널별 예산 배분을 확인하세요.<br> 각 채널의 특성과 예상 성과를 바탕으로 최적의 배분이 제안됩니다.
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
          :channel-data="channelData"
          :auto-load="false"
        />
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
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

// Region selection state
const selectedRegion = ref('Philippines')
const showRegionDropdown = ref(false)
const regionSearch = ref('')

// Platform selection state
const selectedPlatform = ref('Foodpanda')
const showPlatformDropdown = ref(false)

// Template refs for buttons
const platformButton = ref<HTMLElement>()
const regionButton = ref<HTMLElement>()

// Available platforms
const platforms = [
  'Foodpanda', 'Grab', 'Lazada', 'Shopee', 'Tokopedia',
  'Zomato', 'Deliveroo', 'Uber Eats', 'DoorDash', 'Rappi'
]

// Available regions
const regions = [
  'Laos', 'Malaysia', 'Myanmar', 'Pakistan', 'Philippines', 
  'Romania', 'Singapore', 'Taiwan', 'Thailand', 'Vietnam',
  'Indonesia', 'Japan', 'South Korea', 'China', 'India',
  'Australia', 'New Zealand', 'Canada', 'United States', 'United Kingdom'
]

// Constants
const stepOrder: PipelineStep[] = ['segmentation', 'metrics', 'channels']

// Computed values
const canGoBack = computed(() => currentStep.value !== 'objective')

const selectedSegmentNames = computed(() => 
  selectedSegments.value.map(s => s.name).join(', ')
)

// Filtered regions based on search
const filteredRegions = computed(() => {
  if (!regionSearch.value) return regions
  return regions.filter(region => 
    region.toLowerCase().includes(regionSearch.value.toLowerCase())
  )
})

// Region selection methods
const toggleRegionDropdown = () => {
  showRegionDropdown.value = !showRegionDropdown.value
  if (showRegionDropdown.value) {
    regionSearch.value = ''
  }
}

const selectRegion = (region: string) => {
  selectedRegion.value = region
  showRegionDropdown.value = false
  regionSearch.value = ''
  console.log('Selected region:', region)
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  
  // Check if click is outside platform dropdown
  if (showPlatformDropdown.value && platformButton.value && 
      !platformButton.value.contains(target) && 
      !target.closest('[data-dropdown="platform"]')) {
    showPlatformDropdown.value = false
  }
  
  // Check if click is outside region dropdown
  if (showRegionDropdown.value && regionButton.value && 
      !regionButton.value.contains(target) && 
      !target.closest('[data-dropdown="region"]')) {
    showRegionDropdown.value = false
    regionSearch.value = ''
  }
}

// Platform selection methods
const togglePlatformDropdown = () => {
  showPlatformDropdown.value = !showPlatformDropdown.value
}

const selectPlatform = (platform: string) => {
  selectedPlatform.value = platform
  showPlatformDropdown.value = false
  console.log('Selected platform:', platform)
}

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

      const ltvRate = parsedData.ltv_rate
      const ltvLatestRate = parsedData.ltv_latest_rate
      const conversionRate = parsedData.conversion_rate
      const revisitRate = parsedData.revisit_rate  

      if (conversionRate?.target?.avg && conversionRate?.all?.avg &&
          revisitRate?.target?.avg && revisitRate?.all?.avg &&
          ltvRate?.target?.avg && ltvRate?.all?.avg &&
          ltvLatestRate?.target?.avg && ltvLatestRate?.all?.avg) {
        
        // 전환율: target.avg 값을 백분율로 표시
        const conversionValue = (conversionRate.target.avg * 100).toFixed(1)
        
        // Revisit Rate: 재방문율의 target 값을 직접 사용
        const revisitValue = (revisitRate.target.avg).toFixed(1)
        
        // ROI: 타겟 수익률 직접 사용 (비율 계산 없이)
        const roiValue = (ltvRate.target.avg).toFixed(1)

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

const handleObjectiveSet = async (newObjective: string, retryCount = 0) => {
  console.log('🎯 handleObjectiveSet 시작:', newObjective, '재시도 횟수:', retryCount)
  objective.value = newObjective
  
  try {
    // Huntrix Agent-1 API 호출 시작 (name, description 검증 포함)
    console.log('📡 Huntrix Agent-1 API 호출 시작')
    isLoadingRecommendations.value = true
    aiStatus.value = 'processing'
    aiMessage.value = retryCount > 0 
      ? `AI가 캠페인을 재분석하고 있습니다... (${retryCount + 1}번째 시도, 최대 5분 소요)`
      : 'AI가 캠페인을 분석하고 있습니다... (최대 5분 소요)'
    
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
      
      // 재시도 로직
      // if (retryCount < 5) { // 최대 5번 재시도
      //   console.log('🔄 재시도 중...', retryCount + 1)
      //   setTimeout(() => {
      //     handleObjectiveSet(newObjective, retryCount + 1)
      //   }, 2000) // 2초 후 재시도
      // } else {
        console.log('❌ 최대 재시도 횟수 초과, 사용자에게 재시도 요청')
        aiStatus.value = 'error'
        aiMessage.value = 'AI 서버 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
        
        // 처음 입력 단계로 돌아가기
        setTimeout(() => {
          aiStatus.value = 'idle'
          aiMessage.value = ''
          objective.value = '' // 입력 초기화
          huntrixRecommendations.value = []
          console.log('🔄 처음 입력 단계로 돌아가기')
          // currentStep은 이미 'objective'이므로 변경하지 않음
        }, 3000)
      // }
    }
  } catch (error) {
    console.error('❌ Huntrix API 호출 실패:', error)
    aiStatus.value = 'error'
    aiMessage.value = 'AI 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
    huntrixRecommendations.value = []
    console.log('🚫 에러로 인해 huntrixRecommendations를 빈 배열로 설정')
    
    // 재시도 로직
    // if (retryCount < 3) { // 최대 3번 재시도
    //   console.log('🔄 재시도 중...', retryCount + 1)
    //   setTimeout(() => {
    //     handleObjectiveSet(newObjective, retryCount + 1)
    //   }, 2000) // 2초 후 재시도
    // } else {
      console.log('❌ 최대 재시도 횟수 초과, 사용자에게 재시도 요청')
      aiStatus.value = 'error'
      aiMessage.value = 'AI 서버 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
      
      // 처음 입력 단계로 돌아가기
      setTimeout(() => {
        aiStatus.value = 'idle'
        aiMessage.value = ''
        objective.value = '' // 입력 초기화
        huntrixRecommendations.value = []
        console.log('🔄 처음 입력 단계로 돌아가기')
        // currentStep은 이미 'objective'이므로 변경하지 않음
      }, 3000)
    // }
  } finally {
    if (retryCount === 0 || retryCount >= 3) { // 첫 번째 시도이거나 최대 재시도 횟수 초과 시 로딩 상태 해제
      isLoadingRecommendations.value = false
    }
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
    // 진행률 애니메이션을 위한 변수들을 함수 스코프 내에 정의
    let progressCount = 0
    let progressInterval: NodeJS.Timeout | null = null
    let analyticsRetryCount = 0
    
    try {
      aiStatus.value = 'processing'
      
      // 5분(300초)에 걸쳐 0-100%로 천천히 올라가는 카운팅 애니메이션
      const totalDuration = 300 * 1000 // 5분 (밀리초)
      const updateInterval = 1000 // 1초마다 업데이트
      const incrementPerSecond = 100 / (totalDuration / updateInterval) // 1초당 증가량
      
      progressInterval = setInterval(() => {
        if (progressCount < 100) {
          progressCount = Math.min(100, progressCount + incrementPerSecond)
          const displayPercent = Math.floor(progressCount)
          aiMessage.value = `선택된 세그먼트의 성과를 분석하고 있습니다... ${displayPercent}% (최대 5분 소요)`
        } else {
          // 100% 도달 시 대기 상태 유지
          aiMessage.value = `선택된 세그먼트의 성과를 분석하고 있습니다... 100% (API 응답 대기 중...)`
        }
      }, updateInterval)
      
      console.log('📡 Huntrix Analytics API (agent-2) 호출 중...')
      
      // API 호출 및 재시도 처리 (fetch 래핑 제거, API 내부 재시도 로직 사용)
      const callAnalyticsAPI = async (conditions: any) => {
        try {
          return await api.getHuntrixAnalytics(conditions)
        } catch (error) {
          analyticsRetryCount++
          console.log(`❌ Analytics API 호출 실패 (${analyticsRetryCount}번째):`, error)
          
          if (analyticsRetryCount <= 3) {
            const displayPercent = Math.floor(progressCount)
            aiMessage.value = `Analytics API 재시도 중... (${analyticsRetryCount}/3 시도) ${displayPercent}%`
          }
          
          throw error
        }
      }

      
      // 1단계: Analytics API 호출 (agent-2)
      console.log('🚀 1단계: Analytics API (agent-2) 호출 시작')
      const analyticsResponse = await callAnalyticsAPI(allConditions)
      console.log('📈 Analytics 응답:', analyticsResponse)
      
      // Analytics 데이터 저장 및 검증
      if (analyticsResponse.success && analyticsResponse.data) {
        analyticsData.value = analyticsResponse.data
        console.log('💾 Analytics 데이터 저장됨:', analyticsData.value)
      } else {
        console.warn('⚠️ Analytics API 응답에 문제가 있습니다.')
        throw new Error('Analytics API 호출 실패')
      }
      
      // 카운팅 애니메이션 정리
      clearInterval(progressInterval)
      
        // Analytics 완료 메시지
        let successMessage = 'Analytics 분석이 완료되었습니다!'
        if (analyticsRetryCount > 0) {
          successMessage += ` (${analyticsRetryCount}번 재시도 후 성공)`
        }
      
      aiStatus.value = 'completed'
      aiMessage.value = successMessage
      
      setTimeout(() => {
        aiStatus.value = 'idle'
        console.log('🔄 currentStep을 metrics로 변경')
        currentStep.value = 'metrics'
      }, 1500)
      
    } catch (error) {
      console.error('❌ Analytics API 호출 실패:', error)
      
      // 카운팅 애니메이션 정리
      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
      }
      
      aiStatus.value = 'error'
      const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류'
      const retryInfo = []
      if (analyticsRetryCount > 1) retryInfo.push(`Analytics ${analyticsRetryCount-1}번`)
      
      const retryText = retryInfo.length > 0 ? ` (${retryInfo.join(', ')} 재시도 실패)` : ''
      aiMessage.value = `분석 실패: ${errorMsg}${retryText}`
      
      // 에러가 발생하면 기본 데이터로 진행
      setTimeout(() => {
        aiStatus.value = 'idle'
        console.log('🔄 currentStep을 metrics로 변경 (에러 발생으로 기본 데이터 사용)')
        currentStep.value = 'metrics'
      }, 1500) // 에러 메시지를 더 짧게 표시
    }
  } else {
    console.log('⚠️ 조건이 없는 세그먼트만 선택됨, 기본 플로우 진행')
    simulateAIProcessing('선택된 세그먼트의 성과를 예측하고 있습니다...')
    setTimeout(() => {
      currentStep.value = 'metrics'
    }, 3500)
  }
}

const handleMetricsNext = async () => {
  // 2단계: Channel 최적화 API 호출 (agent-3)
  if (selectedSegments.value.length > 0) {
    console.log('🚀 2단계: Channel API (agent-3) 호출 시작')
    
    const allConditions = selectedSegments.value
      .filter(segment => segment.conditions && segment.conditions.length > 0)
      .flatMap(segment => segment.conditions)
    
    if (allConditions.length > 0) {
      try {
        aiStatus.value = 'processing'
        aiMessage.value = '채널 최적화를 위한 AI 분석 중...'
        
        // Progress 카운팅 애니메이션 시작 (5분에 걸쳐 100% 도달)
        let progressCount = 0
        const totalDuration = 5 * 60 * 1000 // 5분 (밀리초)
        const updateInterval = 1000 // 1초마다 업데이트
        const incrementPerSecond = 100 / (totalDuration / updateInterval) // 1초당 증가량 (약 0.33%)
        
        const progressInterval = setInterval(() => {
          if (progressCount < 100) {
            progressCount = Math.min(100, progressCount + incrementPerSecond)
            const displayPercent = Math.floor(progressCount)
            aiMessage.value = `채널 최적화 분석 중... ${displayPercent}% (최대 5분 소요)`
          } else {
            aiMessage.value = `채널 최적화 분석 중... 100% (API 응답 대기 중...)`
          }
        }, updateInterval)
        
        // API 호출 및 재시도 처리 (fetch 래핑 제거, API 내부 재시도 로직 사용)
        let retryCount = 0
        const callChannelAPI = async (conditions: any) => {
          try {
            return await api.getHuntrixChannelOptimization(conditions)
          } catch (error) {
            retryCount++
            console.log(`❌ Channel API 호출 실패 (${retryCount}번째):`, error)
            
            if (retryCount <= 3) {
              const displayPercent = Math.floor(progressCount)
              aiMessage.value = `Channel API 재시도 중... (${retryCount}/3 시도) ${displayPercent}%`
            }
            
            throw error
          }
        }
        
        const channelResponse = await callChannelAPI(allConditions)
        console.log('🎯 Channel 응답 (MetricsNext):', channelResponse)
        console.log('🔍 channelResponse.data 구조 분석:')
        console.log('  - success:', channelResponse.success)
        console.log('  - data 존재 여부:', !!channelResponse.data)
        console.log('  - data 타입:', typeof channelResponse.data)
        console.log('  - data 키들:', channelResponse.data ? Object.keys(channelResponse.data) : 'N/A')
        console.log('  - data.output 존재 여부:', !!(channelResponse.data && channelResponse.data.output))
        console.log('  - data.output 타입:', channelResponse.data?.output ? typeof channelResponse.data.output : 'N/A')
        
        clearInterval(progressInterval)
        
        if (channelResponse.success && channelResponse.data) {
          channelData.value = channelResponse.data
          console.log('💾 Channel 데이터 저장됨 (MetricsNext):', {
            type: typeof channelData.value,
            keys: channelData.value ? Object.keys(channelData.value) : 'N/A',
            hasOutput: !!(channelData.value && channelData.value.output),
            outputType: channelData.value?.output ? typeof channelData.value.output : 'N/A'
          })
          
          let successMessage = '채널 최적화가 완료되었습니다!'
          if (retryCount > 0) {
            successMessage += ` (${retryCount}번 재시도 후 성공)`
          }
          
          aiStatus.value = 'completed'
          aiMessage.value = successMessage
        } else {
          throw new Error('Channel API 응답 데이터가 없습니다.')
        }
      } catch (error) {
        console.error('❌ Channel API 호출 실패:', error)
        aiStatus.value = 'error'
        aiMessage.value = '채널 최적화 중 오류가 발생했습니다.'
        return
      }
    }
  }
  
  setTimeout(() => {
    aiStatus.value = 'idle'
    currentStep.value = 'channels'
  }, 1500)
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
  console.error('❌ 캠페인 실행 오류:', error)
  // UI에서는 에러를 표시하지 않고 계속 진행
  aiStatus.value = 'completed'
  aiMessage.value = 'AI 서버 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
  
  setTimeout(() => {
    aiStatus.value = 'idle'
    objective.value = '' // 입력 필드 초기화
    console.log('🔄 currentStep을 objective로 변경 (에러 발생으로 입력 필드 초기화)')
    currentStep.value = 'objective'
  }, 3000)
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

// Setup click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
