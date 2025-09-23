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
      
      <!-- 통합 세그먼트 목록 -->
      <div class="grid gap-4 md:grid-cols-2 mb-6">
        <div
          v-for="(segment, index) in segments"
          :key="segment.id"
          @click="toggleSegment(segment.id)"
          :class="[
            'cursor-pointer p-4 rounded-lg border transition-all duration-300',
            segment.source === 'huntrix' ? 'border-l-4 border-l-primary' : '',
            segment.selected 
              ? 'border-primary bg-primary/10' 
              : 'border-border hover:border-primary/50'
          ]"
          :data-testid="`card-segment-${segment.id}`"
        >
          <!-- Name과 선택 상태, 고객 수 -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-2">
              <span class="text-lg font-medium">{{ segment.name }}</span>
              <CheckCircle v-if="segment.selected" class="h-5 w-5 text-primary" />
            </div>
            <div class="flex items-center space-x-1 text-muted-foreground">
              <TrendingUp class="h-4 w-4" />
              <span class="text-sm font-medium">{{ segment.size.toLocaleString() }}{{ segment.source === 'huntrix' ? '명' : '' }}</span>
            </div>
          </div>
          
          <!-- Tags를 Name 바로 아래 표시 -->
          <div v-if="segment.tags && segment.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
            <span
              v-for="tag in segment.tags.slice(0, segment.source === 'huntrix' ? 3 : 10)"
              :key="tag"
              :class="[
                'px-2 py-1 text-xs rounded inline-flex items-center space-x-1',
                segment.source === 'huntrix' 
                  ? 'bg-primary/5 text-primary' 
                  : 'bg-muted text-muted-foreground'
              ]"
            >
              <Tag v-if="segment.source === 'huntrix'" class="h-3 w-3" />
              <span>{{ tag }}</span>
            </span>
            <span v-if="segment.source === 'huntrix' && segment.tags.length > 3" class="text-xs text-muted-foreground px-2 py-1">
              +{{ segment.tags.length - 3 }}개 더
            </span>
          </div>
          
          <!-- Description을 Tags 아래 표시 -->
          <p v-if="segment.description" class="text-sm text-muted-foreground leading-relaxed">{{ segment.description }}</p>
          
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
import { ref, computed, watch, onMounted } from 'vue'
import { Users, TrendingUp, CheckCircle, Loader2, Tag } from 'lucide-vue-next'
import { type HuntrixCampaignRecommendation } from '@/services/campaignApi'

interface Segment {
  id: string
  name: string
  size: number
  description?: string
  tags?: string[]
  selected: boolean
  source: 'default' | 'huntrix'
  huntrixData?: HuntrixCampaignRecommendation
  conditions?: any[] // API 서버 전달용 조건 저장
}

interface Props {
  isProcessing?: boolean
  huntrixRecommendations?: HuntrixCampaignRecommendation[]
  objective?: string
}

const props = withDefaults(defineProps<Props>(), {
  huntrixRecommendations: () => []
})

const emit = defineEmits<{
  'segments-selected': [segments: Segment[]]
}>()

// 기본 세그먼트 데이터
const defaultSegments: Segment[] = [
  {
    id: '1',
    name: '젊은 전문직',
    size: 15420,
    description: '25-35세 직장인, 높은 구매력, 디지털 네이티브',
    tags: ['높은소득', '온라인활성', '브랜드충성'],
    selected: false,
    source: 'default'
  },
  {
    id: '2', 
    name: '중년 가족층',
    size: 23150,
    description: '35-50세 가정 주 구매자, 실용성 중시',
    tags: ['가족중심', '실용성', '안정추구'],
    selected: false,
    source: 'default'
  },
  {
    id: '3',
    name: '시니어층',
    size: 8900,
    description: '50세 이상, 신중한 구매 패턴, 품질 중시',
    tags: ['품질중시', '신중구매', '경험중요'],
    selected: false,
    source: 'default'
  },
  {
    id: '4',
    name: 'Z세대',
    size: 19800,
    description: '18-25세, SNS 활용도 높음, 트렌드 민감',
    tags: ['소셜미디어', '트렌드', '개성추구'],
    selected: false,
    source: 'default'
  }
]

// 통합 세그먼트 상태 (초기값은 빈 배열)
const segments = ref<Segment[]>([])

// Huntrix 추천을 segments에 통합하는 함수
const updateSegmentsWithHuntrix = () => {
  console.log('🔄 updateSegmentsWithHuntrix 호출됨')
  console.log('📊 huntrixRecommendations 상태:', {
    exists: !!props.huntrixRecommendations,
    isArray: Array.isArray(props.huntrixRecommendations),
    length: props.huntrixRecommendations?.length || 0,
    data: props.huntrixRecommendations
  })
  
  if (!props.huntrixRecommendations || !Array.isArray(props.huntrixRecommendations) || props.huntrixRecommendations.length === 0) {
    console.log('⚠️ Huntrix 추천이 없거나 빈 배열임')
    console.log('🔄 빈 배열로 설정하여 로딩 상태 유지')
    segments.value = []
    return
  }

  console.log('Huntrix 추천 개수:', props.huntrixRecommendations.length)
  
  const huntrixSegments: Segment[] = props.huntrixRecommendations.map((rec, index) => {
    console.log(`Processing huntrix segment ${index}:`, rec)
    
    return {
      id: `huntrix_${index}`,
      name: rec.name, // segment.name
      size: rec.customer_cnt, // segment.size  
      description: rec.description, // segment.description
      tags: rec.lables || [], // segment.tags (API의 lables를 tags로)
      selected: false,
      source: 'huntrix' as const,
      huntrixData: rec,
      conditions: rec.conditions // API 서버 전달용 조건 저장
    }
  })

  console.log('변환된 Huntrix 세그먼트들:', huntrixSegments)
  
  // Huntrix 추천만 사용 (기본 세그먼트 제외)
  segments.value = huntrixSegments
  
  console.log('최종 segments:', segments.value)
}

// Huntrix 추천이 변경되면 세그먼트 업데이트
watch(() => props.huntrixRecommendations, (newValue, oldValue) => {
  console.log('👀 huntrixRecommendations watch 트리거됨:')
  console.log('🔄 이전값:', oldValue)
  console.log('✨ 새값:', newValue)
  console.log('📊 새값 길이:', newValue?.length || 0)
  updateSegmentsWithHuntrix()
}, { deep: true, immediate: true })

// 컴포넌트가 마운트될 때도 초기화
onMounted(() => {
  console.log('🚀 CustomerSegmentation 마운트됨')
  console.log('📊 초기 huntrixRecommendations:', props.huntrixRecommendations)
  updateSegmentsWithHuntrix()
})

// 선택된 세그먼트들과 총 고객 수
const selectedSegments = computed(() => segments.value.filter(s => s.selected))
const totalCustomers = computed(() => selectedSegments.value.reduce((sum, s) => sum + s.size, 0))

// Huntrix 세그먼트 개수
const huntrixCount = computed(() => segments.value.filter(s => s.source === 'huntrix').length)

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
