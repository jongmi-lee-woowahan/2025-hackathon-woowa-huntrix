<template>
  <div class="space-y-6">
    <div class="border-0 bg-card/50 backdrop-blur-sm p-6 rounded-lg">
      <h2 class="flex items-center space-x-2 text-xl mb-4">
        <Users class="h-5 w-5 text-primary" />
        <span>고객 세그먼트 선택</span>
      </h2>
      <p class="text-muted-foreground mb-6">
        타겟팅할 고객 그룹을 선택해주세요. 여러 세그먼트를 동시에 선택할 수 있습니다.
      </p>
      
      <div class="grid gap-4 md:grid-cols-2 mb-6">
        <div
          v-for="segment in segments"
          :key="segment.id"
          @click="toggleSegment(segment.id)"
          :class="[
            'cursor-pointer p-4 rounded-lg border transition-all duration-300',
            segment.selected 
              ? 'border-primary bg-primary/10' 
              : 'border-border hover:border-primary/50'
          ]"
          :data-testid="`card-segment-${segment.id}`"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-2">
              <span class="text-lg font-medium">{{ segment.name }}</span>
              <CheckCircle v-if="segment.selected" class="h-5 w-5 text-primary" />
            </div>
            <div class="flex items-center space-x-1 text-muted-foreground">
              <TrendingUp class="h-4 w-4" />
              <span class="text-sm font-medium">{{ segment.size.toLocaleString() }}</span>
            </div>
          </div>
          <p class="text-sm text-muted-foreground mb-3">{{ segment.description }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in segment.tags"
              :key="tag"
              class="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="selectedSegments.length > 0" class="pt-6 border-t border-border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-foreground">
              선택된 세그먼트: {{ selectedSegments.length }}개
            </p>
            <p class="text-sm text-muted-foreground">
              총 타겟 고객 수: {{ totalCustomers.toLocaleString() }}명
            </p>
          </div>
          <button 
            @click="handleNext"
            :disabled="isProcessing"
            data-testid="button-next-step"
            class="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md disabled:opacity-50"
          >
            <span v-if="isProcessing" class="flex items-center space-x-2">
              <Loader2 class="h-4 w-4 animate-spin" />
              <span>분석 중...</span>
            </span>
            <span v-else>성과 분석 단계로</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Users, TrendingUp, CheckCircle, Loader2 } from 'lucide-vue-next'

interface Segment {
  id: string
  name: string
  size: number
  description: string
  tags: string[]
  selected: boolean
}

interface Props {
  isProcessing?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'segments-selected': [segments: Segment[]]
}>()

const segments = ref<Segment[]>([
  {
    id: '1',
    name: '젊은 전문직',
    size: 15420,
    description: '25-35세 직장인, 높은 구매력, 디지털 네이티브',
    tags: ['높은소득', '온라인활성', '브랜드충성'],
    selected: false
  },
  {
    id: '2', 
    name: '중년 가족층',
    size: 23150,
    description: '35-50세 가정 주 구매자, 실용성 중시',
    tags: ['가족중심', '실용성', '안정추구'],
    selected: false
  },
  {
    id: '3',
    name: '시니어층',
    size: 8900,
    description: '50세 이상, 신중한 구매 패턴, 품질 중시',
    tags: ['품질중시', '신중구매', '경험중요'],
    selected: false
  },
  {
    id: '4',
    name: 'Z세대',
    size: 19800,
    description: '18-25세, SNS 활용도 높음, 트렌드 민감',
    tags: ['소셜미디어', '트렌드', '개성추구'],
    selected: false
  }
])

const selectedSegments = computed(() => segments.value.filter(s => s.selected))
const totalCustomers = computed(() => selectedSegments.value.reduce((sum, s) => sum + s.size, 0))

const toggleSegment = (id: string) => {
  const segment = segments.value.find(s => s.id === id)
  if (segment) {
    segment.selected = !segment.selected
  }
}

const handleNext = () => {
  emit('segments-selected', selectedSegments.value)
}
</script>
