import { type Song } from "@/lib/data";

export const getSongTimeDuration = (duration: string) => {
  const [minutes, seconds] = duration.split(":").map(Number);
  return minutes * 60 + seconds;
};

export const formatSongTime = (current: number) => {
  const minutes = Math.floor(current / 60);
  const seconds = Math.floor(current % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0").padEnd(2, "0")}`;
};

export const getPlaylistTotalDuration = (playlistSongs: Song[]) => {
  return playlistSongs.reduce((acc, song) => acc + getSongTimeDuration(song.duration), 0);
};

export const getPlaylistTotalDurationFormatted = (totalDuration: number) => {
  const totalSeconds = totalDuration;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 10) return `${hours} h aproximadamente`;

  const timeParts = [];
  if (hours > 0) timeParts.push(`${hours} h`);
  if (minutes > 0) timeParts.push(`${minutes} min`);
  if (seconds > 0 || timeParts.length === 0) timeParts.push(`${seconds} s`);

  return timeParts.join(" ") + (hours > 0 ? " aproximadamente" : "");
};
