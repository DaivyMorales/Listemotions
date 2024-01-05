import { create } from "zustand";

interface OpenComponentsState {
  openArtists: boolean;
  setOpenArtists: (value: boolean) => void;
  openPlaylist: boolean;
  setOpenPlaylist: (value: boolean) => void;
  openNamingPlaylist: boolean;
  setOpenNamingPlaylist: (value: boolean) => void;
  openInputPrompt: boolean;
  setOpenInputPrompt: (value: boolean) => void;
}

export const useOpenComponents = create<OpenComponentsState>()((set) => ({
  openArtists: false,
  setOpenArtists: (value: boolean) => set((state) => ({ openArtists: value })),
  openPlaylist: false,
  setOpenPlaylist: (value: boolean) =>
    set((state) => ({ openPlaylist: value })),
  openNamingPlaylist: false,
  setOpenNamingPlaylist: (value: boolean) =>
    set((state) => ({ openNamingPlaylist: value })),
  openInputPrompt: false,
  setOpenInputPrompt: (value: boolean) =>
    set((state) => ({ openInputPrompt: value })),
}));
