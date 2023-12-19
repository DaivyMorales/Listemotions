import { create } from 'zustand';

interface CountState {
    openArtists: boolean;
    setOpenArtists: (value: boolean) => void;
}

export const useOpenComponents = create<CountState>()((set) => ({
    openArtists: false,
    setOpenArtists: (value: boolean) => set(state => ({ openArtists: value }))
}));