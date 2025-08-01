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
  login,
  getCurrentUser,
  userLogout,
  LoginBody,
} from "@/services/api/auth";

// Type definition for the authentication context
type AuthContextType = {
  user: User | null | undefined;
  isAuthenticated: boolean;
  loginHandler: (credentials: LoginBody) => Promise<boolean>;
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
    mutateAsync,
    isError: isErrorLogin,
    isSuccess: isSuccessLogin,
    error: errorLogin,
    isPending: isLoginPending,
  } = useMutation({
    mutationFn: (credentials: LoginBody) => login(credentials),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  // Provide login function for UI
  const loginHandler = async (credentials: LoginBody): Promise<boolean> => {
    try {
      await mutateAsync(credentials);
      return true;
    } catch {
      return false;
    }
  };

  // Mutation for handling user logout
  const { mutateAsync: logoutMutate, isSuccess: isSuccessLogout } = useMutation(
    {
      mutationFn: userLogout,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
    }
  );

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
        user: user as User | null,
        loginHandler,
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
