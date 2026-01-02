/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  convexUserId: Id<"users"> | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn: convexSignIn, signOut: convexSignOut } = useAuthActions();

  const currentUser = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip",
  );

  const createUserProfile = useMutation(api.users.createProfile);

  // Derive user and convexUserId from currentUser or isAuthenticated
  const user = useMemo<AuthUser | null>(() => {
    if (currentUser) {
      return {
        id: currentUser._id,
        email: currentUser.email || "",
        name: currentUser.name,
      };
    }
    // If authenticated but no currentUser yet, return a placeholder
    if (isAuthenticated) {
      return {
        id: "loading",
        email: "",
        name: "User",
      };
    }
    return null;
  }, [currentUser, isAuthenticated]);

  const convexUserId = useMemo<Id<"users"> | null>(() => {
    return currentUser?._id ?? null;
  }, [currentUser]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("flow", "signIn");

        await convexSignIn("password", formData);
      } catch (error: unknown) {
        console.error("Sign in error:", error);
        const errMessage = error instanceof Error ? error.message : "";

        if (
          errMessage.includes("InvalidAccountId") ||
          errMessage.includes("invalid")
        ) {
          throw new Error(
            "No account found with this email. Please sign up first.",
          );
        }
        if (
          errMessage.includes("InvalidSecret") ||
          errMessage.includes("password")
        ) {
          throw new Error("Incorrect password. Please try again.");
        }

        throw new Error("Unable to sign in. Please check your credentials.");
      }
    },
    [convexSignIn],
  );

  const signUp = useCallback(
    async (email: string, password: string, name?: string) => {
      try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("flow", "signUp");
        if (name) {
          formData.append("name", name);
        }

        await convexSignIn("password", formData);

        // Create user profile after successful signup
        // Create user profile after successful signup
        setTimeout(async () => {
          try {
            await createUserProfile({
              name: name || email.split("@")[0],
              isParent: false,
              theme: "kawaii",
              yearlyBookGoal: 24,
              notifications: true,
            });
          } catch {
            // Profile may already exist - ignore silently
          }
        }, 500);
      } catch (error: unknown) {
        console.error("Sign up error:", error);
        const errMessage = error instanceof Error ? error.message : "";

        if (
          errMessage.includes("AccountAlreadyExists") ||
          errMessage.includes("already exists")
        ) {
          throw new Error(
            "An account with this email already exists. Please sign in instead.",
          );
        }
        if (errMessage.includes("weak") || errMessage.includes("password")) {
          throw new Error(
            "Password is too weak. Please use at least 8 characters.",
          );
        }

        throw new Error("Unable to create account. Please try again.");
      }
    },
    [convexSignIn, createUserProfile],
  );

  const signOut = useCallback(async () => {
    try {
      await convexSignOut();
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }, [convexSignOut]);

  // Derive loading state - only loading during initial auth check
  // Once isLoading is false, we're done loading regardless of currentUser
  const loading = isLoading;

  const value = {
    user,
    convexUserId,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
