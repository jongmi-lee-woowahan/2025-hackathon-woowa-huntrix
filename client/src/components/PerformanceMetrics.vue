<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold mb-4">Overall Expected Performance</h2>
    
    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span class="ml-2 text-muted-foreground">Analyzing performance data...</span>
    </div>
    
    <!-- 에러 상태 -->
    <div v-else-if="errorMessage" class="border border-destructive/20 bg-destructive/5 rounded-lg p-4">
      <h3 class="font-semibold text-destructive mb-2">Data Processing Error</h3>
      <p class="text-sm text-muted-foreground mb-2">{{ errorMessage }}</p>
      <details class="text-xs">
        <summary class="cursor-pointer text-muted-foreground hover:text-foreground">View Original Response Data</summary>
        <pre class="mt-2 p-2 bg-muted rounded text-xs overflow-auto">{{ JSON.stringify(rawApiData, null, 2) }}</pre>
      </details>
    </div>
    
          <!-- 성과 지표 카드들 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="metric in metrics"
        :key="metric.id"
        class="border-0 bg-card/50 backdrop-blur-sm rounded-lg p-6"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground mb-1">{{ metric.title }}</p>
            <div class="flex items-baseline space-x-1 py-3">
              <span class="text-3xl font-bold">{{ metric.value }}{{ metric.unit }}</span>
            </div>
            <p class="text-xs text-muted-foreground mt-1">{{ metric.description }}</p>
          </div>
          <div class="p-2 bg-primary/10 rounded-md">
            <component :is="getIcon(metric.icon)" class="h-5 w-5 text-primary" />
          </div>
        </div>
        
        <div class="mt-4 space-y-3">
          <!-- 타겟 고객 지표 -->
          <div v-if="metric.targetAvg" class="flex items-center justify-between bg-primary/5 rounded-md">
            <div class="flex items-center space-x-2">
              <component :is="Users" class="h-4 w-4 text-primary" />
              <span class="text-sm font-medium text-primary">Target Customers</span>
            </div>
            <span class="text-base font-bold text-primary">{{ metric.targetAvg }}{{ metric.id === 'revisit_rate' ? ' days' : '' }}</span>
          </div>
          
          <!-- 평균 고객 지표 -->
          <div v-if="metric.allAvg" class="flex items-center justify-between bg-muted/30 rounded-md">
            <div class="flex items-center space-x-2">
              <component :is="Globe" class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm font-medium text-muted-foreground">Average Customers</span>
            </div>
            <span class="text-base font-bold text-muted-foreground">{{ metric.allAvg }}{{ metric.id === 'revisit_rate' ? ' days' : '' }}</span>
          </div>
          
          <!-- 비율 표시 (conversion_rate, pred_revenue_rate 등) -->
          <div v-if="metric.showRatio" class="flex items-center justify-center text-sm">
            <component :is="TrendingUp" class="h-4 w-4 text-green-500 mr-1" />
            <span class="text-green-600 font-medium ml-1"> {{ metric.value }}x higher</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 선택된 세그먼트 정보 강조 -->
    <div v-if="segmentName" class="mt-6 p-6 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
          <component :is="Target" class="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-foreground mb-1">Selected Target Segment</h3>
          <p class="text-base font-medium text-primary leading-relaxed">{{ segmentName }}</p>
          <p class="text-sm text-muted-foreground mt-2">The above performance metrics are based on analysis of the selected segment.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { TrendingUp, Target, Users, DollarSign, Globe } from 'lucide-vue-next'

interface Props {
  segmentName?: string
  analyticsData?: any // API에서 받은 analytics 데이터
}

interface MetricData {
  id: string
  title: string
  value: string
  unit: string
  description: string
  icon: string
  showRatio: boolean
  targetAvg?: string
  allAvg?: string
}

const props = withDefaults(defineProps<Props>(), {
  segmentName: '',
  analyticsData: null
})

const isLoading = ref(false)
const errorMessage = ref<string>('')
const rawApiData = ref<any>(null)

const getIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'Target': Target,
    'Users': Users,
    'DollarSign': DollarSign
  }
  return iconMap[iconName] || Target
}

// API 데이터를 파싱하여 metrics로 변환 (agent-2 데이터만)
const metrics = computed<MetricData[]>(() => {
  return getAnalyticsMetrics() // agent-2: 전환율, 타겟 재방문수, 수익성 등
})

// Analytics 데이터에서 메트릭 생성
const getAnalyticsMetrics = (): MetricData[] => {
  if (!props.analyticsData) {
    console.log('⚠️ Analytics data not available. Using default data')
    return getDefaultAnalyticsMetrics()
  }

  try {
    console.log('🔄 Analytics 데이터 파싱 시작:', props.analyticsData)
    
    // output 필드에서 JSON 추출
    let parsedData: any
    if (props.analyticsData.output) {
      const outputString = props.analyticsData.output
      console.log('📄 Output 문자열:', outputString)
      
      // JSON 코드 블록에서 추출
      const jsonStart = outputString.indexOf('```json\n')
      const jsonEnd = outputString.lastIndexOf('\n```')
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const jsonString = outputString.substring(jsonStart + 8, jsonEnd)
        console.log('🧹 추출된 JSON:', jsonString.substring(0, 200) + '...')
        parsedData = JSON.parse(jsonString)
      } else {
        // 직접 JSON 파싱 시도
        parsedData = JSON.parse(outputString)
      }
    } else {
      parsedData = props.analyticsData
    }
    
    console.log('✅ 파싱된 데이터:', parsedData)
    
    // 각 지표별로 (target.avg / all.avg) * 100 계산
    const ltvRate = parsedData.ltv_rate
    const ltvLatestRate = parsedData.ltv_latest_rate
    const conversionRate = parsedData.conversion_rate
    const revisitRate = parsedData.revisit_rate  

    if (!ltvRate?.target?.avg || !ltvRate?.all?.avg ||
        !conversionRate?.target?.avg || !conversionRate?.all?.avg ||
        !revisitRate?.target?.avg || !revisitRate?.all?.avg ||
        !ltvLatestRate?.target?.avg || !ltvLatestRate?.all?.avg) {
      throw new Error('필수 데이터 필드가 누락되었습니다.')
    }

    // conversionValue와 revenueValue는 비율로 계산
    const ltvValue = ltvRate.target.avg / ltvRate.all.avg
    const conversionValue = conversionRate.target.avg / conversionRate.all.avg
    const revenueValue = ltvLatestRate.target.avg / ltvLatestRate.all.avg
    
    // revisitValue는 개별 값들을 그대로 사용
    const revisitTargetValue = revisitRate.target.avg
    const revisitAllValue = revisitRate.all.avg

    console.log('📊 계산된 지표 값들:', {
      ltv: ltvValue,
      conversion: conversionValue,
      revisitTarget: revisitTargetValue,
      revisitAll: revisitAllValue,
      revenue: revenueValue
    })

    rawApiData.value = parsedData
    errorMessage.value = ''

    return [
      {
        id: 'ltv_rate',
        title: 'LTV',
        value: ltvValue.toFixed(2),
        unit: 'x higher (vs. average customers)',
        description: 'LTV ratio of total customers relative to target customers',
        icon: 'DollarSign',
        showRatio: true,
        targetAvg: ltvRate.target.avg.toFixed(1),
        allAvg: ltvRate.all.avg.toFixed(1)
      },
      {
        id: 'ltv_latest_rate',
        title: 'LTV (최근 12주)',
        value: (ltvLatestRate.target.avg / ltvLatestRate.all.avg).toFixed(1),
        unit: 'x higher (vs. average customers)',
        description: 'LTV ratio of total customers relative to target customers (last 12 weeks)',
        icon: 'DollarSign',
        showRatio: true,
        targetAvg: ltvLatestRate.target.avg.toFixed(1),
        allAvg: ltvLatestRate.all.avg.toFixed(1)
      },
      {
      id: 'conversion_rate',
      title: 'Conversion Rate',
      value: (conversionRate.target.avg / conversionRate.all.avg).toFixed(1),
      unit: 'x higher (vs. average customers)',
      description: 'Conversion rate ratio of target vs. all customers',
      icon: 'Target',
        showRatio: true,
        targetAvg: conversionRate.target.avg.toFixed(1),
        allAvg: conversionRate.all.avg.toFixed(1)
      },
      {
      id: 'revisit_rate', 
      title: 'Re-order Prediction',
      value: revisitTargetValue.toFixed(1),
      unit: ' days until expected re-order',
      description: 'Average days until target customers re-order',
      icon: 'Users',
        showRatio: false,
        targetAvg: revisitTargetValue.toFixed(1),
        allAvg: revisitAllValue.toFixed(1)
      }
    ]
  } catch (error) {
    console.error('❌ Analytics 데이터 파싱 실패:', error)
    errorMessage.value = `Failed to parse API response data: ${error instanceof Error ? error.message : 'Unknown error'}`
    rawApiData.value = props.analyticsData
    return getDefaultAnalyticsMetrics() // API 데이터 파싱 실패 시 기본 데이터 사용
  }
}

// Channel 데이터에서 메트릭 생성 (사용하지 않음)
const getChannelMetrics = (): MetricData[] => {
  return [] // 총 마케팅 예상 금액 제거 - 더 이상 사용하지 않음
}

// 기본 Analytics 메트릭 (API 데이터가 없을 때)
const getDefaultAnalyticsMetrics = (): MetricData[] => {
  return [
    {
      id: 'conversion_rate',
      title: 'Conversion Rate',
      value: '2.33',
      unit: '',
      description: 'Conversion rate ratio of target vs. all customers',
      icon: 'Target',
      showRatio: true,
      targetAvg: '0.0420',
      allAvg: '0.0180'
    },
    {
      id: 'revisit_rate', 
      title: 'Target Revisit Count',
      value: '3.4',
      unit: ' days',
      description: 'Average days until target customers revisit',
      icon: 'Users',
      showRatio: false,
      targetAvg: '3.4',
      allAvg: '2.1'
    },
    {
      id: 'pred_revenue_rate',
      title: 'Profitability', 
      value: '1.80',
      unit: '',
      description: 'Revenue rate ratio of target vs. all customers',
      icon: 'DollarSign',
      showRatio: true,
      targetAvg: '452.0',
      allAvg: '251.0'
    }
  ]
}

// 기본 Channel 메트릭 (API 데이터가 없을 때)
const getDefaultChannelMetrics = (): MetricData[] => {
  return [
    {
      id: 'total_marketing_budget',
      title: '총 마케팅 예상 금액',
      value: '150',
      unit: 'K',
      description: '모든 채널의 예상 마케팅 비용 합계',
      icon: 'DollarSign',
      showRatio: false,
      targetAvg: undefined,
      allAvg: undefined
    }
  ]
}


// analyticsData 변경 감지
watch(() => props.analyticsData, (newData) => {
  console.log('👀 PerformanceMetrics에서 analyticsData 변경 감지:', newData)
}, { deep: true })
</script>