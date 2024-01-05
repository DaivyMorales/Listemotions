import { create } from "zustand";

interface Images {
  height: number;
  url: string;
  width: number;
}

interface Artists {
  id: string;
  name: string;
}

interface Album {
  images: Images[];
  name: string;
}

interface Items {
  album: Album;
  name: string;
  artists: Artists[];
  id: string;
  duration_ms: number;
  uri: string;
}

interface Tracks {
  href: string;
  items: Items[];
  limit: number;
  next: string;
}

interface Data {
  tracks: Tracks;
}

interface GlobalIdsState {
  playlistId: string;
  setPlaylistId: (value: string) => void;
  responseGpt: Data[];
  setResponseGpt: (value: Data[]) => void;
}

export const useGlobalIds = create<GlobalIdsState>()((set) => ({
  playlistId: "",
  setPlaylistId: (value: string) => set((state) => ({ playlistId: value })),
  responseGpt: [],
  setResponseGpt: (value: Data[]) => set((state) => ({ responseGpt: value })),
}));
