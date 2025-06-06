<script setup lang="ts">
import Play from "@/icons/Play.vue";
import Pause from "@/icons/Pause.vue";
import { playerStore } from "@/store/playerStore";
import { computed } from "vue";
const { id } = defineProps<{ id: string }>();

const isPlayingPlaylist = computed(() => {
  return playerStore.isPlaying && playerStore.currentMusic.playlist?.id === id;
});

const handleClick = () => {
  if (isPlayingPlaylist.value) {
    playerStore.isPlaying = false;
    return;
  }

  if (playerStore.currentMusic.playlist?.id === id) {
    playerStore.isPlaying = true;
    return;
  }

  fetch(`/api/playlist/get?id=${id}`).then((response) => {
    response.json().then((data) => {
      const { songs, playlist } = data;
      playerStore.currentMusic = { songs, playlist, song: songs[0] };
      playerStore.isPlaying = true;
      console.log(songs, playlist);
    });
  });
};
</script>

<template>
  <button
    @click="handleClick"
    class="rounded-full bg-green-500 p-3 text-black hover:scale-110 transition hover:bg-green-400"
  >
    <Play v-if="!isPlayingPlaylist" />
    <Pause v-else />
  </button>
</template>

<style scoped></style>
