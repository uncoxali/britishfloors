import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { showSuccess, showError } from '@/lib/utils/toast';
// import { signIn, signOut } from 'next-auth/react';

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
    checkLocalStorage: () => void;
    forceRefresh: () => void;
    setUserEmail: (email: string) => void;
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
                    // Use Shopify Storefront API for real authentication
                    const response = await fetch('/api/auth/shopify-login', {
                        method: 'PUT', // Use PUT for Storefront API login
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Login failed');
                    }

                    const responseData = await response.json();
                    const { user } = responseData;

                    if (!user) {
                        throw new Error('No user data received');
                    }

                    // Ensure email is preserved
                    const userWithEmail = {
                        ...user,
                        email: user.email || email // fallback to the login email if somehow missing
                    };

                    // Backup email to localStorage
                    if (typeof window !== 'undefined' && userWithEmail.email) {
                        localStorage.setItem('user-email-backup', userWithEmail.email);
                    }

                    set({ user: userWithEmail, isAuthenticated: true, isLoading: false });
                    showSuccess('Login successful!');
                } catch (error) {
                    set({ isLoading: false });
                    const errorMessage = error instanceof Error ? error.message : 'Login failed';
                    showError(errorMessage);
                    throw error;
                }
            },

            register: async (userData) => {
                set({ isLoading: true });
                try {
                    const requestData = {
                        email: userData.email,
                        password: userData.password,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        phone: userData.phone || '',
                    };

                    const response = await fetch('/api/auth/shopify-customer', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestData),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Registration failed');
                    }

                    const responseData = await response.json();
                    const { user } = responseData;
                    if (!user) {
                        throw new Error('No user data received');
                    }

                    // Ensure email is preserved during registration
                    const userWithEmail = {
                        ...user,
                        email: user.email || userData.email // fallback to the registration email if somehow missing
                    };

                    // Backup email to localStorage
                    if (typeof window !== 'undefined' && userWithEmail.email) {
                        localStorage.setItem('user-email-backup', userWithEmail.email);
                    }

                    set({ user: userWithEmail, isAuthenticated: true, isLoading: false });
                    showSuccess('Registration successful!');
                } catch (error) {
                    set({ isLoading: false });
                    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
                    showError(errorMessage);
                    throw error;
                }
            },

            logout: () => {
                // Clear email backup when logging out
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user-email-backup');
                }
                set({ user: null, isAuthenticated: false, isLoading: false });
                showSuccess('Logged out successfully');
            },

            updateProfile: (userData) => {
                const { user } = get();
                if (user) {
                    const updatedUser = { ...user, ...userData };

                    // Backup email if it's being updated
                    if (userData.email && typeof window !== 'undefined') {
                        localStorage.setItem('user-email-backup', userData.email);
                    }

                    set({ user: updatedUser });
                    showSuccess('Profile updated successfully');
                }
            },

            // Debug helper functions
            checkLocalStorage: () => {
                if (typeof window !== 'undefined') {
                    const stored = localStorage.getItem('auth-storage');
                    if (stored) {
                        try {
                            JSON.parse(stored);
                        } catch {
                            // Silent error handling
                        }
                    }
                }
            },

            forceRefresh: () => {
                const currentState = get();
                set({ ...currentState });
            },

            setUserEmail: (email: string) => {
                const { user } = get();
                if (user) {
                    const updatedUser = { ...user, email };
                    set({ user: updatedUser });
                    showSuccess('Email restored successfully');
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => {
                return {
                    user: state.user,
                    isAuthenticated: state.isAuthenticated
                };
            },
            onRehydrateStorage: () => (state) => {
                if (state?.user) {
                    // Check if email is missing and try to restore it from localStorage backup
                    if (!state.user.email && typeof window !== 'undefined') {
                        const emailBackup = localStorage.getItem('user-email-backup');
                        if (emailBackup) {
                            const updatedUser = { ...state.user, email: emailBackup };
                            // Force update the state with the restored email
                            setTimeout(() => {
                                const currentState = state;
                                if (currentState) {
                                    currentState.user = updatedUser;
                                }
                            }, 0);
                        }
                    }
                }
            },
            // Force immediate rehydration
            skipHydration: false,
        }
    )
); 