<template>
  <div 
    v-if="open" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    @click="handleBackdropClick"
  >
    <div 
      class="bg-background border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <div class="p-6 border-b border-border">
        <h2 class="flex items-center space-x-2 text-2xl font-semibold">
          <Rocket class="h-6 w-6 text-primary" />
          <span>캠페인 실행 확인</span>
        </h2>
      </div>

      <!-- Execution Progress State -->
      <div v-if="isExecuting" class="p-8 text-center">
        <div class="flex flex-col items-center space-y-6">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <div class="space-y-2">
            <h3 class="text-xl font-semibold text-foreground">캠페인 실행 중...</h3>
            <p class="text-muted-foreground">{{ executionProgress }}</p>
          </div>
          
          <!-- Progress Steps -->
          <div class="w-full max-w-md space-y-3" style="padding-bottom: 3rem;">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div v-if="executionStep >= 1" class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div v-else-if="executionStep === 0" class="w-6 h-6 bg-primary rounded-full animate-pulse"></div>
                <div v-else class="w-6 h-6 bg-muted rounded-full"></div>
              </div>
              <span :class="executionStep >= 1 ? 'text-foreground font-medium' : 'text-muted-foreground'">
                캠페인 실행 준비
              </span>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div v-if="executionStep >= 2" class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div v-else-if="executionStep === 1" class="w-6 h-6 bg-primary rounded-full animate-pulse"></div>
                <div v-else class="w-6 h-6 bg-muted rounded-full"></div>
              </div>
              <span :class="executionStep >= 2 ? 'text-foreground font-medium' : 'text-muted-foreground'">
                고객 세그먼트 생성
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="p-8 text-center">
        <div class="flex flex-col items-center space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p class="text-muted-foreground">캠페인 데이터를 불러오는 중...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-8 text-center">
        <div class="flex flex-col items-center space-y-4">
          <div class="p-3 bg-red-500/10 rounded-full">
            <AlertTriangle class="h-8 w-8 text-red-500" />
          </div>
          <div class="space-y-2">
            <h3 class="text-lg font-semibold text-foreground">오류가 발생했습니다</h3>
            <p class="text-muted-foreground">{{ error }}</p>
          </div>
          <button 
            @click="$emit('retry')"
            class="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
          >
            다시 시도
          </button>
        </div>
      </div>
      
      <!-- Content - only show when not loading, not executing and no error -->
      <div v-else-if="campaignData" class="p-6 space-y-6">
        <!-- Campaign Objective -->
        <div class="border-0 bg-card/50 p-4 rounded-lg">
          <h3 class="flex items-center space-x-2 text-lg font-semibold mb-3">
            <Target class="h-5 w-5 text-primary" />
            <span>캠페인 목표</span>
          </h3>
          <p class="text-foreground leading-relaxed">
            {{ campaignData.objective }}
          </p>
        </div>

        <!-- Target Segments -->
        <div class="border-0 bg-card/50 p-4 rounded-lg">
          <h3 class="flex items-center space-x-2 text-lg font-semibold mb-3">
            <Users class="h-5 w-5 text-primary" />
            <span>타겟 세그먼트</span>
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="segment in campaignData.segments"
              :key="segment"
              class="flex items-center space-x-1 px-2 py-1 bg-muted text-muted-foreground text-sm rounded"
            >
              <CheckCircle class="h-3 w-3" />
              <span>{{ segment }}</span>
            </span>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="border-0 bg-card/50 p-4 rounded-lg">
          <h3 class="flex items-center space-x-2 text-lg font-semibold mb-3">
            <BarChart3 class="h-5 w-5 text-primary" />
            <span>예상 성과</span>
          </h3>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center p-3 bg-background/50 rounded-lg">
              <div class="text-2xl font-bold text-primary">
                {{ campaignData.metrics.expectedLTV }}
              </div>
              <div class="text-sm text-muted-foreground">LTV</div>
            </div>
            <div class="text-center p-3 bg-background/50 rounded-lg">
              <div class="text-2xl font-bold text-primary">
                {{ campaignData.metrics.expectedLTVLatest }}
              </div>
              <div class="text-sm text-muted-foreground">LTV (최근 12주)</div>
            </div>
            <div class="text-center p-3 bg-background/50 rounded-lg">
              <div class="text-2xl font-bold text-primary">
                {{ campaignData.metrics.expectedRevisitRate }}
              </div>
              <div class="text-sm text-muted-foreground">재방문율</div>
            </div>
            <div class="text-center p-3 bg-background/50 rounded-lg">
              <div class="text-2xl font-bold text-primary">
                {{ campaignData.metrics.expectedConversion }}
              </div>
              <div class="text-sm text-muted-foreground">전환율</div>
            </div>
          </div>
        </div>

        <!-- Channel Distribution -->
        <div class="border-0 bg-card/50 p-4 rounded-lg">
          <h3 class="flex items-center space-x-2 text-lg font-semibold mb-3">
            <Share2 class="h-5 w-5 text-primary" />
            <span>채널 배분</span>
          </h3>
          <div class="space-y-3">
            <div 
              v-for="channel in campaignData.channels" 
              :key="channel.name" 
              class="flex items-center justify-between p-3 bg-background/50 rounded-lg"
            >
              <span class="font-medium text-foreground">{{ channel.name }}</span>
              <div class="flex items-center space-x-3">
                <span class="px-2 py-1 border border-border text-sm rounded">{{ channel.allocation }}%</span>
                <span class="text-sm font-medium text-primary">{{ channel.cost }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Budget Summary -->
        <div class="border-primary/20 bg-primary/10 p-6 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">
                총 마케팅 예산
              </h3>
              <p class="text-sm text-muted-foreground">
                월간 예산 배정
              </p>
            </div>
            <div class="text-right space-y-1">
              <div class="text-3xl font-bold text-primary">
                {{ campaignData.totalBudget }}
              </div>
              <div class="text-sm text-muted-foreground">
                예상 수익: {{ campaignData.expectedRevenue }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div v-if="!isLoading && !error && !isExecuting" class="flex justify-end gap-2 p-6 border-t border-border">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
          data-testid="button-cancel-execution"
        >
          취소
        </button>
        <button 
          @click="handleExecute"
          :disabled="!campaignData"
          class="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50"
          data-testid="button-execute-campaign"
        >
          <Rocket class="h-4 w-4" />
          <span>캠페인 실행</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Success Modal -->
  <div 
    v-if="showSuccessModal" 
    class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
    @click="handleSuccessModalClose"
  >
    <div 
      class="bg-background border border-border rounded-lg max-w-md w-full"
      @click.stop
    >
      <div class="p-6 text-center space-y-6">
         <div class="flex justify-center">
           <div class="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
             <svg class="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
               <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
             </svg>
           </div>
         </div>
         <div class="space-y-3">
           <h3 class="text-xl font-semibold text-foreground">캠페인 실행이 완료되었습니다!</h3>
           <p class="text-muted-foreground">
             {{ successMessage }}
           </p>
         </div>
         <div class="pt-2">
           <button 
             @click="handleSuccessModalClose"
             class="w-full px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors font-medium"
           >
             확인
           </button>
         </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Rocket, Target, Users, BarChart3, Share2, CheckCircle, AlertTriangle } from 'lucide-vue-next'
import { api, type CampaignData, type CampaignExecutionPayload, type CampaignExecutionResponse } from '@/services/campaignApi'

interface Props {
  open: boolean
  campaignData?: CampaignData
  channelData?: any // ChannelDistribution의 channelData
  campaignId?: string // API에서 데이터를 가져올 때 사용
  autoLoad?: boolean // 모달이 열릴 때 자동으로 데이터 로드
}

const props = withDefaults(defineProps<Props>(), {
  autoLoad: false
})

const emit = defineEmits<{
  close: []
  execute: [response: CampaignExecutionResponse]
  retry: []
  loaded: [data: CampaignData]
  error: [error: string]
}>()

// Reactive state
const isLoading = ref(false)
const isExecuting = ref(false)
const error = ref<string | null>(null)
const loadedCampaignData = ref<CampaignData | null>(null)

// Execution progress state
const executionStep = ref(0) // 0: 시작, 1: 캠페인 실행 완료, 2: 세그먼트 생성 완료
const executionProgress = ref('')
const showSuccessModal = ref(false)
const successMessage = ref('')

// Computed values
const campaignData = computed(() => {
  return props.campaignData || loadedCampaignData.value
})

// 캠페인 데이터 로드
const loadCampaignData = async () => {
  if (!props.campaignId) return

  try {
    isLoading.value = true
    error.value = null

    const response = await api.getCampaign(props.campaignId)
    
    if (response.success && response.data) {
      loadedCampaignData.value = response.data
      emit('loaded', response.data)
    } else {
      throw new Error(response.message || '캠페인 데이터를 불러올 수 없습니다.')
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
    error.value = errorMessage
    emit('error', errorMessage)
  } finally {
    isLoading.value = false
  }
}

// channelData를 활용한 세그먼트 생성 API 호출
const createSegmentsFromChannelData = async (payload: CampaignExecutionPayload) => {
  if (!props.channelData) {
    console.log('⚠️ channelData가 없어서 세그먼트 생성 건너뜀')
    return null
  }

  try {
    console.log('🎯 channelData를 활용한 세그먼트 생성 API 호출 시작:', props.channelData)
    
    const segmentResponse = await api.createSegmentsFromChannelData(
      props.channelData, 
      payload.objective
    )
    
    console.log('📊 세그먼트 생성 API 응답:', segmentResponse)
    
    if (segmentResponse.success && segmentResponse.data) {
      console.log('✅ 세그먼트 생성 완료:', segmentResponse.data)
      return segmentResponse.data
    } else {
      console.warn('⚠️ 세그먼트 생성 API 응답에 문제가 있음:', segmentResponse)
      return null
    }
  } catch (error) {
    console.error('❌ 세그먼트 생성 API 호출 실패:', error)
    return null
  }
}

// 캠페인 실행
const handleExecute = async () => {
  if (!campaignData.value) return

  try {
    isExecuting.value = true
    error.value = null
    executionStep.value = 0
    executionProgress.value = '캠페인 실행을 시작합니다...'

    console.log('🚀 캠페인 실행 시작')

    // 실행 페이로드 준비
    const payload: CampaignExecutionPayload = {
      campaignId: campaignData.value.id,
      objective: campaignData.value.objective,
      selectedSegments: Array.isArray(campaignData.value.segments) 
        ? campaignData.value.segments.map(s => typeof s === 'string' ? s : s.name)
        : [],
      channelAllocation: campaignData.value.channels,
      totalBudget: parseFloat(campaignData.value.totalBudget.replace(/[₩,K]/g, '')) * 1000,
      executionDate: new Date().toISOString()
    }

    console.log('📋 캠페인 실행 페이로드:', payload)

    // 1. 기본 캠페인 실행 API 호출
    executionProgress.value = '기본 캠페인을 실행하고 있습니다...'
    const campaignResponse = await api.executeCampaign(payload)
    console.log('📡 기본 캠페인 실행 API 응답:', campaignResponse)

    if (!campaignResponse.success || !campaignResponse.data) {
      throw new Error(campaignResponse.message || '캠페인 실행에 실패했습니다.')
    }

    executionStep.value = 1
    executionProgress.value = '기본 캠페인 실행이 완료되었습니다. 세그먼트를 생성하고 있습니다...'

    // 2. channelData를 활용한 세그먼트 생성 API 호출
    const segmentResults = await createSegmentsFromChannelData(payload)

    executionStep.value = 2
    executionProgress.value = '모든 작업이 완료되었습니다!'

    // 3. 세그먼트 생성 결과를 캠페인 응답에 병합
    const finalResponse = {
      ...campaignResponse.data,
      segmentCreationResults: segmentResults,
      hasSegmentCreation: !!segmentResults && segmentResults.length > 0
    }

    console.log('✅ 캠페인 실행 완료 (세그먼트 생성 포함):', finalResponse)
    
    emit('execute', finalResponse)
    
    // 성공 메시지 설정
    const segmentCount = segmentResults?.filter((r: any) => r.success).length || 0
    successMessage.value = segmentCount > 0 
      ? `캠페인이 실행되고 ${segmentCount}개의 세그먼트가 생성되었습니다.`
      : '캠페인이 성공적으로 실행되었습니다.'
    
    // 실행 완료 후 성공 모달 표시
    setTimeout(() => {
      isExecuting.value = false
      showSuccessModal.value = true
    }, 1000)

  } catch (err) {
    console.error('❌ 캠페인 실행 중 오류:', err)
    const errorMessage = err instanceof Error ? err.message : '캠페인 실행 중 오류가 발생했습니다.'
    error.value = errorMessage
    emit('error', errorMessage)
    isExecuting.value = false
  }
}

// 성공 모달 닫기
const handleSuccessModalClose = () => {
  showSuccessModal.value = false
  emit('close')
}

// 재시도 핸들러
const handleRetry = () => {
  emit('retry')
  if (props.campaignId) {
    loadCampaignData()
  }
}

// 배경 클릭으로 모달 닫기 (실행 중이 아닐 때만)
const handleBackdropClick = () => {
  if (!isExecuting.value) {
    emit('close')
  }
}

// 모달이 열릴 때 자동으로 데이터 로드
watch(() => props.open, (isOpen) => {
  if (isOpen && props.autoLoad && props.campaignId && !props.campaignData) {
    loadCampaignData()
  }
})

// 컴포넌트 마운트 시 데이터 로드 (필요한 경우)
onMounted(() => {
  if (props.open && props.autoLoad && props.campaignId && !props.campaignData) {
    loadCampaignData()
  }
})
</script>
