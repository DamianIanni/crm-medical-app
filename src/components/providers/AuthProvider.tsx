"use client";

import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user/index";
import {
  login,
  getCurrentUser,
  userLogout,
  register,
  LoginBody,
  RegisterBody,
  acceptInvitation,
  rejectInvitation,
} from "@/services/api/auth";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { useRouter } from "next/navigation";
import { removeEntitySessionStorage } from "@/lib/utils";

// Type definition for the authentication context
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginBody) => Promise<boolean>;
  register: (data: RegisterBody) => Promise<boolean>;
  logout: () => Promise<void>;
  acceptInvitation: (center_id: string) => Promise<void>;
  rejectInvitation: (center_id: string) => Promise<void>;
  isLoginPending: boolean;
  isErrorLogin: boolean;
  isSuccessLogin: boolean;
  isRegisterPending: boolean;
  isErrorRegister: boolean;
  isSuccessRegister: boolean;
  isSuccessLogout: boolean;
  isAcceptInvitationPending: boolean;
  isRejectInvitationPending: boolean;
  isErrorAcceptInvitation: boolean;
  isErrorRejectInvitation: boolean;
  isSuccessAcceptInvitation: boolean;
  isSuccessRejectInvitation: boolean;
  isUserPending: boolean;
  isUserFetching: boolean;
  isErrorUser: boolean;
};

// Create authentication context with undefined default value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Query to get current user information
  const {
    data: user,
    isLoading,
    isError: isErrorUser,
    isPending: isUserPending,
    isFetching: isUserFetching,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Mutation for handling user login
  const {
    mutateAsync: loginMutate,
    isError: isErrorLogin,
    isSuccess: isSuccessLogin,
    isPending: isLoginPending,
  } = useMutation({
    mutationFn: (credentials: LoginBody) => login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const loginHandler = async (credentials: LoginBody): Promise<boolean> => {
    try {
      await loginMutate(credentials);
      return true;
    } catch {
      return false;
    }
  };

  // Mutation for handling user registration
  const {
    mutateAsync: registerMutate,
    isError: isErrorRegister,
    isSuccess: isSuccessRegister,
    isPending: isRegisterPending,
  } = useMutation({
    mutationFn: (data: RegisterBody) => register(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  const registerUser = async (data: RegisterBody): Promise<boolean> => {
    try {
      await registerMutate(data);
      return true;
    } catch {
      return false;
    }
  };

  // Mutation for handling user logout
  const router = useRouter();
  const { mutateAsync: logoutMutate, isSuccess: isSuccessLogout } = useMutation(
    {
      mutationFn: userLogout,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["me"] });
        removeEntitySessionStorage("selectedCenterId");
        removeEntitySessionStorage("selectedCenterName");
        removeEntitySessionStorage("dataEntityteam");
        removeEntitySessionStorage("dataEntitycenter");
        removeEntitySessionStorage("dataEntitypatient");
        router.replace("/login");
      },
    }
  );

  const logout = async () => {
    await logoutMutate();
  };

  const acceptInvitationHandler = async (center_id: string) => {
    await acceptInvitationMutate(center_id);
  };

  const rejectInvitationHandler = async (center_id: string) => {
    await rejectInvitationMutate(center_id);
  };

  const invalidate = useInvalidateQuery(["allCenters"]);

  const {
    mutateAsync: acceptInvitationMutate,
    isError: isErrorAcceptInvitation,
    isSuccess: isSuccessAcceptInvitation,
    isPending: isAcceptInvitationPending,
  } = useMutation({
    mutationFn: (center_id: string) => acceptInvitation(center_id),
    onSuccess: () => invalidate(),
  });

  const {
    mutateAsync: rejectInvitationMutate,
    isError: isErrorRejectInvitation,
    isSuccess: isSuccessRejectInvitation,
    isPending: isRejectInvitationPending,
  } = useMutation({
    mutationFn: (center_id: string) => rejectInvitation(center_id),
    onSuccess: () => {
      invalidate();
      router.replace("/centers");
    },
  });

  // Show loading state while fetching user data
  if (isLoading) return null;

  return (
    <AuthContext.Provider
      value={{
        //User
        user: user as User | null,
        isUserPending,
        isUserFetching,
        isErrorUser,
        //login
        login: loginHandler,
        register: registerUser,
        logout,
        isAuthenticated: !!user,
        isLoginPending,
        isErrorLogin,
        isSuccessLogin,
        //Register
        isRegisterPending,
        isErrorRegister,
        isSuccessRegister,
        //Logout
        isSuccessLogout,
        //Invitation
        acceptInvitation: acceptInvitationHandler,
        rejectInvitation: rejectInvitationHandler,
        isAcceptInvitationPending,
        isRejectInvitationPending,
        isErrorAcceptInvitation,
        isErrorRejectInvitation,
        isSuccessAcceptInvitation,
        isSuccessRejectInvitation,
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
