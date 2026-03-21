/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useCallback, useEffect } from "react";
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
  // Store pending signup name so we can create the profile once auth is ready
}

// Store signup name outside of state to avoid re-render loops
let pendingSignupName: string | undefined;

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn: convexSignIn, signOut: convexSignOut } = useAuthActions();

  const currentUser = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip",
  );

  const createUserProfile = useMutation(api.users.createProfile);

  // Fix #1: Properly gate loading — wait for currentUser to resolve after auth.
  // We check !currentUser (not === undefined) because auth.getUserId can return
  // null briefly right after sign-in before the session propagates, causing
  // getCurrentUser to return null even though isAuthenticated is true.
  // Treating that null as "still loading" prevents the redirect loop.
  const loading = isLoading || (isAuthenticated && !currentUser);

  // Fix #3: Replace setTimeout with an effect that fires once auth + user ID are ready
  useEffect(() => {
    if (isAuthenticated && currentUser && pendingSignupName !== undefined) {
      const nameToUse = pendingSignupName || currentUser.email?.split("@")[0] || "User";
      pendingSignupName = undefined; // Clear immediately to prevent double-calls

      createUserProfile({
        name: nameToUse,
        isParent: false,
        theme: "kawaii",
        yearlyBookGoal: 24,
        notifications: true,
      }).catch(() => {
        // Profile may already exist — ignore silently
      });
    }
  }, [isAuthenticated, currentUser, createUserProfile]);

  // Fix #2: No more placeholder user — return null while data is still loading
  const user = useMemo<AuthUser | null>(() => {
    if (currentUser) {
      return {
        id: currentUser._id,
        email: currentUser.email || "",
        name: currentUser.name,
      };
    }
    return null;
  }, [currentUser]);

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

        console.log("[AUTH DEBUG] convexSignIn type:", typeof convexSignIn);
        const result = await convexSignIn("password", formData);
        console.log("[AUTH DEBUG] convexSignIn result:", result);
      } catch (error: unknown) {
        console.error("[AUTH DEBUG] convexSignIn threw:", error);
        const errMessage = error instanceof Error ? error.message : "";

        if (errMessage.includes("InvalidAccountId")) {
          throw new Error("No account found with this email. Please sign up first.", { cause: error });
        }
        if (errMessage.includes("InvalidSecret")) {
          throw new Error("Incorrect password. Please try again.", { cause: error });
        }

        throw new Error("Unable to sign in. Please check your credentials.", { cause: error });
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

        // Fix #3: Store name so the useEffect above can create the profile
        // once the Convex session is fully established
        pendingSignupName = name || email.split("@")[0];

        await convexSignIn("password", formData);
      } catch (error: unknown) {
        pendingSignupName = undefined; // Clear on failure

        // Fix #5: More specific error matching
        const errMessage = error instanceof Error ? error.message : "";

        if (errMessage.includes("AccountAlreadyExists")) {
          throw new Error("An account with this email already exists. Please sign in instead.", { cause: error });
        }
        if (errMessage.includes("WeakPassword")) {
          throw new Error("Password is too weak. Please use at least 8 characters.", { cause: error });
        }

        throw new Error("Unable to create account. Please try again.", { cause: error });
      }
    },
    [convexSignIn],
  );

  const signOut = useCallback(async () => {
    try {
      await convexSignOut();
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }, [convexSignOut]);

  const value = {
    user,
    convexUserId,
    loading,
    signIn,
    signUp,
    signOut,
  };

  // Fix #4: Removed stray console.log

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
