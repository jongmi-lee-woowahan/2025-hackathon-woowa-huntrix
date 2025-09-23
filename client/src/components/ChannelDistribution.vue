<template>
  <div class="space-y-6">
    <div class="border-0 bg-card/50 backdrop-blur-sm p-6 rounded-lg">
      <h2 class="flex items-center space-x-2 text-xl mb-4">
        <Share2 class="h-5 w-5 text-primary" />
        <span>마케팅 채널 배분</span>
      </h2>
      <p class="text-muted-foreground">
        고객 선호도를 기반으로 마케팅 예산을 채널별로 배분해보세요.
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
              <div>
                <h4 class="font-semibold text-foreground">{{ channel.name }}</h4>
                <p class="text-sm text-muted-foreground">
                  고객 선호도: 
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
              class="w-full"
              :data-testid="`slider-${channel.id}`"
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
import { ref, computed } from 'vue'
import { Share2, Smartphone, Mail, Search, MessageCircle, Rocket } from 'lucide-vue-next'

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

interface Props {
  budget?: number
}

const props = withDefaults(defineProps<Props>(), {
  budget: 1000000
})

const emit = defineEmits<{
  'channels-configured': [channels: Channel[]]
}>()

const channels = ref<Channel[]>([
  {
    id: 'social',
    name: '소셜미디어',
    icon: Share2,
    affinity: 85,
    allocation: 35,
    cost: '₩350K',
    reach: '45.2K',
    color: 'text-blue-500'
  },
  {
    id: 'mobile',
    name: '모바일 광고',
    icon: Smartphone,
    affinity: 78,
    allocation: 25,
    cost: '₩250K',
    reach: '38.8K',
    color: 'text-green-500'
  },
  {
    id: 'email',
    name: '이메일 마케팅',
    icon: Mail,
    affinity: 62,
    allocation: 15,
    cost: '₩150K',
    reach: '25.5K',
    color: 'text-purple-500'
  },
  {
    id: 'search',
    name: '검색 광고',
    icon: Search,
    affinity: 91,
    allocation: 20,
    cost: '₩200K',
    reach: '42.1K',
    color: 'text-orange-500'
  },
  {
    id: 'messaging',
    name: '메신저',
    icon: MessageCircle,
    affinity: 55,
    allocation: 5,
    cost: '₩50K',
    reach: '15.2K',
    color: 'text-pink-500'
  }
])

const totalAllocation = computed(() => 
  channels.value.reduce((sum, c) => sum + c.allocation, 0)
)

const updateAllocation = (channelId: string, newAllocation: number) => {
  const channel = channels.value.find(c => c.id === channelId)
  if (channel) {
    const totalOther = channels.value
      .filter(c => c.id !== channelId)
      .reduce((sum, c) => sum + c.allocation, 0)
    
    if (totalOther + newAllocation <= 100) {
      channel.allocation = newAllocation
      channel.cost = `₩${(props.budget * newAllocation / 100 / 1000).toFixed(0)}K`
      channel.reach = `${((props.budget * newAllocation / 100) / 25).toFixed(1)}K`
    }
  }
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
