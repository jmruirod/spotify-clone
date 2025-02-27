import type { Playlist, Song } from "@/lib/data";
import { reactive } from "vue";

export const playerStore = reactive({
  isPlaying: false,
  currentMusic: { playlist: {} as Playlist, song: {} as Song, songs: [] as Song[] },
});
