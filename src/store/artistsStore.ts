import { Data } from "@/components/Artists";
import { create } from "zustand";

interface ArtistsState {
  artistsSelected: string[];
  setArtistsSelected: (artists: string[]) => void;
  clickArtist: Data[];
  setClickArtist: (artists: Data[]) => void;
}

export const useArtists = create<ArtistsState>()((set) => ({
  artistsSelected: [],
  setArtistsSelected: (artists: string[]) =>
    set((state) => ({ artistsSelected: artists })),
  clickArtist: [],
  setClickArtist: (artist: Data[]) => set((state) => ({ clickArtist: artist })),
}));
