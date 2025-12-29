import React, { createContext, useContext, useEffect, useState } from "react";
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn: convexSignIn, signOut: convexSignOut } = useAuthActions();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [convexUserId, setConvexUserId] = useState<Id<"users"> | null>(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const currentUser = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip",
  );

  const createUserProfile = useMutation(api.users.createProfile);

  useEffect(() => {
    if (!isLoading) {
      setInitialCheckDone(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (currentUser) {
      setUser({
        id: currentUser._id,
        email: currentUser.email || "",
        name: currentUser.name,
      });
      setConvexUserId(currentUser._id);
    } else if (!isAuthenticated && !isLoading) {
      setUser(null);
      setConvexUserId(null);
    }
  }, [currentUser, isAuthenticated, isLoading]);

  const signIn = async (email: string, password: string) => {
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
  };

  const signUp = async (email: string, password: string, name?: string) => {
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
          console.log("Profile may already exist");
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
  };

  const signOut = async () => {
    try {
      await convexSignOut();
      setUser(null);
      setConvexUserId(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const loading =
    !initialCheckDone ||
    isLoading ||
    (isAuthenticated && currentUser === undefined);

  const value = {
    user,
    convexUserId,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
