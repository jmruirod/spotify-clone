import type { Playlist, Song } from "@/lib/data";
import { reactive } from "vue";

export const playerStore = reactive({
  isPlaying: false,
  isRandom: false,
  currentMusic: { playlist: {} as Playlist, song: {} as Song, songs: [] as Song[] },
  volume: 100,
  currentSongTime: 0,
});
