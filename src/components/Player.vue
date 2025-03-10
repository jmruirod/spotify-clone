<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Play from "@/icons/Play.vue";
import Pause from "@/icons/Pause.vue";
import MaxVolume from "@/icons/MaxVolume.vue";
import MidVolume from "@/icons/MidVolume.vue";
import LowVolume from "@/icons/LowVolume.vue";
import MuteVolume from "@/icons/MuteVolume.vue";
import Previous from "@/icons/Previous.vue";
import Next from "@/icons/Next.vue";
import { playerStore } from "@/store/playerStore";
import CurrentSong from "@/components/CurrentSong.vue";
import Slider from "@/components/Slider.vue";
import { formatSongTime, getSongTimeDuration } from "@/composable/useTime";
import Random from "@/icons/Random.vue";

let audio: HTMLAudioElement;
const previousVolume = ref(playerStore.volume);
let isUserChangingTime = false;
const isHoveringVolume = ref(false);
let finishedSongs: number[] = [];
onMounted(() => {
  audio = new Audio();
  audio.addEventListener("timeupdate", () => {
    if (!isUserChangingTime) {
      playerStore.currentSongTime = audio.currentTime;
    }
  });

  audio.addEventListener("ended", () => {
    handleNextSong();
  });
});

const getRandomSong = () => {
  const songs = playerStore.currentMusic.songs;
  const randomIndex = Math.floor(Math.random() * songs.length);
  if (finishedSongs.includes(songs[randomIndex].id)) {
    return getRandomSong();
  }
  return songs[randomIndex];
};

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
  () => playerStore.currentMusic.song,
  (song) => {
    const { playlist } = playerStore.currentMusic;
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

const handleSongChange = (direction: "previous" | "next") => {
  const currentIndex = playerStore.currentMusic.songs.findIndex(
    (song) => song.id === playerStore.currentMusic.song.id
  );
  const totalSongs = playerStore.currentMusic.songs.length;

  if (playerStore.isRandom && direction === "next") {
    if (finishedSongs.length === totalSongs) {
      finishedSongs = [];
    }
    finishedSongs.push(playerStore.currentMusic.song.id);
    playerStore.currentMusic.song = getRandomSong();
    return;
  }

  const newIndex =
    direction === "previous"
      ? currentIndex === 0
        ? totalSongs - 1
        : currentIndex - 1
      : currentIndex === totalSongs - 1
      ? 0
      : currentIndex + 1;

  playerStore.currentMusic.song = playerStore.currentMusic.songs[newIndex];
};

const handlePreviousSong = () => handleSongChange("previous");
const handleNextSong = () => handleSongChange("next");
</script>
<template>
  <div class="flex flex-row justify-between w-full px-2 z-50">
    <div class="w-[342px]">
      <CurrentSong :song="playerStore.currentMusic.song" />
    </div>
    <div class="grid place-content-center gap-4 flex-1">
      <div class="flex justify-center flex-col items-center">
        <div class="flex gap-x-6">
          <button
            class="transition hover:scale-105"
            :class="{
              'opacity-70': !playerStore.isRandom,
              'hover:opacity-100': !playerStore.isRandom,
            }"
            @click="playerStore.isRandom = !playerStore.isRandom"
          >
            <Random :isActive="playerStore.isRandom" />
          </button>

          <button
            class="opacity-70 hover:opacity-100 hover:scale-105 transition"
            @click="handlePreviousSong"
          >
            <Previous />
          </button>

          <button
            class="bg-white rounded-full p-1.5 text-black hover:scale-105 transition"
            @click="playerStore.isPlaying = !playerStore.isPlaying"
          >
            <Play v-if="!playerStore.isPlaying" />
            <Pause v-else />
          </button>

          <button
            class="opacity-70 hover:opacity-100 hover:scale-105 transition"
            @click="handleNextSong"
          >
            <Next />
          </button>
        </div>
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
      <Slider
        v-model="playerStore.volume"
        :min="0"
        :max="100"
        :isHovering="isHoveringVolume"
        width="w-[100px]"
      >
        <template #before>
          <button
            class="opacity-70 hover:opacity-100 transition duration-300 cursor-pointer"
            @click="handleVolumeClick"
            @mouseenter="isHoveringVolume = true"
            @mouseleave="isHoveringVolume = false"
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
