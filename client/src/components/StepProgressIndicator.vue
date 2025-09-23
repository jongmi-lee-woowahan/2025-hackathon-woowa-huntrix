<template>
  <div class="w-full max-w-5xl mx-auto py-8 px-6">
    <!-- Progress Steps -->
    <div class="flex items-center justify-center relative">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="flex items-center"
        :class="index === steps.length - 1 ? '' : 'flex-1'"
      >
        <!-- Step Circle -->
        <div class="flex flex-col items-center relative z-10">
          <div
            class="flex items-center justify-center w-14 h-14 rounded-full border-3 transition-all duration-300 bg-background shadow-lg"
            :class="getStepClasses(step)"
          >
            <CheckCircle 
              v-if="step.status === 'completed'" 
              class="w-7 h-7 text-primary-foreground" 
            />
            <component 
              v-else
              :is="step.icon || Circle"
              class="w-7 h-7"
              :class="step.status === 'active' ? 'text-primary-foreground' : 'text-muted-foreground'"
            />
          </div>
        </div>
        
        <!-- Connecting Line with Flow Animation -->
        <div
          v-if="index < steps.length - 1"
          class="flex-1 mx-8 relative"
        >
          <!-- Background line -->
          <div class="h-1 bg-border rounded-full"></div>
          
          <!-- Progress line -->
          <div
            class="absolute top-0 h-1 rounded-full transition-all duration-700"
            :class="getProgressLineClass(step, index)"
          ></div>
          
          <!-- Flowing animation for active step -->
          <div
            v-if="step.status === 'active'"
            class="absolute top-0 h-1 bg-gradient-to-r from-transparent via-primary/80 to-transparent rounded-full w-8 animate-flow"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- Step Labels -->
    <div class="flex items-start justify-center mt-8">
      <div
        v-for="(step, index) in steps"
        :key="`label-${step.id}`"
        class="text-center flex-1 px-4"
        :class="index === steps.length - 1 ? 'max-w-xs' : 'max-w-sm'"
      >
        <h3
          class="text-base font-semibold mb-2 transition-colors duration-300"
          :class="getTextClass(step)"
        >
          {{ step.title }}
        </h3>
        <p
          class="text-sm leading-relaxed transition-colors duration-300"
          :class="getDescriptionClass(step)"
        >
          {{ step.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, Circle } from 'lucide-vue-next'
import { computed } from 'vue'

export type StepStatus = 'pending' | 'active' | 'completed'

interface Step {
  id: number
  title: string
  description: string
  status: StepStatus
  icon?: any
}

interface Props {
  steps: Step[]
  currentStep: number
}

const props = defineProps<Props>()

// 스텝 원형 스타일
const getStepClasses = (step: Step) => {
  if (step.status === 'completed') {
    return 'bg-primary border-primary text-primary-foreground border-3'
  } else if (step.status === 'active') {
    return 'bg-primary/20 border-primary text-primary border-3 ring-4 ring-primary/20 animate-pulse'
  } else {
    return 'bg-background border-muted-foreground/30 text-muted-foreground border-2'
  }
}

// 진행바 스타일
const getProgressLineClass = (step: Step, index: number) => {
  if (step.status === 'completed') {
    return 'bg-primary w-full'
  } else if (step.status === 'active') {
    return 'bg-gradient-to-r from-primary to-primary/60 w-3/4 animate-pulse'
  } else {
    return 'bg-border w-0'
  }
}

// 텍스트 스타일
const getTextClass = (step: Step) => {
  if (step.status === 'active') {
    return 'text-primary'
  } else if (step.status === 'completed') {
    return 'text-primary'
  } else {
    return 'text-muted-foreground'
  }
}

// 설명 텍스트 스타일
const getDescriptionClass = (step: Step) => {
  if (step.status === 'active') {
    return 'text-primary/80'
  } else if (step.status === 'completed') {
    return 'text-primary/70'
  } else {
    return 'text-muted-foreground/70'
  }
}
</script>

<style scoped>
@keyframes flow {
  0% {
    left: -10%;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

.animate-flow {
  animation: flow 2.5s ease-in-out infinite;
}

.border-3 {
  border-width: 3px;
}
</style>
