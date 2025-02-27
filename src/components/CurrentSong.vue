<script setup lang="ts">
import type { Song } from "@/lib/data";

defineProps<{
  song: Song;
}>();
</script>

<template>
  <div class="flex items-center gap-5 relative overflow-hidden">
    <picture class="w-16 h-16 bg-zinc-800 rounded-md shadow-lg overflow-hidden">
      <img :src="song.image" :alt="song.title" />
    </picture>
    <div class="flex flex-col">
      <h3 class="font-semibold text-sm block">{{ song.title }}</h3>
      <span class="text-xs opacity-80">{{ song.artists?.join(", ") }}</span>
    </div>
  </div>
</template>

<style scoped></style>
