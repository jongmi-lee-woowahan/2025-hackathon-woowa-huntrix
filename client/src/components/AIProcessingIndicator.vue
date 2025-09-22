<template>
  <div 
    v-if="status !== 'idle'"
    class="flex items-center space-x-3 p-4 rounded-lg bg-card/50 border border-border opacity-0 animate-in fade-in scale-in-90 duration-300"
    :data-testid="`ai-indicator-${status}`"
  >
    <div :class="['relative p-2 rounded-full', config.bgColor]">
      <component 
        :is="config.icon"
        :class="['h-4 w-4', config.color, status === 'processing' ? 'animate-pulse' : '']" 
      />
      <div
        v-if="status === 'processing'"
        :class="['absolute inset-0 rounded-full', config.pulseColor]"
        class="animate-ping"
      />
    </div>
    
    <div class="flex-1 space-y-1">
      <p class="text-sm font-medium text-foreground">
        {{ message }}
      </p>
      <div 
        v-if="status === 'processing' && progress > 0" 
        class="w-full bg-muted/20 rounded-full h-1"
      >
        <div
          class="bg-primary h-1 rounded-full transition-all duration-500"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
    
    <div v-if="status === 'processing'" class="flex space-x-1">
      <div
        v-for="i in 3"
        :key="i"
        class="w-2 h-2 bg-primary rounded-full animate-pulse"
        :style="{ animationDelay: `${(i-1) * 200}ms` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Sparkles, Brain, Zap, CheckCircle } from 'lucide-vue-next'

export type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error'

interface Props {
  status: ProcessingStatus
  message: string
  progress?: number
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0
})

const config = computed(() => {
  switch (props.status) {
    case 'processing':
      return {
        icon: Sparkles,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        pulseColor: 'bg-primary/20'
      }
    case 'completed':
      return {
        icon: CheckCircle,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        pulseColor: 'bg-green-500/20'
      }
    case 'error':
      return {
        icon: Zap,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        pulseColor: 'bg-red-500/20'
      }
    default:
      return {
        icon: Brain,
        color: 'text-muted-foreground',
        bgColor: 'bg-muted/10',
        pulseColor: 'bg-muted/20'
      }
  }
})
</script>

<style scoped>
.animate-in {
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fadeIn;
}

.scale-in-90 {
  animation-name: scaleIn90;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn90 {
  from { 
    opacity: 0;
    transform: scale(0.9);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}
</style>
