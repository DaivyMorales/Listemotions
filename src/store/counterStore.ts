import { create } from 'zustand';

interface CountState {
    count: number;
    incrementCount: () => void;
}

export const useCounter = create<CountState>()((set) => ({
    count: 10,
    incrementCount: () => set(state => ({ count: state.count + 1 }))
}));