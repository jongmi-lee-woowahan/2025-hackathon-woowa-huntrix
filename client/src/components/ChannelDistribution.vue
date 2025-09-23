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

    <div class="grid gap-4">
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
                <div v-if="channel.labels && channel.labels.length > 0" class="flex flex-wrap gap-1 mb-1">
                  <span 
                    v-for="label in channel.labels" 
                    :key="label"
                    class="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded"
                  >
                    {{ label }}
                  </span>
                </div>
                <p class="text-sm text-muted-foreground">
                  고객 예상 선호도: 
                  <span :class="['ml-1 font-medium', getAffinityColor(channel.affinity)]">
                    {{ channel.affinity }}%
                  </span>
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <span class="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                {{ channel.cost }}
              </span>
              <span class="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                도달: {{ channel.reach }}
              </span>
            </div>
          </div>
          
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">예산 배분</span>
              <span class="font-medium text-foreground">{{ channel.allocation }}%</span>
            </div>
            <input
              type="range"
              :value="channel.allocation"
              @input="updateAllocation(channel.id, Number(($event.target as HTMLInputElement).value))"
              min="0"
              max="100"
              step="5"
              class="w-full opacity-50 cursor-not-allowed"
              :data-testid="`slider-${channel.id}`"
              disabled
            />
          </div>
        </div>
      </div>
    </div>

    <div class="border-0 bg-card/50 backdrop-blur-sm p-6 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="space-y-2">
          <h4 class="text-lg font-semibold text-foreground">
            총 예산 배분
          </h4>
          <p class="text-sm text-muted-foreground">
            전체 예산: ₩{{ (budget / 1000).toFixed(0) }}K
          </p>
        </div>
        <div class="text-right space-y-1">
          <div :class="['text-2xl font-bold', totalAllocation === 100 ? 'text-green-500' : 'text-yellow-500']">
            {{ totalAllocation }}%
          </div>
          <div class="text-sm text-muted-foreground">
            {{ totalAllocation === 100 ? '완료' : `${100 - totalAllocation}% 남음` }}
          </div>
        </div>
      </div>
      
      <div v-if="totalAllocation === 100" class="mt-4 pt-4 border-t border-border">
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
import { Share2, Smartphone, Mail, Search, MessageCircle, Rocket, Target } from 'lucide-vue-next'

interface Channel {
  id: string
  name: string
  icon: any
  affinity: number
  allocation: number
  cost: string
  reach: string
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
    '메신저': MessageCircle
  }
  return iconMap[name] || Target
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

// channelData가 있으면 API 데이터를 사용하고, 없으면 기본 데이터 사용
const initializeChannels = () => {
  console.log('🎯 Channel data 초기화:', props.channelData)
  
  if (props.channelData && Array.isArray(props.channelData)) {
    // API 데이터 사용
    channels.value = props.channelData.map((apiChannel: any, index: number) => ({
      id: `channel_${index}`,
      name: apiChannel.name || `채널 ${index + 1}`,
      icon: getChannelIcon(apiChannel.name),
      affinity: Math.round((apiChannel.customer_ratio || 0.5) * 100), // customer_ratio를 백분율로 변환
      allocation: Math.round((apiChannel.budget_ratio || (100 / props.channelData.length))), // 균등 배분
      cost: `₩${Math.round(props.budget * (apiChannel.budget_ratio || (1 / props.channelData.length)) / 1000)}K`,
      reach: `${Math.round((props.budget * (apiChannel.budget_ratio || (1 / props.channelData.length))) / 25 / 1000)}K`,
      color: getChannelColor(index),
      labels: apiChannel.labels || [], // labels는 배열
      description: apiChannel.description || null // description이 없으면 표시하지 않음
    }))
  } else {
    // 기본 데이터 사용
    channels.value = [
      {
        id: 'social',
        name: '소셜미디어',
        icon: Share2,
        affinity: 85,
        allocation: 35,
        cost: '₩350K',
        reach: '45.2K',
        color: 'text-blue-500',
        labels: ['SNS', '브랜딩', '인플루언서'],
        description: 'Facebook, Instagram 등 소셜 플랫폼을 통한 마케팅'
      },
      {
        id: 'mobile',
        name: '모바일 광고',
        icon: Smartphone,
        affinity: 78,
        allocation: 25,
        cost: '₩250K',
        reach: '38.8K',
        color: 'text-green-500',
        labels: ['앱광고', '타겟팅', '모바일'],
        description: '스마트폰 앱을 통한 타겟 광고'
      },
      {
        id: 'email',
        name: '이메일 마케팅',
        icon: Mail,
        affinity: 62,
        allocation: 15,
        cost: '₩150K',
        reach: '25.5K',
        color: 'text-purple-500',
        labels: ['개인화', '직접마케팅', '뉴스레터'],
        description: '개인화된 이메일을 통한 직접 마케팅'
      },
      {
        id: 'search',
        name: '검색 광고',
        icon: Search,
        affinity: 91,
        allocation: 20,
        cost: '₩200K',
        reach: '42.1K',
        color: 'text-orange-500',
        labels: ['키워드', 'SEM', '검색엔진'],
        description: 'Google, Naver 등 검색엔진 광고'
      },
      {
        id: 'messaging',
        name: '메신저',
        icon: MessageCircle,
        affinity: 55,
        allocation: 5,
        cost: '₩50K',
        reach: '15.2K',
        color: 'text-pink-500',
        labels: ['챗봇', '1:1메시징', '즉시소통'],
        description: 'KakaoTalk 등 메신저를 통한 마케팅'
      }
    ]
  }
}

// props.channelData 변경 감지
watch(() => props.channelData, () => {
  initializeChannels()
}, { deep: true, immediate: true })

const totalAllocation = computed(() => 
  channels.value.reduce((sum, c) => sum + c.allocation, 0)
)

const updateAllocation = (channelId: string, newAllocation: number) => {
  // 예산 배분 UI가 비활성화되어 있으므로 업데이트하지 않음
  console.log('⚠️ 예산 배분은 AI가 최적화한 결과입니다. 수정할 수 없습니다.')
  return
}

const getAffinityColor = (affinity: number) => {
  if (affinity >= 80) return 'text-green-500'
  if (affinity >= 60) return 'text-yellow-500'
  return 'text-red-500'
}

const handleNext = () => {
  emit('channels-configured', channels.value)
}
</script>
