/**
 * Authentication Provider Component
 *
 * This component provides authentication context and functionality throughout the application.
 * It manages user authentication state, login/logout operations, and provides authentication
 * status to child components. Uses React Query for server state management and caching.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { User } from "@/types/user/index";

import {
  loginWithCredentials,
  userDoesLogout,
} from "@/lib/api/auth/userActions";
import { getCurrentUser } from "@/lib/api/auth/userActions";

// Type definition for the authentication context
type AuthContextType = {
  user: User | null | undefined;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoginPending: boolean;
  isErrorLogin: boolean;
  isSuccessLogin: boolean;
  isSuccessLogout: boolean;
};

// Create authentication context with undefined default value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Query to get current user information
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getCurrentUser,
    retry: false,
  });

  // Mutation for handling user login
  const {
    mutateAsync: loginMutate,
    isError: isErrorLogin,
    isSuccess: isSuccessLogin,
    error: errorLogin,
    isPending: isLoginPending,
  } = useMutation({
    mutationFn: loginWithCredentials,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  /**
   * Login function that handles user authentication
   *
   * @param credentials - User email and password
   * @returns Promise<boolean> - True if login successful, false otherwise
   */
  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      await loginMutate(credentials);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Mutation for handling user logout
  const {
    mutateAsync: logoutMutate,
    isError: isErrorLogout,
    isSuccess: isSuccessLogout,
    error: errorLogout,
  } = useMutation({
    mutationFn: userDoesLogout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  /**
   * Logout function that handles user sign out
   * Clears authentication state and invalidates user queries
   */
  const logout = async () => {
    await logoutMutate();
  };

  // Show loading state while fetching user data
  if (isLoading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoginPending,
        isErrorLogin,
        isSuccessLogin,
        isSuccessLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context
 * Must be used within an AuthProvider component
 *
 * @returns AuthContextType - Authentication context with user data and methods
 * @throws Error if used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
