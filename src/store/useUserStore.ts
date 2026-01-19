import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    is_pro: boolean;
    joined_at: string;
}

interface UserState {
    user: UserProfile | null;
    isLoading: boolean;

    // Actions
    loginEmail: (email: string) => Promise<void>;
    loginGoogle: () => Promise<void>;
    logout: () => void;
    upgradeToPro: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: false,

            loginEmail: async (email) => {
                set({ isLoading: true });
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                set({
                    isLoading: false,
                    user: {
                        id: 'mock-user-123',
                        email,
                        name: email.split('@')[0],
                        is_pro: false,
                        joined_at: new Date().toISOString(),
                    }
                });
            },

            loginGoogle: async () => {
                set({ isLoading: true });
                // Simulate Google OAuth delay
                await new Promise(resolve => setTimeout(resolve, 2500));

                set({
                    isLoading: false,
                    user: {
                        id: 'mock-google-user',
                        email: 'demo@gmail.com',
                        name: 'Demo User',
                        avatar_url: 'https://ui-avatars.com/api/?name=Demo+User&background=random',
                        is_pro: false,
                        joined_at: new Date().toISOString(),
                    }
                });
            },

            logout: () => set({ user: null }),

            upgradeToPro: async () => {
                set({ isLoading: true });
                // Simulate Payment Processing
                await new Promise(resolve => setTimeout(resolve, 2000));

                set((state) => ({
                    isLoading: false,
                    user: state.user ? { ...state.user, is_pro: true } : null
                }));
            },

            updateProfile: (data) => set((state) => ({
                user: state.user ? { ...state.user, ...data } : null
            })),
        }),
        {
            name: 'dopely-user-session', // Persist to localStorage
            partialize: (state) => ({ user: state.user }), // Only persist user object
        }
    )
);
