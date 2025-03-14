import { allPlaylists, songs as allSongs } from "@/lib/data";

export async function GET({ params, request }) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const playlist = allPlaylists.find((playlist) => playlist.id === id);
  const songs = allSongs.filter((song) => song.albumId === playlist?.albumId);

  return new Response(JSON.stringify({ songs, playlist }));
}
