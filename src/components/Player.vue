<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Play from "@/icons/Play.vue";
import Pause from "@/icons/Pause.vue";
import MaxVolume from "@/icons/MaxVolume.vue";
import MidVolume from "@/icons/MidVolume.vue";
import LowVolume from "@/icons/LowVolume.vue";
import MuteVolume from "@/icons/MuteVolume.vue";
import { playerStore } from "@/store/playerStore";
import CurrentSong from "@/components/CurrentSong.vue";
import Slider from "@/components/Slider.vue";

let audio: HTMLAudioElement;
const volumeValue = ref(playerStore.volume * 100);
const previousVolume = ref(playerStore.volume * 100);

onMounted(() => {
  audio = new Audio("/music/1/01.mp3");
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
    const volume = playerStore.volume;

    if (song) {
      audio.src = `/music/${playlist.albumId}/0${song.id}.mp3`;
      audio.volume = volume;
      audio.play();
    }
  }
);

watch(volumeValue, (newValue) => {
  playerStore.volume = newValue / 100;
  audio.volume = playerStore.volume;
});

const handleVolumeClick = () => {
  if (volumeValue.value === 0) {
    volumeValue.value = previousVolume.value;
  } else {
    previousVolume.value = volumeValue.value;
    volumeValue.value = 0;
  }

  playerStore.volume = volumeValue.value / 100;
  audio.volume = playerStore.volume;
};
</script>
<template>
  <div class="flex flex-row justify-between w-full px-4 z-50">
    <div>
      <CurrentSong :song="playerStore.currentMusic.song" />
    </div>
    <div class="grid place-content-center gap-4 flex-1">
      <div class="flex justify-center">
        <button
          class="bg-white rounded-full p-2 text-black"
          @click="playerStore.isPlaying = !playerStore.isPlaying"
        >
          <Play v-if="!playerStore.isPlaying" />
          <Pause v-else />
        </button>
      </div>
    </div>
    <div class="grid place-content-center">
      <Slider v-model:model-value="volumeValue" :min="0" :max="100">
        <template #before>
          <button
            class="opacity-70 hover:opacity-100 transition duration-300"
            @click="handleVolumeClick"
          >
            <MaxVolume v-if="volumeValue > 70" />
            <MidVolume v-if="volumeValue > 40 && volumeValue <= 70" />
            <LowVolume v-if="volumeValue > 0 && volumeValue <= 40" />
            <MuteVolume v-if="volumeValue == 0" />
          </button>
        </template>
      </Slider>
    </div>
  </div>
</template>

<style scoped></style>
