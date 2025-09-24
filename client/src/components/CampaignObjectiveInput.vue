<template>
  <div class="border-2 bg-card/50 backdrop-blur-sm p-6 rounded-lg">
    <div class="flex flex-row items-center space-y-0 pb-4">
      <div class="flex items-center space-x-2">
        <Target class="h-5 w-5 text-primary" />
        <h2 class="text-xl font-semibold text-foreground">
          캠페인 목표 설정
        </h2>
      </div>
    </div>
    <div class="space-y-4">
      <div class="space-y-2">
        <label class="text-sm font-medium text-muted-foreground">
          마케팅 캠페인의 주요 목표를 입력해주세요
        </label>
        <textarea
          v-model="objective"
          data-testid="input-campaign-objective"
          placeholder="예: 신제품 런칭을 위한 브랜드 인지도 향상 및 초기 고객 확보..."
          class="min-h-[120px] bg-background/50 border-input focus:ring-primary/30 w-full p-3 rounded-md border"
          rows="4"
        />
      </div>
      <button 
        data-testid="button-set-objective"
        @click="handleSubmit"
        :disabled="!objective.trim() || isProcessing"
        :class="[
          'w-full py-2 px-4 rounded-md disabled:opacity-50',
          aiStatus === 'error' 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        ]"
      >
        <div v-if="isProcessing" class="flex items-center justify-center space-x-2">
          <Sparkles class="h-4 w-4 animate-spin" />
          <span>AI가 분석 중...</span>
        </div>
        <span v-else-if="aiStatus === 'error'">캠페인 재수행</span>
        <span v-else>다음 단계로 진행</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Target, Sparkles } from 'lucide-vue-next'

interface Props {
  isProcessing?: boolean
  aiStatus?: 'idle' | 'processing' | 'completed' | 'error'
}

defineProps<Props>()

const emit = defineEmits<{
  'objective-set': [objective: string]
}>()

const objective = ref('')

const handleSubmit = () => {
  if (objective.value.trim()) {
    emit('objective-set', objective.value.trim())
  }
}
</script>
