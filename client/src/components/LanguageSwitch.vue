<template>
  <div class="relative">
    <button
      ref="languageButton"
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors bg-background"
    >
      <span class="text-sm font-medium">{{ currentLanguageLabel }}</span>
      <svg 
        class="w-4 h-4 transition-transform" 
        :class="{ 'rotate-180': showDropdown }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Language Dropdown Content -->
    <div 
      v-if="showDropdown"
      class="absolute top-full right-0 mt-2 w-32 bg-background border border-border rounded-lg shadow-xl z-[999999] max-w-[calc(100vw-2rem)]"
      data-dropdown="language"
      @click.stop
    >
      <div class="py-1">
        <button
          v-for="language in languages"
          :key="language.code"
          @click="changeLanguage(language.code)"
          class="w-full px-3 py-2 text-left text-sm transition-colors"
          :class="{ 
            'bg-primary text-primary-foreground': language.code === currentLocale,
            'hover:bg-muted': language.code !== currentLocale
          }"
        >
          {{ language.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const showDropdown = ref(false)
const languageButton = ref<HTMLElement>()

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' }
]

const currentLocale = computed(() => locale.value)

const currentLanguageLabel = computed(() => {
  const current = languages.find(lang => lang.code === currentLocale.value)
  return current ? current.label : 'English'
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const changeLanguage = (languageCode: string) => {
  locale.value = languageCode
  showDropdown.value = false
  console.log('Language changed to:', languageCode)
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  
  // Check if click is outside language dropdown
  if (showDropdown.value && languageButton.value && 
      !languageButton.value.contains(target) && 
      !target.closest('[data-dropdown="language"]')) {
    showDropdown.value = false
  }
}

// Setup click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
