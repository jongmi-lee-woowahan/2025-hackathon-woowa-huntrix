<template>
  <div class="flex items-center justify-between w-full max-w-4xl mx-auto py-8">
    <div v-for="(step, index) in steps" :key="step.id" class="flex items-center flex-1">
      <div class="flex flex-col items-center space-y-2">
        <div
          :class="[
            'relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300',
            step.status === 'completed' 
              ? 'bg-primary border-primary text-primary-foreground' 
              : step.status === 'active'
              ? 'bg-primary/20 border-primary text-primary'
              : 'bg-background border-muted-foreground/30 text-muted-foreground'
          ]"
        >
          <CheckCircle v-if="step.status === 'completed'" class="h-6 w-6" />
          <Circle v-else :class="['h-6 w-6', step.status === 'active' ? 'fill-current' : '']" />
        </div>
        <div class="text-center space-y-1">
          <h3 :class="[
            'text-sm font-semibold',
            step.status === 'active' ? 'text-primary' : 
            step.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'
          ]">
            {{ step.title }}
          </h3>
          <p class="text-xs text-muted-foreground max-w-24">
            {{ step.description }}
          </p>
        </div>
      </div>
      <div v-if="index < steps.length - 1" class="flex-1 mx-4">
        <div :class="[
          'h-0.5 rounded-full transition-all duration-500',
          currentStep > index ? 'bg-primary' : 'bg-muted-foreground/20'
        ]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, Circle } from 'lucide-vue-next'

export type StepStatus = 'pending' | 'active' | 'completed'

interface Step {
  id: number
  title: string
  description: string
  status: StepStatus
}

interface Props {
  steps: Step[]
  currentStep: number
}

defineProps<Props>()
</script>
