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
import { formatSongTime, getSongTimeDuration } from "@/composable/useTime";

let audio: HTMLAudioElement;
const previousVolume = ref(playerStore.volume);
let isUserChangingTime = false;

onMounted(() => {
  audio = new Audio();
  audio.addEventListener("timeupdate", () => {
    if (!isUserChangingTime) {
      playerStore.currentSongTime = audio.currentTime;
    }
  });
});

// Play/Pause
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

// Play song
watch(
  () => playerStore.currentMusic,
  (currentMusic) => {
    const { song, playlist } = currentMusic;
    const volume = playerStore.volume;

    if (song) {
      audio.src = `/music/${playlist.albumId}/0${song.id}.mp3`;
      audio.volume = volume / 100;
      audio.play();
    }
  }
);

const handleManualTimeUpdate = (event: Event) => {
  if (event.type === "mousedown") {
    isUserChangingTime = true;
  } else {
    isUserChangingTime = false;
    audio.currentTime = playerStore.currentSongTime;
  }
};

// Volume
watch(
  () => playerStore.volume,
  (volume) => {
    audio.volume = volume / 100;
  }
);

const handleVolumeClick = () => {
  if (playerStore.volume === 0) {
    playerStore.volume = previousVolume.value;
  } else {
    previousVolume.value = playerStore.volume;
    playerStore.volume = 0;
  }

  audio.volume = playerStore.volume / 100;
};
</script>
<template>
  <div class="flex flex-row justify-between w-full px-2 z-50">
    <div class="w-[342px]">
      <CurrentSong :song="playerStore.currentMusic.song" />
    </div>
    <div class="grid place-content-center gap-4 flex-1">
      <div class="flex justify-center flex-col items-center">
        <button
          class="bg-white rounded-full p-2 text-black hover:scale-110 transition"
          @click="playerStore.isPlaying = !playerStore.isPlaying"
        >
          <Play v-if="!playerStore.isPlaying" />
          <Pause v-else />
        </button>
        <div class="flex gap-x-3 text-xs">
          <Slider
            v-model="playerStore.currentSongTime"
            :min="0"
            :max="
              playerStore.currentMusic.song.duration
                ? getSongTimeDuration(playerStore.currentMusic.song.duration)
                : 100
            "
            width="w-[550px]"
            padding-top="pt-2"
            @onSliderMouseDown="handleManualTimeUpdate"
            @onSliderRelease="handleManualTimeUpdate"
          >
            <template #before>
              <span class="opacity-50 w-10 text-right">{{
                formatSongTime(playerStore.currentSongTime)
              }}</span>
            </template>
            <template #after>
              <span class="opacity-50 w-10">{{
                playerStore.currentMusic.song.duration ?? "0:00"
              }}</span>
            </template>
          </Slider>
        </div>
      </div>
    </div>
    <div class="flex justify-end w-[342px] px-10">
      <Slider v-model="playerStore.volume" :min="0" :max="100">
        <template #before>
          <button
            class="opacity-70 hover:opacity-100 transition duration-300"
            @click="handleVolumeClick"
          >
            <MaxVolume v-if="playerStore.volume > 70" />
            <MidVolume v-if="playerStore.volume > 40 && playerStore.volume <= 70" />
            <LowVolume v-if="playerStore.volume > 0 && playerStore.volume <= 40" />
            <MuteVolume v-if="playerStore.volume == 0" />
          </button>
        </template>
      </Slider>
    </div>
  </div>
</template>

<style scoped></style>
