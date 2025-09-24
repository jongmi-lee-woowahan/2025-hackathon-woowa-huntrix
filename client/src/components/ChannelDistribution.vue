<template>
  <div class="space-y-6">
    <div class="border-0 bg-card/50 backdrop-blur-sm p-6 rounded-lg">
      <h2 class="flex items-center space-x-2 text-xl mb-4">
        <Share2 class="h-5 w-5 text-primary" />
        <span>마케팅 채널 배분</span>
      </h2>
      <p class="text-muted-foreground">
        고객 예상 선호도를 기반으로 마케팅 예산을 채널별로 배분해보세요.
      </p>
    </div>
    
    <!-- agent-3 데이터 오류 상태 -->
    <div v-if="channelDataError" class="border border-destructive/20 bg-destructive/5 rounded-lg p-4">
      <h3 class="font-semibold text-destructive mb-2">채널 데이터 오류</h3>
      <p class="text-sm text-muted-foreground mb-2">{{ channelDataError }}</p>
      <details class="text-xs">
        <summary class="cursor-pointer text-muted-foreground hover:text-foreground">원본 응답 데이터 보기</summary>
        <pre class="mt-2 p-2 bg-muted rounded text-xs overflow-auto">{{ JSON.stringify(rawChannelData, null, 2) }}</pre>
      </details>
    </div>

    <!-- 로딩 상태 표시 -->
    <div v-if="isLoading" class="flex items-center justify-center p-12">
      <div class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="text-sm text-muted-foreground">AI가 최적화한 채널 배분을 분석 중입니다...</p>
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
                    +{{ channel.labels.length - 3 }}개 더
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <span class="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                {{ channel.cost }}
              </span>
              <span class="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                도달: {{ channel.customerCount }}명
              </span>
            </div>
          </div>
          
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">마케팅 채널 비율</span>
              <span class="font-medium text-foreground">{{ channel.allocation }}%</span>
            </div>
            <div class="relative">
              <input
                type="range"
                :value="channel.allocation"
                @input="updateAllocation(channel.id, Number(($event.target as HTMLInputElement).value))"
                min="0"
                max="100"
                step="5"
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
            채널별 예산 배분 완료
          </h4>
          <p class="text-sm text-muted-foreground">
            총 예상 비용: ₩{{ totalBudget.toLocaleString() }}
          </p>
        </div>
        <div class="text-right space-y-1">
          <div class="text-2xl font-bold text-green-500">
            {{ channels.length }}개 채널
          </div>
          <div class="text-sm text-muted-foreground">
            총 {{ totalCustomers.toLocaleString() }}명 도달
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
          캠페인 최종 확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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

// 기본 채널 아이콘 맵핑
const getChannelIcon = (name: string) => {
  const iconMap: { [key: string]: any } = {
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
    '문자 (SMS)': MessageCircle
  }
  return iconMap[name] || Target
}

// 채널별 예산 가격 (1인당 비용)
const getChannelPrice = (name: string): number => {
  const priceMap: { [key: string]: number } = {
    '푸시 알림': 1000,      // 1k
    '인앱 메시지': 2000,     // 2k
    '카카오톡': 3000,       // 3k
    '이메일': 4000,         // 4k
    '문자 (SMS)': 5000      // 5k
  }
  return priceMap[name] || 1000 // 기본값 1k
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

// agent-3 channelData를 사용하여 채널 초기화 (오류 처리 포함)
const initializeChannels = () => {
  console.log('🎯 agent-3 Channel data 초기화:', props.channelData)
  console.log('🔍 channelData 타입:', typeof props.channelData)
  console.log('🔍 channelData 배열 여부:', Array.isArray(props.channelData))
  console.log('🔍 channelData 길이:', props.channelData?.length)
  console.log('🔍 channelData null 체크:', props.channelData === null)
  console.log('🔍 channelData undefined 체크:', props.channelData === undefined)
  
  // 오류 상태 초기화
  channelDataError.value = ''
  rawChannelData.value = null
  
  try {
    // agent-3 API 데이터가 있는지 확인하고 파싱 시도
    if (props.channelData && props.channelData.output) {
      console.log('✅ agent-3 API 데이터 파싱 시작')
      
      const outputString = props.channelData.output
      const jsonStart = outputString.indexOf('[')
      const jsonEnd = outputString.lastIndexOf(']')
      
      if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
        throw new Error('agent-3 API 응답에서 JSON 배열을 찾을 수 없습니다.')
      }
      
      const jsonString = outputString.substring(jsonStart, jsonEnd + 1)
      const apiChannels = JSON.parse(jsonString)
      
      if (!Array.isArray(apiChannels) || apiChannels.length === 0) {
        throw new Error('agent-3 API에서 반환된 채널 데이터가 유효하지 않습니다.')
      }
      
      console.log('✅ agent-3 API 데이터 사용 - 채널 개수:', apiChannels.length)
      
      // agent-3 API 데이터 사용
      channels.value = apiChannels.map((apiChannel: any, index: number) => {
      console.log(`📊 처리 중인 채널 ${index}:`, apiChannel)
      console.log(`  - name: ${apiChannel.name}`)
      console.log(`  - description: ${apiChannel.description}`)
      console.log(`  - customer_ratio: ${apiChannel.customer_ratio}`)
      console.log(`  - customer_cnt: ${apiChannel.customer_cnt}`)
      console.log(`  - lables:`, apiChannel.lables)
      
      const customerCount = apiChannel.customer_cnt || 1000
      const pricePerCustomer = getChannelPrice(apiChannel.name)
      const totalCost = customerCount * pricePerCustomer
      
      const mappedChannel = {
        id: `channel_${index}`,
        name: apiChannel.name || `채널 ${index + 1}`,
        icon: getChannelIcon(apiChannel.name),
        allocation: Math.round((apiChannel.customer_ratio || 0.2) * 100), // customer_ratio를 백분율로 변환
        cost: `₩${Math.round(totalCost / 1000)}K`, // customer_cnt * 예산가격
        customerCount: customerCount, // customer_cnt 직접 사용
        color: getChannelColor(index),
        labels: apiChannel.lables || [], // API에서 'lables' 사용 (오타)
        description: apiChannel.description || null // description이 없으면 표시하지 않음
      }
      
      console.log(`✨ 매핑된 채널 ${index}:`, mappedChannel)
      return mappedChannel
      })
      
      console.log('🎉 agent-3 데이터로 channels 배열 생성 완료:', channels.value)
      isLoading.value = false
      
    } else if (props.channelData === null) {
      console.log('⚠️ channelData가 null입니다. agent-3 API 데이터 로딩 중...')
      isLoading.value = true
      channels.value = [] // 로딩 중에는 빈 배열
      return
      
    } else {
      throw new Error('agent-3 API 데이터가 없거나 형식이 올바르지 않습니다.')
    }
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    channelDataError.value = `agent-3 채널 데이터 처리 실패: ${errorMsg}`
    rawChannelData.value = props.channelData
    console.error('❌ agent-3 ChannelDistribution 초기화 실패:', error)
    
    // 오류 시 기본 데이터 사용
    console.log('⚠️ 오류로 인해 기본 데이터 사용')
    initializeDefaultChannels()
  }
}

// 기본 채널 데이터로 초기화
const initializeDefaultChannels = () => {
  channels.value = [
    {
      id: 'social',
      name: '소셜미디어',
      icon: Share2,
      allocation: 35,
      cost: '₩350K',
      customerCount: 45200,
      color: 'text-blue-500',
      labels: [],
      description: null
    },
    {
      id: 'mobile',
      name: '모바일 광고',
      icon: Smartphone,
      allocation: 25,
      cost: '₩250K',
      customerCount: 38800,
      color: 'text-green-500',
      labels: [],
      description: null
    },
    {
      id: 'email',
      name: '이메일 마케팅',
      icon: Mail,
      allocation: 15,
      cost: '₩150K',
      customerCount: 25500,
      color: 'text-purple-500',
      labels: [],
      description: null
    },
    {
      id: 'search',
      name: '검색 광고',
      icon: Search,
      allocation: 20,
      cost: '₩200K',
      customerCount: 42100,
      color: 'text-orange-500',
      labels: [],
      description: null
    },
    {
      id: 'messaging',
      name: '메신저',
      icon: MessageCircle,
      allocation: 5,
      cost: '₩50K',
      customerCount: 15200,
      color: 'text-pink-500',
      labels: [],
      description: null
    }
  ]
  isLoading.value = false
}

// props.channelData 변경 감지 (더 상세한 디버깅)
watch(() => props.channelData, (newValue, oldValue) => {
  console.log('📡 channelData props 변경 감지:')
  console.log('  - 이전값:', oldValue)
  console.log('  - 새값:', newValue)
  console.log('  - 새값 타입:', typeof newValue)
  console.log('  - 새값 배열 여부:', Array.isArray(newValue))
  console.log('  - 새값 길이:', newValue?.length)
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
  console.log('⚠️ 예산 배분은 AI가 최적화한 결과입니다. 수정할 수 없습니다.')
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
