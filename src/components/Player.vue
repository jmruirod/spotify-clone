<script setup lang="ts">
import { onMounted, watch } from "vue";
import Play from "@/icons/Play.vue";
import Pause from "@/icons/Pause.vue";
import { playerStore } from "@/store/playerStore";
import CurrentSong from "@/components/CurrentSong.vue";
import Slider from "@/components/Slider.vue";
let audio: HTMLAudioElement;

onMounted(() => {
  audio = new Audio("/public/music/1/01.mp3");
});

watch(
  () => playerStore.isPlaying,
  (isPlaying) => {
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }
);

watch(
  () => playerStore.currentMusic,
  (currentMusic) => {
    const { song, playlist, songs } = currentMusic;

    if (song) {
      const src = `/public/music/${playlist.albumId}/0${song.id}.mp3`;
      audio.src = src;
      audio.play();
    }
  }
);

const handleClick = () => {
  playerStore.isPlaying = !playerStore.isPlaying;
};
</script>
<template>
  <div class="flex flex-row justify-between w-full px-4 z-50">
    <div>
      <CurrentSong :song="playerStore.currentMusic.song" />
    </div>
    <div class="grid place-content-center gap-4 flex-1">
      <div class="flex justify-center">
        <button class="bg-white rounded-full p-2 text-black" @click="handleClick">
          <Play v-if="!playerStore.isPlaying" />
          <Pause v-else />
        </button>
      </div>
    </div>
    <div class="grid place-content-center">
      <!-- <input
        id="default-range"
        type="range"
        value="100"
        class="w-full h-1.5 appearance-none bg-white rounded-full focus:outline-none accent-white hover:bg-emerald-600 text-red-700"
      /> -->
      <Slider />
    </div>
  </div>
</template>

<style scoped></style>
