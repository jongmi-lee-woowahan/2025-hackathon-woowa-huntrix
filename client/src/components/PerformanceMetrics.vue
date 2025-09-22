<template>
  <div class="space-y-6">
    <div class="border-0 bg-card/50 backdrop-blur-sm p-6 rounded-lg">
      <h2 class="flex items-center space-x-2 text-xl mb-4">
        <BarChart3 class="h-5 w-5 text-primary" />
        <span>예상 성과 지표</span>
      </h2>
      <p class="text-muted-foreground mb-6">
        {{ segmentName }}의 예상 마케팅 성과를 확인해보세요.
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="metric in metrics"
        :key="metric.id"
        class="border-0 bg-card/50 backdrop-blur-sm p-4 rounded-lg"
        :data-testid="`card-metric-${metric.id}`"
      >
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="text-sm font-medium text-muted-foreground">
            {{ metric.title }}
          </h3>
          <component :is="metric.icon" :class="['h-4 w-4', metric.color]" />
        </div>
        <div class="space-y-2">
          <div class="text-2xl font-bold text-foreground">
            {{ metric.value }}
          </div>
          <div class="flex items-center space-x-2">
            <span 
              :class="[
                'flex items-center space-x-1 px-2 py-1 rounded text-xs',
                metric.changeType === 'increase' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'
              ]"
            >
              <component :is="metric.changeType === 'increase' ? TrendingUp : TrendingDown" class="h-3 w-3" />
              <span>{{ Math.abs(metric.change) }}%</span>
            </span>
          </div>
          <p class="text-xs text-muted-foreground">
            {{ metric.description }}
          </p>
        </div>
      </div>
    </div>

    <div class="border-0 bg-card/50 backdrop-blur-sm p-6 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="space-y-2">
          <h4 class="text-lg font-semibold text-foreground">
            전체 예상 성과
          </h4>
          <p class="text-sm text-muted-foreground">
            선택된 세그먼트 기준 월간 예상치
          </p>
        </div>
        <div class="text-right space-y-1">
          <div class="text-2xl font-bold text-primary">
            ₩12.4M
          </div>
          <div class="text-sm text-muted-foreground">
            예상 수익
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrendingUp, TrendingDown, MousePointer, DollarSign, Target, BarChart3 } from 'lucide-vue-next'

interface Props {
  segmentName?: string
}

const props = withDefaults(defineProps<Props>(), {
  segmentName: "선택된 세그먼트"
})

const metrics = [
  {
    id: 'ctr',
    title: '클릭률 (CTR)',
    value: '3.4%',
    change: 12.5,
    changeType: 'increase',
    description: '예상 광고 클릭률',
    icon: MousePointer,
    color: 'text-chart-1'
  },
  {
    id: 'conversion',
    title: '전환율',
    value: '2.8%',
    change: 8.2,
    changeType: 'increase',
    description: '예상 구매 전환율',
    icon: Target,
    color: 'text-chart-2'
  },
  {
    id: 'roi',
    title: '투자 수익률 (ROI)',
    value: '340%',
    change: -5.1,
    changeType: 'decrease',
    description: '예상 마케팅 ROI',
    icon: DollarSign,
    color: 'text-chart-3'
  },
  {
    id: 'reach',
    title: '도달률',
    value: '85.2%',
    change: 15.8,
    changeType: 'increase',
    description: '타겟 고객 도달률',
    icon: BarChart3,
    color: 'text-chart-4'
  }
]
</script>
