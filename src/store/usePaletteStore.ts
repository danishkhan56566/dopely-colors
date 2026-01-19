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
  | 'pastel' | 'neon' | 'dark' | 'light'; // Keeping legacy for now

export interface SavedPalette {
  id: string;
  colors: string[];
  date: number;
  likes: number;
  is_public?: boolean;
}

export interface PaletteState {
  colors: Color[];
  history: Color[][];
  historyIndex: number;
  algorithm: Algorithm;
  generatePalette: () => void;
  toggleLock: (id: string) => void;
  setColors: (colors: Color[]) => void;
  setAlgorithm: (algo: Algorithm) => void;
  initFromUrl: (hexCodes: string[]) => void;
  undo: () => void;
  redo: () => void;
  updateColor: (id: string, newHex: string) => void;
  savedPalettes: SavedPalette[];
  toggleFavorite: (targetColors?: string[]) => void;
  removeFavorite: (id: string) => void;
  migrateLocalToCloud: () => Promise<void>;
  updateVisibility: (id: string, isPublic: boolean) => Promise<void>;
}


const generateColor = (algo: Algorithm): string => {
  switch (algo) {
    case 'calm':
      // Low saturation, medium-high lightness, cool hues preferenced
      return chroma.hsl(
        Math.random() < 0.7 ? 160 + Math.random() * 100 : Math.random() * 360, // Mostly blues/teals
        0.1 + Math.random() * 0.3,
        0.6 + Math.random() * 0.3
      ).hex();

    case 'luxury':
      // Gold, Black, Deep colors. 
      // Strategy: 40% dark neutral, 40% gold/metallic, 20% deep rich color
      const luxRand = Math.random();
      if (luxRand < 0.4) return chroma.hsl(0, 0, Math.random() * 0.15).hex(); // Black/Dark Grey
      if (luxRand < 0.7) return chroma.hsl(35 + Math.random() * 15, 0.6 + Math.random() * 0.4, 0.4 + Math.random() * 0.4).hex(); // Gold/Bronze
      return chroma.hsl(Math.random() * 360, 0.8, 0.15).hex(); // Deep Rich Color

    case 'tech':
      // Blue, Grey, Cyan, maybe one accent
      const techRand = Math.random();
      if (techRand < 0.5) return chroma.hsl(200 + Math.random() * 40, 0.5 + Math.random() * 0.5, 0.4 + Math.random() * 0.5).hex(); // Blue/Cyan
      if (techRand < 0.8) return chroma.hsl(0, 0, Math.random()).hex(); // Greyscale
      return chroma.hsl(Math.random() * 360, 1, 0.5).hex(); // Vibrant Accent

    case 'islamic':
      // Greens, Golds, Earths, White/Cream
      const islRand = Math.random();
      if (islRand < 0.4) return chroma.hsl(100 + Math.random() * 60, 0.5 + Math.random() * 0.4, 0.2 + Math.random() * 0.3).hex(); // Green
      if (islRand < 0.6) return chroma.hsl(35 + Math.random() * 15, 0.6 + Math.random() * 0.4, 0.5).hex(); // Gold
      return chroma.hsl(20 + Math.random() * 20, 0.3 + Math.random() * 0.4, 0.8 + Math.random() * 0.15).hex(); // Cream/Earth

    case 'food':
      // Reds, Oranges, Yellows, Greens. High saturation.
      return chroma.hsl(
        Math.random() < 0.8 ? Math.random() * 120 : 360, // Warm range + Green
        0.6 + Math.random() * 0.4,
        0.4 + Math.random() * 0.4
      ).hex();

    case 'finance':
      // Trust blues, money greens, greys.
      const finRand = Math.random();
      if (finRand < 0.5) return chroma.hsl(200 + Math.random() * 40, 0.4 + Math.random() * 0.4, 0.2 + Math.random() * 0.4).hex(); // Trust Blue
      if (finRand < 0.7) return chroma.hsl(100 + Math.random() * 40, 0.4 + Math.random() * 0.4, 0.2 + Math.random() * 0.4).hex(); // Money Green
      return chroma.hsl(0, 0, Math.random() * 0.8 + 0.1).hex(); // Grey

    case 'kids':
      // Primary colors, very high saturation and brightness
      return chroma.hsl(
        [0, 60, 120, 240, 300][Math.floor(Math.random() * 5)] + (Math.random() * 20 - 10),
        0.8 + Math.random() * 0.2,
        0.5 + Math.random() * 0.3
      ).hex();

    case 'pastel':
      return chroma.hsl(Math.random() * 360, 0.2 + Math.random() * 0.4, 0.7 + Math.random() * 0.2).hex();
    case 'neon':
      return chroma.hsl(Math.random() * 360, 1, 0.6).hex();
    case 'dark':
      return chroma.hsl(Math.random() * 360, Math.random(), Math.random() * 0.2).hex();
    case 'light':
      return chroma.hsl(Math.random() * 360, Math.random(), 0.8 + Math.random() * 0.2).hex();
    case 'random':
    default:
      return chroma.random().hex();
  }
};

export const usePaletteStore = create<PaletteState>()(persist((set, get) => ({
  colors: [
    { id: crypto.randomUUID(), hex: '#0F172A', isLocked: false }, // Text
    { id: crypto.randomUUID(), hex: '#FFFFFF', isLocked: false }, // Background
    { id: crypto.randomUUID(), hex: '#00CC66', isLocked: false }, // Primary
    { id: crypto.randomUUID(), hex: '#1E1E1E', isLocked: false }, // Secondary
    { id: crypto.randomUUID(), hex: '#00CC66', isLocked: false }, // Accent
  ],
  history: [],
  historyIndex: -1,
  algorithm: 'random',

  generatePalette: () =>
    set((state) => {
      const newColors = state.colors.map((color) => {
        if (color.isLocked) return color;
        return { ...color, hex: generateColor(state.algorithm) };
      });

      // Add to history
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newColors];

      // Limit history size to 50
      if (newHistory.length > 50) {
        newHistory.shift();
      }

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

  // Used for manual setting or URL hydration (pushes to history)
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
      // Only init if validity check passes
      if (hexCodes.length !== 5) return state;

      const newColors = hexCodes.map((hex, i) => ({
        id: state.colors[i]?.id || crypto.randomUUID(),
        hex: hex.startsWith('#') ? hex : '#' + hex,
        isLocked: state.colors[i]?.isLocked || false, // Preserve locks if possible, though usually this is fresh load
      }));

      // Initial load shouldn't necessarily wipe history, but usually it starts fresh.
      // Let's treat it as the first history entry.
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

  // Manual Color Update
  updateColor: (id, newHex) =>
    set((state) => {
      const newColors = state.colors.map((c) =>
        c.id === id ? { ...c, hex: newHex } : c
      );
      // Add to history so undo works for manual edits too
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newColors];
      return {
        colors: newColors,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }),

  // Favorites
  savedPalettes: [],
  toggleFavorite: async (targetColors?: string[]) => {
    const state = get();
    // Use provided colors or current state colors
    const colorsToToggle = targetColors || state.colors.map(c => c.hex);
    const currentHexStr = colorsToToggle.join('-');
    const existingIndex = state.savedPalettes.findIndex(
      (p: SavedPalette) => p.colors.join('-') === currentHexStr
    );

    // Database Sync
    // We check configuration inside the helper or try/catch. 
    // Here we'll just try to get session. If supabase is not configured, this might throw or return null.
    // For now, assuming basic setup exists (client created), but keys might be empty strings.
    const { data } = await supabase.auth.getSession();
    const session = data?.session;

    if (existingIndex >= 0) {
      // Remove
      if (session?.user) {
        // Best effort delete from DB
        const paletteToDelete = state.savedPalettes[existingIndex];
        if (paletteToDelete.id) {
          supabase.from('palettes').delete().eq('id', paletteToDelete.id).then();
        }
      }
      set({ savedPalettes: state.savedPalettes.filter((_: SavedPalette, i: number) => i !== existingIndex) });
    } else {
      // Add
      const newPalette: SavedPalette = {
        id: crypto.randomUUID(),
        colors: colorsToToggle,
        date: Date.now(),
        likes: 0,
      };

      if (session?.user) {
        const { data } = await supabase.from('palettes').insert({
          user_id: session.user.id,
          name: 'Untitled Palette',
          colors: newPalette.colors,
          tags: [],
          is_public: false
        }).select().single();

        if (data) {
          newPalette.id = data.id; // Use DB ID
        }
      }

      set({ savedPalettes: [newPalette, ...state.savedPalettes] });
    }
  },

  removeFavorite: (id) =>
    set((state) => ({
      savedPalettes: state.savedPalettes.filter((p) => p.id !== id),
    })),

  migrateLocalToCloud: async () => {
    const state = get();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) return;

    // Filter palettes that don't have a valid UUID (assuming local ones might use different ID scheme or we just check ownership)
    // Actually, easier strategy: Just try to upload all "local" ones.
    // But we need to avoid duplicates.

    const localPalettes = state.savedPalettes;

    // Fetch existing cloud palettes to compare
    const { data: cloudPalettes } = await supabase
      .from('palettes')
      .select('colors')
      .eq('user_id', session.user.id);

    const existingSignatures = new Set(cloudPalettes?.map(p => p.colors.join('-')) || []);

    for (const p of localPalettes) {
      const signature = p.colors.join('-');

      if (!existingSignatures.has(signature)) {
        // Upload
        await supabase.from('palettes').insert({
          user_id: session.user.id,
          name: 'Migrated Palette',
          colors: p.colors,
          created_at: new Date(p.date).toISOString(), // Preserve date
          tags: [],
          is_public: false
        });
      }
    }
  },

  updateVisibility: async (id, isPublic) => {
    const state = get();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) return;

    // Update local state
    const updatedPalettes = state.savedPalettes.map(p =>
      p.id === id ? { ...p, is_public: isPublic } : p
    );
    set({ savedPalettes: updatedPalettes });

    // Update DB
    await supabase.from('palettes').update({ is_public: isPublic }).eq('id', id);
  }
}), {
  name: 'palette-storage-v2', // Bump version to force new brand defaults
  // Optional: Handle hydration manually if needed, but version bump is enough usually.
  // Actually, keep default hydration behavior but new key.
}));
