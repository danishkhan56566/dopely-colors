import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModeState {
    mode: 'designer' | 'developer';
    setMode: (mode: 'designer' | 'developer') => void;
    toggleMode: () => void;
}

export const useModeStore = create<ModeState>()(
    persist(
        (set) => ({
            mode: 'designer',
            setMode: (mode) => set({ mode }),
            toggleMode: () => set((state) => ({
                mode: state.mode === 'designer' ? 'developer' : 'designer'
            })),
        }),
        {
            name: 'dopley-mode-storage',
        }
    )
);
