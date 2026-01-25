import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import chroma from 'chroma-js';
import { supabase } from '@/lib/supabase';

export interface Color {
  id: string;
  hex: string;
  isLocked: boolean;
}

export type Algorithm =
  | 'random' | 'calm' | 'luxury' | 'tech' | 'islamic' | 'food' | 'finance' | 'kids'
  | 'pastel' | 'neon' | 'dark' | 'light';

export interface SavedPalette {
  id: string;
  colors: string[];
  date: number;
  likes: number;
  is_public?: boolean;
  name?: string;
}

export interface PaletteState {
  colors: Color[];
  history: Color[][];
  historyIndex: number;
  algorithm: Algorithm;
  savedPalettes: SavedPalette[];

  // Actions
  generatePalette: () => void;
  toggleLock: (id: string) => void;
  setColors: (colors: Color[]) => void;
  setAlgorithm: (algo: Algorithm) => void;
  initFromUrl: (hexCodes: string[]) => void;
  undo: () => void;
  redo: () => void;
  updateColor: (id: string, newHex: string) => void;

  // Favorites Actions
  toggleFavorite: (targetColors?: string[]) => void; // Legacy / Generative
  toggleFavoritePalette: (id: string, currentColors?: string[]) => Promise<void>; // Real DB
  fetchFavorites: () => Promise<void>;
  removeFavorite: (id: string) => void;
  migrateLocalToCloud: () => Promise<void>;
  updateVisibility: (id: string, isPublic: boolean) => Promise<void>;
}

export const ALGORITHMS: { id: Algorithm; label: string }[] = [
  { id: 'random', label: '🎲 True Random' },
  { id: 'calm', label: '😌 Calm' },
  { id: 'luxury', label: '💎 Luxury' },
  { id: 'tech', label: '🤖 Tech' },
  { id: 'islamic', label: '🕌 Islamic' },
  { id: 'food', label: '🍔 Food' },
  { id: 'finance', label: '💰 Finance' },
  { id: 'kids', label: '🎈 Kids' },
  { id: 'pastel', label: '🎨 Pastel' },
  { id: 'neon', label: '⚡ Neon' },
  { id: 'dark', label: '🌑 Dark Mode' },
  { id: 'light', label: '☀️ Light Mode' },
];

export const generateColor = (algo: Algorithm): string => {
  switch (algo) {
    case 'calm': return chroma.hsl(Math.random() < 0.7 ? 160 + Math.random() * 100 : Math.random() * 360, 0.1 + Math.random() * 0.3, 0.6 + Math.random() * 0.3).hex();
    case 'luxury':
      const luxRand = Math.random();
      if (luxRand < 0.4) return chroma.hsl(0, 0, Math.random() * 0.15).hex();
      if (luxRand < 0.7) return chroma.hsl(35 + Math.random() * 15, 0.6 + Math.random() * 0.4, 0.4 + Math.random() * 0.4).hex();
      return chroma.hsl(Math.random() * 360, 0.8, 0.15).hex();
    case 'tech':
      const techRand = Math.random();
      if (techRand < 0.5) return chroma.hsl(200 + Math.random() * 40, 0.5 + Math.random() * 0.5, 0.4 + Math.random() * 0.5).hex();
      if (techRand < 0.8) return chroma.hsl(0, 0, Math.random()).hex();
      return chroma.hsl(Math.random() * 360, 1, 0.5).hex();
    case 'islamic':
      const islRand = Math.random();
      if (islRand < 0.4) return chroma.hsl(100 + Math.random() * 60, 0.5 + Math.random() * 0.4, 0.2 + Math.random() * 0.3).hex();
      if (islRand < 0.6) return chroma.hsl(35 + Math.random() * 15, 0.6 + Math.random() * 0.4, 0.5).hex();
      return chroma.hsl(20 + Math.random() * 20, 0.3 + Math.random() * 0.4, 0.8 + Math.random() * 0.15).hex();
    case 'food': return chroma.hsl(Math.random() < 0.8 ? Math.random() * 120 : 360, 0.6 + Math.random() * 0.4, 0.4 + Math.random() * 0.4).hex();
    case 'finance':
      const finRand = Math.random();
      if (finRand < 0.5) return chroma.hsl(200 + Math.random() * 40, 0.4 + Math.random() * 0.4, 0.2 + Math.random() * 0.4).hex();
      if (finRand < 0.7) return chroma.hsl(100 + Math.random() * 40, 0.4 + Math.random() * 0.4, 0.2 + Math.random() * 0.4).hex();
      return chroma.hsl(0, 0, Math.random() * 0.8 + 0.1).hex();
    case 'kids': return chroma.hsl([0, 60, 120, 240, 300][Math.floor(Math.random() * 5)] + (Math.random() * 20 - 10), 0.8 + Math.random() * 0.2, 0.5 + Math.random() * 0.3).hex();
    case 'pastel': return chroma.hsl(Math.random() * 360, 0.2 + Math.random() * 0.4, 0.7 + Math.random() * 0.2).hex();
    case 'neon': return chroma.hsl(Math.random() * 360, 1, 0.6).hex();
    case 'dark': return chroma.hsl(Math.random() * 360, Math.random(), Math.random() * 0.2).hex();
    case 'light': return chroma.hsl(Math.random() * 360, Math.random(), 0.8 + Math.random() * 0.2).hex();
    case 'random':
    default: return chroma.random().hex();
  }
};

export const usePaletteStore = create<PaletteState>()(persist((set, get) => ({
  colors: [
    { id: crypto.randomUUID(), hex: '#0F172A', isLocked: false },
    { id: crypto.randomUUID(), hex: '#FFFFFF', isLocked: false },
    { id: crypto.randomUUID(), hex: '#00CC66', isLocked: false },
    { id: crypto.randomUUID(), hex: '#1E1E1E', isLocked: false },
    { id: crypto.randomUUID(), hex: '#00CC66', isLocked: false },
  ],
  history: [],
  historyIndex: -1,
  algorithm: 'random',
  savedPalettes: [],

  generatePalette: () =>
    set((state) => {
      const newColors = state.colors.map((color) => {
        if (color.isLocked) return color;
        return { ...color, hex: generateColor(state.algorithm) };
      });
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newColors];
      if (newHistory.length > 50) newHistory.shift();
      return {
        colors: newColors,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }),

  toggleLock: (id) =>
    set((state) => ({
      colors: state.colors.map((color) =>
        color.id === id ? { ...color, isLocked: !color.isLocked } : color
      ),
    })),

  setColors: (colors) =>
    set((state) => {
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), colors];
      return {
        colors,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      }
    }),

  setAlgorithm: (algo) => set({ algorithm: algo }),

  initFromUrl: (hexCodes) =>
    set((state) => {
      if (hexCodes.length !== 5) return state;
      const newColors = hexCodes.map((hex, i) => ({
        id: state.colors[i]?.id || crypto.randomUUID(),
        hex: hex.startsWith('#') ? hex : '#' + hex,
        isLocked: state.colors[i]?.isLocked || false,
      }));
      return {
        colors: newColors,
        history: [newColors],
        historyIndex: 0
      };
    }),

  undo: () =>
    set((state) => {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          colors: state.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return state;
    }),

  redo: () =>
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          colors: state.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return state;
    }),

  updateColor: (id, newHex) =>
    set((state) => {
      const newColors = state.colors.map((c) =>
        c.id === id ? { ...c, hex: newHex } : c
      );
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newColors];
      return {
        colors: newColors,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }),

  /**
   * REAL DB FAVORITES SYNC
   */
  fetchFavorites: async () => {
    try {
      const { data: { session } } = await import('@/lib/supabase').then(m => m.safeGetSession());
      if (!session?.user) return;

      // Sync local to cloud first
      await get().migrateLocalToCloud();

      const { data, error } = await supabase
        .from('favorites')
        .select(`
            palette_id,
            palettes (
                id,
                name,
                colors,
                favorites_count,
                status
            )
        `)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
        return;
      }

      const formatted: SavedPalette[] = data
        .filter((item: any) => item.palettes) // Safety check if palette was deleted
        .map((item: any) => ({
          id: item.palettes.id,
          colors: item.palettes.colors,
          date: Date.now(),
          likes: item.palettes.favorites_count || 0,
          name: item.palettes.name
        }));

      set({ savedPalettes: formatted });
    } catch (e) {
      // Ignore AbortError or auth errors during init
    }
  },

  toggleFavoritePalette: async (id: string, currentColors: string[] = []) => {
    const state = get();

    // Check if already favorited (Optimistic)
    const existingIndex = state.savedPalettes.findIndex(p => p.id === id);
    const isFavorite = existingIndex !== -1;

    // 1. Optimistic Update
    if (isFavorite) {
      set({ savedPalettes: state.savedPalettes.filter(p => p.id !== id) });
    } else {
      const optimisticPalette: SavedPalette = {
        id,
        colors: currentColors.length > 0 ? currentColors : ['#ccc', '#ccc', '#ccc', '#ccc'],
        date: Date.now(),
        likes: 0,
        name: 'Loading...'
      };
      set({ savedPalettes: [optimisticPalette, ...state.savedPalettes] });
    }

    // 2. DB Sync
    try {
      const { data: { session } } = await import('@/lib/supabase').then(m => m.safeGetSession());

      if (!session?.user) return; // Guest mode - local only

      if (isFavorite) {
        // DELETE
        const { error } = await supabase.from('favorites').delete().match({ user_id: session.user.id, palette_id: id });

        if (error) {
          console.error('Failed to remove favorite:', error);
          // Ideally rollback here
        } else {
          try { await supabase.rpc('decrement_favorites', { row_id: id }); } catch (e) { /* Ignore */ }
        }
      } else {
        // INSERT
        const { error } = await supabase.from('favorites').insert({
          user_id: session.user.id,
          palette_id: id
        });

        if (error) {
          // Ignore duplicate key errors
          if (error.code !== '23505') console.error('Failed to add favorite:', error);
        } else {
          try { await supabase.rpc('increment_favorites', { row_id: id }); } catch (e) { /* Ignore */ }
        }
      }

    } catch (e: any) {
      if (e.name !== 'AbortError') console.error('Error syncing favorite:', e);
    }
  },

  /* LEGACY / GENERATOR FAVORITES (Hybrid) */
  /* LEGACY / GENERATOR FAVORITES (Hybrid) */
  toggleFavorite: async (targetColors?: string[]) => {
    const state = get();
    // Default to current editor colors if no target provided
    const colorsToToggle = targetColors || state.colors.map(c => c.hex);

    // Check if palette already exists in saved list (by color match)
    const currentHexStr = colorsToToggle.join('-');
    const existing = state.savedPalettes.find(p => p.colors.join('-') === currentHexStr);

    // 1. If it exists, remove it
    if (existing) {
      // Optimistic update
      set({ savedPalettes: state.savedPalettes.filter(p => p.id !== existing.id) });

      // DB Sync
      try {
        const { data: { session } } = await import('@/lib/supabase').then(m => m.safeGetSession());
        if (session?.user) {
          await supabase.from('favorites').delete().match({ user_id: session.user.id, palette_id: existing.id });
        }
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error('Auth check failed:', error);
      }
      return;
    }

    // 2. If it doesn't exist, create it
    const newId = crypto.randomUUID();
    const newPalette: SavedPalette = {
      id: newId,
      colors: colorsToToggle,
      date: Date.now(),
      likes: 0,
      name: 'AI Generated'
    };

    // Optimistic update
    set({ savedPalettes: [newPalette, ...state.savedPalettes] });

    // DB Sync
    try {
      const { data: { session } } = await import('@/lib/supabase').then(m => m.safeGetSession());
      if (session?.user) {
        try {
          // First, insert the palette itself
          const { error: paletteError } = await supabase.from('palettes').insert({
            id: newId,
            name: 'AI Generated',
            colors: colorsToToggle,
            status: 'published', // Publish by default for visibility? Or draft? PUBLISHED for now so user can see it.
            created_by: session.user.id
          });

          if (paletteError) {
            console.error('Failed to save palette to DB:', paletteError);
            return; // Don't try to favorite if palette creation failed
          }

          // Then, add to favorites
          const { error: favError } = await supabase.from('favorites').insert({
            user_id: session.user.id,
            palette_id: newId
          });

          if (favError) console.error('Failed to save favorite relation:', favError);

        } catch (err) {
          console.error('Unexpected error saving generated palette:', err);
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      console.error('Auth check failed:', error);
    }
  },

  removeFavorite: (id) =>
    set((state) => ({
      savedPalettes: state.savedPalettes.filter((p) => p.id !== id),
    })),

  migrateLocalToCloud: async () => {
    const state = get();
    if (state.savedPalettes.length === 0) return;

    try {
      const { data: { session } } = await import('@/lib/supabase').then(m => m.safeGetSession());
      if (!session?.user) return;

      await Promise.allSettled(state.savedPalettes.map(async (p) => {
        // 1. Ensure Palette Exists in DB
        const { error: palError } = await supabase.from('palettes').insert({
          id: p.id,
          name: p.name || 'Migrated Palette',
          colors: p.colors,
          status: 'published',
          created_by: session.user.id
        });

        // Ignore unique violation (palette already exists)
        if (palError && palError.code !== '23505') {
          // If we can't create the palette, we might fail to favorite it unless it exists.
        }

        // 2. Ensure Favorite Exists
        const { error: favError } = await supabase.from('favorites').insert({
          user_id: session.user.id,
          palette_id: p.id
        });

        if (favError && favError.code !== '23505') {
          // console.warn(`Failed to favor migrated palette ${p.id}:`, favError);
        }
      }));

    } catch (e) {
      console.error('Migration failed:', e);
    }
  },

  updateVisibility: async (id, isPublic) => {
    const state = get();
    const updatedPalettes = state.savedPalettes.map(p =>
      p.id === id ? { ...p, is_public: isPublic } : p
    );
    set({ savedPalettes: updatedPalettes });
  }

}), {
  name: 'palette-storage-v2',
}));
