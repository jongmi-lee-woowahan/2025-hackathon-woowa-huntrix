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
        class="mb-12 opacity-0 animate-in fade-in slide-in-from-bottom duration-500"
      >
        <CampaignObjectiveInput
          @objective-set="handleObjectiveSet"
          :is-processing="aiStatus === 'processing'"
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
          class="opacity-0 animate-in fade-in slide-in-from-bottom duration-500"
        >
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
          <PerformanceMetrics :segment-name="selectedSegmentNames" />
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
          class="opacity-0 animate-in fade-in slide-in-from-bottom duration-500"
        >
          <ChannelDistribution @channels-configured="handleChannelsConfigured" />
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
  icon: any
  affinity: number
  allocation: number
  cost: string
  reach: string
  color: string
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

const campaignSummaryData = computed(() => ({
  objective: objective.value,
  segments: selectedSegments.value.map(s => s.name),
  metrics: {
    expectedCTR: '3.4%',
    expectedConversion: '2.8%',
    expectedROI: '340%'
  },
  channels: channels.value.map(c => ({
    name: c.name,
    allocation: c.allocation,
    cost: c.cost
  })),
  totalBudget: '₩1.0M',
  expectedRevenue: '₩12.4M'
}))

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
    // Huntrix API 호출 시작
    console.log('📡 Huntrix API 호출 시작')
    isLoadingRecommendations.value = true
    aiStatus.value = 'processing'
    aiMessage.value = 'AI가 캠페인을 분석하고 있습니다... (최대 5분 소요)'
    
    const response = await api.getHuntrixRecommendations(newObjective)
    console.log('📡 Huntrix API 응답 받음:', response)
    
    if (response.success && response.data) {
      huntrixRecommendations.value = response.data
      console.log('✅ Huntrix 추천 설정됨:', {
        length: huntrixRecommendations.value.length,
        data: huntrixRecommendations.value
      })
      
      // API 응답 성공 후 완료 메시지 표시
      aiStatus.value = 'completed'
      aiMessage.value = 'AI 분석이 완료되었습니다!'
      
      // 1.5초 후 다음 단계로 이동
      setTimeout(() => {
        aiStatus.value = 'idle'
        console.log('🔄 currentStep을 segmentation으로 변경')
        currentStep.value = 'segmentation'
      }, 1500)
      
    } else {
      console.error('❌ Huntrix API 응답에 데이터가 없음:', response)
      huntrixRecommendations.value = []
      aiStatus.value = 'error'
      aiMessage.value = 'AI 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
    }
  } catch (error) {
    console.error('❌ Huntrix API 호출 실패:', error)
    aiStatus.value = 'error'
    aiMessage.value = 'AI 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
    huntrixRecommendations.value = []
    console.log('🚫 에러로 인해 huntrixRecommendations를 빈 배열로 설정')
  } finally {
    isLoadingRecommendations.value = false
  }
}

const handleSegmentsSelected = (segments: Segment[]) => {
  selectedSegments.value = segments
  simulateAIProcessing('선택된 세그먼트의 성과를 예측하고 있습니다...')
  setTimeout(() => {
    currentStep.value = 'metrics'
  }, 3500)
}

const handleMetricsNext = () => {
  simulateAIProcessing('채널 최적화를 위한 AI 분석 중...')
  setTimeout(() => {
    currentStep.value = 'channels'
  }, 3500)
}

const handleChannelsConfigured = (configuredChannels: Channel[]) => {
  channels.value = configuredChannels
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
