<template>
  <div class="space-y-6">
    <div class="border-0 bg-card/50 backdrop-blur-sm p-6 rounded-lg">
      <h2 class="flex items-center space-x-2 text-xl pb-2">
        <Users class="h-5 w-5 text-primary" />
        <span>{{ $t('segmentation.title') }}</span>
      </h2>
      <p class="text-muted-foreground pb-4">
        Please select the customer group to target. You can only select one segment.
      </p>
      
      <!-- Integrated segment list -->
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
          <!-- Name, selection state, and customer count -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-2">
              <span class="text-lg font-medium">{{ segment.name }}</span>
              <CheckCircle v-if="segment.selected" class="h-5 w-5 text-primary" />
            </div>
            <div class="flex items-center space-x-1 text-muted-foreground">
              <TrendingUp class="h-4 w-4" />
              <span class="text-sm font-medium">{{ (segment.size || 0).toLocaleString() }}{{ segment.source === 'huntrix' ? ' people' : '' }}</span>
            </div>
          </div>
          
          <!-- Display Tags directly below Name -->
          <div class="mb-3">
            <!-- 디버그 정보 표시 (개발 환경에서만) -->
            <div v-if="segment.source === 'huntrix' && segment.tags?.length === 0" class="text-xs text-orange-500 mb-1">
              🔍 Debug: No tags found - tags={{ JSON.stringify(segment.tags) }}
            </div>
            
            <!-- 태그가 있을 때 표시 -->
            <div v-if="segment.tags && segment.tags.length > 0" class="flex flex-wrap gap-1">
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
                +{{ segment.tags.length - 3 }} {{ $t('segmentation.more') }}
              </span>
            </div>
            
            <!-- 태그가 없을 때 표시 -->
            <div v-else-if="segment.source === 'huntrix'" class="text-xs text-red-500">
              ⚠️ {{ $t('segmentation.noTagsAvailable') }}
            </div>
          </div>
          
          <!-- Display Description below Tags -->
          <p v-if="segment.description" class="text-sm text-muted-foreground leading-relaxed">{{ segment.description }}</p>
          
        </div>
      </div>

      <div v-if="selectedSegments.length > 0" class="pt-6 border-t border-border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-foreground">
              {{ $t('segmentation.selectedSegments') }}: {{ selectedSegments.length }}
            </p>
            <p class="text-sm text-muted-foreground">
              {{ $t('segmentation.totalTargetCustomers') }}: {{ totalCustomers.toLocaleString() }} {{ $t('segmentation.people') }}
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
              <span>{{ $t('segmentation.analyzing') }}</span>
            </span>
            <span v-else>{{ $t('segmentation.goToPerformanceAnalysis') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
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
    console.warn(`🌐 Missing translation for segment label: "${label}"`)
    return label
  } catch (error) {
    console.error('Label translation error:', error, 'for label:', label)
    return label
  }
}

// 기본 세그먼트 데이터
const defaultSegments: Segment[] = [
  {
    id: '1',
    name: 'Young Professionals',
    size: 15420,
    description: '25-35 years old office workers, high purchasing power, digital natives',
    tags: ['High Income', 'Online Active', 'Brand Loyal'],
    selected: false,
    source: 'default'
  },
  {
    id: '2', 
    name: 'Middle-aged Families',
    size: 23150,
    description: '35-50 years old primary household buyers, value practicality',
    tags: ['Family-focused', 'Practical', 'Stability-seeking'],
    selected: false,
    source: 'default'
  },
  {
    id: '3',
    name: 'Seniors',
    size: 8900,
    description: 'Over 50 years old, careful purchasing patterns, quality-focused',
    tags: ['Quality-focused', 'Careful buyers', 'Experience-important'],
    selected: false,
    source: 'default'
  },
  {
    id: '4',
    name: 'Gen Z',
    size: 19800,
    description: '18-25 years old, high SNS usage, trend-sensitive',
    tags: ['Social Media', 'Trendy', 'Individuality-seeking'],
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
    console.log(`🔍 Processing huntrix segment ${index}:`, rec)
    console.log(`🏷️ Labels for segment ${index}:`, {
      rawLabels: rec.labels,
      isArray: Array.isArray(rec.labels),
      length: rec.labels?.length || 0,
      values: rec.labels || []
    })
    
    // Labels 디버깅 및 번역 처리
    let processedLabels: string[] = []
    if (rec.labels && Array.isArray(rec.labels)) {
      processedLabels = rec.labels
        .filter((label: any) => typeof label === 'string' && label.trim().length > 0)
        .map((label: string) => {
          const trimmedLabel = label.trim()
          // 실시간으로 label을 번역하여 반환
          return translateLabel(trimmedLabel)
        })
    }
    console.log(`✅ Processed and translated labels for segment ${index}:`, processedLabels)
    
    return {
      id: `huntrix_${index}`,
      name: rec.name, // segment.name
      size: rec.customer_cnt || 0, // segment.size - default to 0 if undefined  
      description: rec.description, // segment.description
      tags: processedLabels, // segment.tags (API의 lables를 tags로)
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
const totalCustomers = computed(() => selectedSegments.value.reduce((sum, s) => sum + (s.size || 0), 0))

// Huntrix 세그먼트 개수
const huntrixCount = computed(() => segments.value.filter(s => s.source === 'huntrix').length)

const toggleSegment = (id: string) => {
  const segment = segments.value.find(s => s.id === id)
  if (segment) {
    // 단일 선택: 다른 모든 세그먼트는 선택 해제
    segments.value.forEach(s => {
      s.selected = s.id === id ? !s.selected : false
    })
    
    console.log('🔄 세그먼트 선택 변경 (단일 선택):', {
      segmentId: id,
      selected: segment.selected,
      segmentName: segment.name
    })
  }
}

const handleNext = () => {
  emit('segments-selected', selectedSegments.value)
}
</script>
