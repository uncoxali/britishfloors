import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signIn, signOut } from 'next-auth/react';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
    logout: () => void;
    updateProfile: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email: string, password: string) => {
                set({ isLoading: true });
                try {
                    const result = await signIn('credentials', {
                        email,
                        password,
                        redirect: false,
                    });

                    if (result?.error) {
                        throw new Error(result.error);
                    }

                    // Get user data from session
                    const response = await fetch('/api/auth/validate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        set({ user: userData, isAuthenticated: true, isLoading: false });
                    } else {
                        throw new Error('Invalid credentials');
                    }
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            register: async (userData) => {
                set({ isLoading: true });
                try {
                    const response = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: userData.email,
                            password: userData.password,
                            firstName: userData.firstName,
                            lastName: userData.lastName,
                        }),
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Registration failed');
                    }

                    const { user } = await response.json();
                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: async () => {
                await signOut({ redirect: false });
                set({ user: null, isAuthenticated: false });
            },

            updateProfile: (userData) => {
                const { user } = get();
                if (user) {
                    set({ user: { ...user, ...userData } });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
); 