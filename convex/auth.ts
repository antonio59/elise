import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import type { DataModel } from "./_generated/dataModel";

// Only these emails can sign up / sign in
const ALLOWED_EMAILS = [
  "elise@elisereads.com",
  "antonio.smith@gmail.com", // Antonio (admin/parent)
];

const CustomPassword = Password<DataModel>({
  profile(params) {
    const email = (params.email as string).toLowerCase().trim();
    if (!ALLOWED_EMAILS.includes(email)) {
      throw new Error(
        JSON.stringify({
          error: "Access denied. This site is invite-only.",
          code: "EMAIL_NOT_ALLOWED",
        }),
      );
    }
    return {
      email,
      name: (params.name as string) || email.split("@")[0],
    };
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [CustomPassword],
});
