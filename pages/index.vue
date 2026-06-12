<script setup lang="ts">
import { Languages, CheckCircle, Search } from 'lucide-vue-next'
const scanning = ref(false)
const scanned = ref(0)
const total = ref(0)
const gaps = ref<any[]>([])
const scanComplete = ref(false)
const route = useRoute()

const spaceId = route.query.space_id

function storyUrl(storyId: number, lang: string) {
  return `https://app.storyblok.com/#/me/spaces/${spaceId}/stories/0/0/${storyId}?lang=${lang}`
}

async function startScan() {
  scanning.value = true
  scanComplete.value = false
  gaps.value = []

  const data = await $fetch('/api/scan')

  gaps.value = data.gaps
  scanned.value = data.total
  total.value = data.total
  scanning.value = false
  scanComplete.value = true
}
</script>

<template>
  <div class="h-screen flex flex-col font-roboto">

    <!-- App Header -->
    <div class="px-8 py-5 border-b border-gray-200 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center shrink-0">
          <Languages class="text-white" :size="20" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900 leading-tight">Translation Coverage Checker</h1>
          <p class="text-sm text-gray-400 leading-tight">Scan published stories for missing or outdated translations.
          </p>
        </div>
      </div>
    </div>

    <!-- Scan Results Bar -->
    <div v-if="scanComplete"
      class="mx-4 mt-3 bg-gray-900 text-white rounded-lg px-5 py-3 flex items-center gap-6 shrink-0">
      <CheckCircle class="text-teal-400 shrink-0" :size="18" />
      <div>
        <p class="text-sm text-gray-400">Scanned</p>
        <p class="text-sm font-medium">{{ scanned }} / {{ total }} stories</p>
      </div>
      <div>
        <p class="text-sm text-gray-400">Found</p>
        <p class="text-sm font-medium">{{gaps.filter(g => g.status !== 'published').length}} translation gaps</p>
      </div>
      <button
        class="ml-auto flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
        @click="startScan">
        <Search :size="12" />
        Rescan
      </button>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto mx-4 mt-4">

      <!-- Initial State -->
      <div v-if="!scanning && !scanComplete"
        class="bg-gray-100 rounded-xl flex flex-col items-center justify-center py-40">
        <p class="text-lg font-semibold text-gray-800 mb-2">Welcome!</p>
        <p class="text-sm text-gray-500 mb-8">Scan all published stories for translation gaps.</p>
        <button
          class="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
          @click="startScan">
          <Search :size="16" />
          Scan content
        </button>
      </div>

      <!-- Scanning State -->
      <div v-if="scanning" class="bg-gray-100 rounded-xl flex flex-col items-center justify-center py-40">
        <p class="text-sm text-gray-500 mb-3">Scanning stories...</p>
        <div class="w-40 h-1 bg-gray-300 rounded-full overflow-hidden">
          <div class="h-full bg-teal-500 rounded-full animate-pulse w-1/2"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="scanComplete && gaps.filter(g => g.status !== 'published').length === 0"
        class="bg-gray-100 rounded-xl flex flex-col items-center justify-center py-40">
        <CheckCircle class="text-teal-500 mb-3" :size="36" />
        <p class="text-sm font-semibold text-gray-800">All translations are up to date!</p>
        <p class="mt-4 text-sm text-gray-400">The whole space has been searched</p>
      </div>

      <!-- Results -->
      <div v-if="scanComplete && gaps.filter(g => g.status !== 'published').length > 0">
        <div class="divide-y divide-gray-100">
          <div v-for="gap in gaps.filter(g => g.status !== 'published')" :key="`${gap.storyId}-${gap.language}`"
            class="py-4 flex items-center justify-between gap-4">
            <div class="min-w-0 flex-1">
              <a :href="storyUrl(gap.storyId, gap.language)" target="_blank" rel="noopener noreferrer"
                class="text-sm font-semibold text-teal-600 hover:text-teal-800 hover:underline truncate block">{{
                  gap.storyName }}</a>
              <p class="text-sm text-gray-400 truncate">{{ gap.slug }}</p>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <span class="text-sm font-medium uppercase tracking-wide text-gray-500">{{ gap.language }}</span>
              <span class="text-sm px-3 py-1 rounded-full whitespace-nowrap" :class="{
                'bg-red-100 text-red-600': gap.status === 'never_published',
                'bg-yellow-100 text-yellow-700': gap.status === 'out_of_date',
                'bg-green-100 text-green-700': gap.status === 'published',
              }">
                {{ gap.status === 'never_published' ? 'Never published' : gap.status === 'out_of_date' ? 'Published, has draft changes' : 'Published' }}
              </span>
            </div>
          </div>
        </div>
        <p class="text-center text-sm text-gray-400 mt-6 mb-4">The whole space has been searched</p>
      </div>
    </div>
  </div>
</template>