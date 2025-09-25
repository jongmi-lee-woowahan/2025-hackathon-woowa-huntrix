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
          <span>Campaign Execution Confirmation</span>
        </h2>
      </div>

      <!-- Execution Progress State -->
      <div v-if="isExecuting" class="p-8 text-center">
        <div class="flex flex-col items-center space-y-6">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <div class="space-y-2">
            <h3 class="text-xl font-semibold text-foreground">Campaign Executing...</h3>
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
                Preparing Campaign Execution
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
                Creating Customer Segments
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="p-8 text-center">
        <div class="flex flex-col items-center space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p class="text-muted-foreground">Loading campaign data...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-8 text-center">
        <div class="flex flex-col items-center space-y-4">
          <div class="p-3 bg-red-500/10 rounded-full">
            <AlertTriangle class="h-8 w-8 text-red-500" />
          </div>
          <div class="space-y-2">
            <h3 class="text-lg font-semibold text-foreground">An Error Occurred</h3>
            <p class="text-muted-foreground">{{ error }}</p>
          </div>
          <button 
            @click="$emit('retry')"
            class="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
      
      <!-- Content - only show when not loading, not executing and no error -->
      <div v-else-if="campaignData" class="p-6 space-y-6">
        <!-- Campaign Objective -->
        <div class="border-0 bg-card/50 p-4 rounded-lg">
          <h3 class="flex items-center space-x-2 text-lg font-semibold mb-3">
            <Target class="h-5 w-5 text-primary" />
            <span>Campaign Objective</span>
          </h3>
          <p class="text-foreground leading-relaxed">
            {{ campaignData.objective }}
          </p>
        </div>

        <!-- Target Segments -->
        <div class="border-0 bg-card/50 p-4 rounded-lg">
          <h3 class="flex items-center space-x-2 text-lg font-semibold mb-3">
            <Users class="h-5 w-5 text-primary" />
            <span>Target Segments</span>
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
            <span>Expected Performance</span>
          </h3>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center p-3 bg-background/50 rounded-lg">
              <div class="text-2xl font-bold text-primary">
                {{ campaignData.metrics.expectedRevisitRate }}
              </div>
              <div class="text-sm text-muted-foreground">Revisit Rate</div>
            </div>
            <div class="text-center p-3 bg-background/50 rounded-lg">
              <div class="text-2xl font-bold text-primary">
                {{ campaignData.metrics.expectedConversion }}
              </div>
              <div class="text-sm text-muted-foreground">Conversion Rate</div>
            </div>
            <div class="text-center p-3 bg-background/50 rounded-lg">
              <div class="text-2xl font-bold text-primary">
                {{ campaignData.metrics.expectedROI }}
              </div>
              <div class="text-sm text-muted-foreground">ROI</div>
            </div>
          </div>
        </div>

        <!-- Channel Distribution -->
        <div class="border-0 bg-card/50 p-4 rounded-lg">
          <h3 class="flex items-center space-x-2 text-lg font-semibold mb-3">
            <Share2 class="h-5 w-5 text-primary" />
            <span>Channel Distribution</span>
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
                Total Marketing Budget
              </h3>
              <p class="text-sm text-muted-foreground">
                Monthly Budget Allocation
              </p>
            </div>
            <div class="text-right space-y-1">
              <div class="text-3xl font-bold text-primary">
                {{ campaignData.totalBudget }}
              </div>
              <div class="text-sm text-muted-foreground">
                Expected Revenue: {{ campaignData.expectedRevenue }}
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
          Cancel
        </button>
        <button 
          @click="handleExecute"
          :disabled="!campaignData"
          class="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50"
          data-testid="button-execute-campaign"
        >
          <Rocket class="h-4 w-4" />
          <span>Execute Campaign</span>
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
           <h3 class="text-xl font-semibold text-foreground">Campaign execution completed!</h3>
           <p class="text-muted-foreground">
             {{ successMessage }}
           </p>
         </div>
         <div class="pt-2">
           <button 
             @click="handleSuccessModalClose"
             class="w-full px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors font-medium"
           >
             Confirm
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
  channelData?: any // ChannelData from ChannelDistribution
  campaignId?: string // Used when fetching data from API
  autoLoad?: boolean // Automatically load data when modal opens
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
const executionStep = ref(0) // 0: start, 1: campaign execution complete, 2: segment creation complete
const executionProgress = ref('')
const showSuccessModal = ref(false)
const successMessage = ref('')

// Computed values
const campaignData = computed(() => {
  return props.campaignData || loadedCampaignData.value
})

// Load campaign data
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
      throw new Error(response.message || 'Unable to load campaign data.')
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.'
    error.value = errorMessage
    emit('error', errorMessage)
  } finally {
    isLoading.value = false
  }
}

// Create segments using channelData API call
const createSegmentsFromChannelData = async (payload: CampaignExecutionPayload) => {
  if (!props.channelData) {
    console.log('⚠️ Skipping segment creation as channelData is not available')
    return null
  }

  try {
    console.log('🎯 Starting segment creation API call using channelData:', props.channelData)
    
    const segmentResponse = await api.createSegmentsFromChannelData(
      props.channelData, 
      payload.objective
    )
    
    console.log('📊 Segment creation API response:', segmentResponse)
    
    if (segmentResponse.success && segmentResponse.data) {
      console.log('✅ Segment creation completed:', segmentResponse.data)
      return segmentResponse.data
    } else {
      console.warn('⚠️ Issue with segment creation API response:', segmentResponse)
      return null
    }
  } catch (error) {
    console.error('❌ Segment creation API call failed:', error)
    return null
  }
}

// Execute campaign
const handleExecute = async () => {
  if (!campaignData.value) return

  try {
    isExecuting.value = true
    error.value = null
    executionStep.value = 0
    executionProgress.value = 'Starting campaign execution...'

    console.log('🚀 Starting campaign execution')

    // Prepare execution payload
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

    console.log('📋 Campaign execution payload:', payload)

    // 1. Basic campaign execution API call
    executionProgress.value = 'Executing basic campaign...'
    const campaignResponse = await api.executeCampaign(payload)
    console.log('📡 Basic campaign execution API response:', campaignResponse)

    if (!campaignResponse.success || !campaignResponse.data) {
      throw new Error(campaignResponse.message || 'Campaign execution failed.')
    }

    executionStep.value = 1
    executionProgress.value = 'Basic campaign execution completed. Creating segments...'

    // 2. Create segments using channelData API call
    const segmentResults = await createSegmentsFromChannelData(payload)

    executionStep.value = 2
    executionProgress.value = 'All tasks completed!'

    // 3. Merge segment creation results with campaign response
    const finalResponse = {
      ...campaignResponse.data,
      segmentCreationResults: segmentResults,
      hasSegmentCreation: !!segmentResults && segmentResults.length > 0
    }

    console.log('✅ Campaign execution completed (including segment creation):', finalResponse)
    
    emit('execute', finalResponse)
    
    // Set success message
    const segmentCount = segmentResults?.filter((r: any) => r.success).length || 0
    successMessage.value = segmentCount > 0 
      ? `Campaign executed and ${segmentCount} segments created.`
      : 'Campaign executed successfully.'
    
    // Show success modal after execution completion
    setTimeout(() => {
      isExecuting.value = false
      showSuccessModal.value = true
    }, 1000)

  } catch (err) {
    console.error('❌ Error during campaign execution:', err)
    const errorMessage = err instanceof Error ? err.message : 'An error occurred during campaign execution.'
    error.value = errorMessage
    emit('error', errorMessage)
    isExecuting.value = false
  }
}

// Close success modal
const handleSuccessModalClose = () => {
  showSuccessModal.value = false
  emit('close')
}

// Retry handler
const handleRetry = () => {
  emit('retry')
  if (props.campaignId) {
    loadCampaignData()
  }
}

// Close modal on background click (only when not executing)
const handleBackdropClick = () => {
  if (!isExecuting.value) {
    emit('close')
  }
}

// Automatically load data when modal opens
watch(() => props.open, (isOpen) => {
  if (isOpen && props.autoLoad && props.campaignId && !props.campaignData) {
    loadCampaignData()
  }
})

// Load data on component mount (if needed)
onMounted(() => {
  if (props.open && props.autoLoad && props.campaignId && !props.campaignData) {
    loadCampaignData()
  }
})
</script>
