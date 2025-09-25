<template>
  <div class="space-y-6">
    <div class="border-0 bg-card/50 backdrop-blur-sm p-6 rounded-lg">
      <h2 class="flex items-center space-x-2 text-xl pb-2">
        <Share2 class="h-5 w-5 text-primary" />
        <span>{{ $t('channels.title') }}</span>
      </h2>
      <p class="text-muted-foreground">
        {{ $t('channels.subtitle') }}
      </p>
    </div>

    <!-- agent-3 데이터 오류 상태 -->
    <div v-if="channelDataError" class="border border-destructive/20 bg-destructive/5 rounded-lg p-4">
      <h3 class="font-semibold text-destructive mb-2">{{ $t('channels.channelDataError') }}</h3>
      <p class="text-sm text-muted-foreground mb-2">{{ channelDataError }}</p>
      <details class="text-xs">
        <summary class="cursor-pointer text-muted-foreground hover:text-foreground">{{ $t('channels.viewOriginalResponse') }}</summary>
        <pre class="mt-2 p-2 bg-muted rounded text-xs overflow-auto">{{ JSON.stringify(rawChannelData, null, 2) }}</pre>
      </details>
    </div>

    <!-- 로딩 상태 표시 -->
    <div v-if="isLoading" class="flex items-center justify-center p-12">
      <div class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="text-sm text-muted-foreground">{{ $t('channels.aiAnalyzing') }}</p>
      </div>
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="channel in channels"
        :key="channel.id"
        class="border-0 bg-card/50 backdrop-blur-sm p-6 rounded-lg"
      >
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <component :is="channel.icon" :class="['h-5 w-5', channel.color]" />
              <div class="flex-1">
                <h4 class="font-semibold text-foreground">{{ channel.name }}</h4>
                <p v-if="channel.description" class="text-xs text-muted-foreground mb-1">{{ channel.description }}</p>
                <!-- Labels 표시 (agent-1 방식 동일 적용) -->
                <div v-if="channel.labels && channel.labels.length > 0" class="flex flex-wrap gap-1 mb-1">
                  <span
                    v-for="label in channel.labels.slice(0, 3)"
                    :key="label"
                    class="px-2 py-1 text-xs rounded inline-flex items-center space-x-1 bg-primary/5 text-primary"
                  >
                    <Tag class="h-3 w-3" />
                    <span>{{ label }}</span>
                  </span>
                  <span v-if="channel.labels.length > 3" class="text-xs text-muted-foreground px-2 py-1">
                    +{{ channel.labels.length - 3 }} more
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <span class="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                {{ channel.cost }}
              </span>
              <span class="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                {{ $t('channels.reach') }}: {{ channel.customerCount }} {{ $t('segmentation.people') }}
              </span>
            </div>
          </div>
          
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">{{ $t('channels.marketingChannelRatio') }}</span>
              <span class="font-medium text-foreground">{{ channel.allocation }}%</span>
            </div>
            <div class="relative">
              <input
                type="range"
                :value="channel.allocation"
                @input="updateAllocation(channel.id, Number(($event.target as HTMLInputElement).value))"
                min="0"
                max="100"
                step="1"
                class="w-full opacity-60 cursor-not-allowed channel-slider"
              :data-testid="`slider-${channel.id}`"
                :style="{ '--value': `${channel.allocation}%` }"
                disabled
            />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-0 bg-card/50 backdrop-blur-sm p-6 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="space-y-2">
          <h4 class="text-lg font-semibold text-foreground">
            {{ $t('channels.channelBudgetComplete') }}
          </h4>
          <p class="text-sm text-muted-foreground">
            {{ $t('channels.totalExpectedCost') }}: ₩{{ totalBudget.toLocaleString() }}
          </p>
        </div>
        <div class="text-right space-y-1">
          <div class="text-2xl font-bold text-green-500">
            {{ channels.length }} {{ $t('channels.channels') }}
          </div>
          <div class="text-sm text-muted-foreground">
            {{ $t('channels.totalPeopleReached', { count: totalCustomers.toLocaleString() }) }}
          </div>
        </div>
      </div>
      
      <div class="mt-4 pt-4 border-t border-border">
        <button
          @click="handleNext"
          class="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md flex items-center justify-center"
          data-testid="button-finalize-campaign"
        >
          <Rocket class="h-4 w-4 mr-2" />
          {{ $t('channels.finalCampaignReview') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Share2, Smartphone, Mail, Search, MessageCircle, Rocket, Target, Tag } from 'lucide-vue-next'

interface Channel {
  id: string
  name: string
  icon: any
  allocation: number
  cost: string
  customerCount: number
  color: string
  labels?: string[]
  description?: string
}

interface Props {
  budget?: number
  channelData?: any
  selectedConditions?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  budget: 1000000,
  channelData: null
})

const emit = defineEmits<{
  'channels-configured': [channels: Channel[]]
}>()

// I18n setup
const { t, te } = useI18n()

// Labels 번역 함수 (agent API 응답 처리용)
const translateLabel = (label: string): string => {
  if (!label) return ''
  
  try {
    const translationKey = `labels.${label}`
    // 번역 키가 존재하는지 먼저 확인
    if (te(translationKey)) {
      return t(translationKey)
    }
    // 번역이 없으면 console에 로그 출력하고 원본 반환
    console.warn(`🌐 Missing translation for channel label: "${label}"`)
    return label
  } catch (error) {
    console.error('Label translation error:', error, 'for label:', label)
    return label
  }
}

// 기본 채널 아이콘 맵핑
const getChannelIcon = (name: string) => {
  const iconMap: { [key: string]: any } = {
    // English channel names
    'Social Media': Share2,
    'Mobile': Smartphone,
    'Mobile Ads': Smartphone,
    'Email': Mail,
    'Email Marketing': Mail,
    'Search': Search,
    'Search Ads': Search,
    'Messenger': MessageCircle,
    'Push Notifications': Smartphone,
    'In-App Messages': Smartphone,
    'SMS': MessageCircle,
    'Text Message': MessageCircle,
    // Korean channel names (backward compatibility)
    '소셜미디어': Share2,
    '모바일': Smartphone,
    '모바일 광고': Smartphone,
    '이메일': Mail,
    '이메일 마케팅': Mail,
    '검색': Search,
    '검색 광고': Search,
    '메신저': MessageCircle,
    '푸시 알림': Smartphone,
    '인앱 메시지': Smartphone,
    '카카오톡': MessageCircle,
    '문자 (SMS)': MessageCircle,
    '문자': MessageCircle
  }
  return iconMap[name] || Target
}

// 채널별 예산 가격 (1인당 비용)
const getChannelPrice = (name: string): number => {
  const priceMap: { [key: string]: number } = {
    // English channel names
    'Push Notifications': 1000,    // 1k
    'In-App Messages': 2000,       // 2k
    'Messenger': 3000,             // 3k
    'Email': 4000,                 // 4k
    'Email Marketing': 4000,       // 4k
    'SMS': 5000,                   // 5k
    'Text Message': 5000,          // 5k
    'Social Media': 3000,          // 3k
    'Mobile': 2000,                // 2k
    'Mobile Ads': 2000,            // 2k
    'Search': 3500,                // 3.5k
    'Search Ads': 3500,            // 3.5k
    // Korean channel names (backward compatibility)
    '푸시 알림': 1000,              // 1k
    '인앱 메시지': 2000,             // 2k
    '카카오톡': 3000,               // 3k
    '이메일': 4000,                 // 4k
    '문자 (SMS)': 5000,            // 5k
    '문자': 5000                   // 5k
  }
  return priceMap[name] || 1000 // 기본값 1k
}

// 한글 채널명을 영어로 변환하는 함수
const translateChannelName = (koreanName: string): string => {
  const translationMap: { [key: string]: string } = {
    '푸시 알림': 'Push Notifications',
    '인앱 메시지': 'In-App Messages',
    '카카오톡': 'Messenger',
    '문자 (SMS)': 'SMS',
    '문자': 'SMS',
    '이메일': 'Email',
    '이메일 마케팅': 'Email Marketing',
    '소셜미디어': 'Social Media',
    '모바일': 'Mobile',
    '모바일 광고': 'Mobile Ads',
    '검색': 'Search',
    '검색 광고': 'Search Ads',
    '메신저': 'Messenger'
  }
  return translationMap[koreanName] || koreanName // 매핑되지 않으면 원래 이름 사용
}

// 채널명을 i18n 키로 매핑하는 함수
const getChannelDescriptionKey = (channelName: string): string => {
  const keyMap: { [key: string]: string } = {
    'Push Notifications': 'pushNotifications',
    'In-App Messages': 'inAppMessages',
    'Messenger': 'messenger',
    'SMS': 'sms',
    'Text Message': 'textMessage',
    'Email': 'email',
    'Email Marketing': 'emailMarketing',
    'Social Media': 'socialMedia',
    'Mobile': 'mobile',
    'Mobile Ads': 'mobileAds',
    'Search': 'search',
    'Search Ads': 'searchAds',
    'Messaging': 'messenger', // Messaging을 messenger로 매핑
    // 한글 채널명도 직접 지원
    '푸시 알림': 'pushNotifications',
    '인앱 메시지': 'inAppMessages',
    '카카오톡': 'messenger',
    '문자': 'sms',
    '문자 (SMS)': 'sms',
    '이메일': 'email',
    '이메일 마케팅': 'emailMarketing',
    '소셜미디어': 'socialMedia',
    '모바일': 'mobile',
    '모바일 광고': 'mobileAds',
    '검색': 'search',
    '검색 광고': 'searchAds',
    '메신저': 'messenger'
  }
  return keyMap[channelName] || 'default'
}

// 번역된 채널 설명을 가져오는 함수
const getTranslatedDescription = (channelName: string): string => {
  const descriptionKey = getChannelDescriptionKey(channelName)
  return t(`channels.descriptions.${descriptionKey}`)
}

// 기본 채널 색상 맵핑
const getChannelColor = (index: number) => {
  const colors = [
    'text-blue-500',
    'text-green-500', 
    'text-purple-500',
    'text-orange-500',
    'text-pink-500',
    'text-indigo-500',
    'text-red-500',
    'text-yellow-500'
  ]
  return colors[index % colors.length]
}

const channels = ref<Channel[]>([])
const isLoading = ref(true)
const channelDataError = ref<string>('')
const rawChannelData = ref<any>(null)

// agent-3 channelData를 사용하여 채널 초기화
const initializeChannels = () => {
  console.log('🎯 agent-3 Channel data 초기화:', props.channelData)
  
  // 오류 상태 초기화
  channelDataError.value = ''
  rawChannelData.value = null
  
  try {
    if (!props.channelData || !props.channelData.output) {
      console.log('⚠️ channelData not available. Using default data')
      initializeDefaultChannels()
      return
    }
    
    const outputString = props.channelData.output
    console.log('📄 Output 문자엱 처리 시작')
    
    // JSON 배열 추출
    const jsonStart = outputString.indexOf('[')
    const jsonEnd = outputString.lastIndexOf(']')
    
    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      throw new Error('Could not find JSON array.')
    }
    
    const jsonString = outputString.substring(jsonStart, jsonEnd + 1)
    const apiChannels = JSON.parse(jsonString)
    
    if (!Array.isArray(apiChannels) || apiChannels.length === 0) {
      throw new Error('No valid channel array found.')
    }
    
    console.log('✅ agent-3 API 데이터 사용 - 채널 개수:', apiChannels.length)
    
    // agent-3 API 데이터 사용 - 각 채널을 매핑
    channels.value = apiChannels.map((apiChannel: any, index: number) => {
      const originalChannelName = apiChannel.name || `Channel ${index + 1}`
      const englishChannelName = translateChannelName(originalChannelName) // 한글을 영어로 변환
      const customerCount = Math.max(apiChannel.customer_cnt || 1000, 1)
      const customerRatio = Math.max(apiChannel.customer_ratio || 0.01, 0)
      const pricePerCustomer = getChannelPrice(originalChannelName) // 가격 계산은 원래 이름으로
      const totalCost = customerCount * pricePerCustomer
      
      // Labels 처리 및 번역
      let processedLabels: string[] = []
      if (apiChannel.labels && Array.isArray(apiChannel.labels)) {
        processedLabels = apiChannel.labels
          .filter((label: any) => typeof label === 'string' && label.trim().length > 0)
          .map((label: string) => {
            const trimmedLabel = label.trim()
            // 실시간으로 label을 번역하여 반환
            return translateLabel(trimmedLabel)
          })
      }
      
      return {
        id: `channel_${index}`,
        name: englishChannelName, // UI에는 영어 이름 표시
        icon: getChannelIcon(originalChannelName), // 아이콘 매핑은 원래 이름으로
        allocation: Math.round(customerRatio * 100),
        cost: `₩${Math.round(totalCost / 1000)}K`,
        customerCount: customerCount,
        color: getChannelColor(index),
        labels: processedLabels,
        description: getTranslatedDescription(englishChannelName)
      }
    })
    
    console.log('🎉 channels 배열 생성 완료:', channels.value)
    isLoading.value = false
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    channelDataError.value = `Failed to process agent-3 channel data: ${errorMsg}`
    rawChannelData.value = props.channelData
    console.error('❌ ChannelDistribution 초기화 실패:', error)
    
    // 오류 시 기본 데이터 사용
    console.log('⚠️ Using default data due to error')
    initializeDefaultChannels()
  }
}

// 기본 채널 데이터로 초기화
const initializeDefaultChannels = () => {
  channels.value = [
  {
    id: 'social',
      name: 'Social Media',
    icon: Share2,
    allocation: 35,
    cost: '₩350K',
      customerCount: 45200,
      color: 'text-blue-500',
      labels: [],
      description: getTranslatedDescription('Social Media')
  },
  {
    id: 'mobile',
      name: 'Mobile Ads',
    icon: Smartphone,
    allocation: 25,
    cost: '₩250K',
      customerCount: 38800,
      color: 'text-green-500',
      labels: [],
      description: getTranslatedDescription('Mobile Ads')
  },
  {
    id: 'email',
      name: 'Email Marketing',
    icon: Mail,
    allocation: 15,
    cost: '₩150K',
      customerCount: 25500,
      color: 'text-purple-500',
      labels: [],
      description: getTranslatedDescription('Email Marketing')
  },
  {
    id: 'search',
      name: 'Search Ads',
    icon: Search,
    allocation: 20,
    cost: '₩200K',
      customerCount: 42100,
      color: 'text-orange-500',
      labels: [],
      description: getTranslatedDescription('Search Ads')
  },
  {
    id: 'messaging',
      name: 'Messaging',
    icon: MessageCircle,
    allocation: 5,
    cost: '₩50K',
      customerCount: 15200,
      color: 'text-pink-500',
      labels: [],
      description: getTranslatedDescription('Messaging')
    }
  ]
  isLoading.value = false
}

// props.channelData 변경 감지
watch(() => props.channelData, (newValue) => {
  console.log('📡 channelData props 변경 감지:', newValue)
  initializeChannels()
}, { deep: true, immediate: true })

// 총 예산 계산 (각 채널의 비용 합계)
const totalBudget = computed(() => {
  return channels.value.reduce((sum, channel) => {
    const cost = parseInt(channel.cost.replace(/[₩K,]/g, '')) * 1000
    return sum + cost
  }, 0)
})

// 총 도달 고객 수
const totalCustomers = computed(() => {
  return channels.value.reduce((sum, channel) => sum + channel.customerCount, 0)
})

const updateAllocation = (channelId: string, newAllocation: number) => {
  // 예산 배분 UI가 비활성화되어 있으므로 업데이트하지 않음
  console.log('⚠️ Budget allocation is AI-optimized results. Cannot be modified.')
  return
}


const handleNext = () => {
  emit('channels-configured', channels.value)
}
</script>

<style scoped>
.channel-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;
  position: relative;
}

.channel-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #0CEFD3;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.channel-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #0CEFD3;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  position: relative;
  z-index: 2;
}

/* 웹킷 기반 브라우저용 */
.channel-slider::-webkit-slider-track {
  background: #e5e7eb;
  height: 6px;
  border-radius: 3px;
}

.channel-slider::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 6px;
  background: #0CEFD3;
  border-radius: 3px;
  width: var(--value, 0%);
  z-index: 1;
}

/* 파이어폭스용 */
.channel-slider::-moz-range-track {
  background: #e5e7eb;
  height: 6px;
  border-radius: 3px;
  border: none;
}

.channel-slider::-moz-range-progress {
  background: #0CEFD3;
  height: 6px;
  border-radius: 3px;
}
</style>
