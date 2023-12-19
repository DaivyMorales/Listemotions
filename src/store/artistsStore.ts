import { create } from 'zustand';

interface ArtistsState {
    artistsSelected: string[];
    setArtistsSelected: (artists: string[]) => void;
}

export const useArtists = create<ArtistsState>()((set) => ({
    artistsSelected: [],
    setArtistsSelected: (artists: string[]) => set(state => ({ artistsSelected: artists }))
}));