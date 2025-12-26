import "./globals.css";
import { ReactNode } from "react";
import { cookies } from "next/headers";
import Providers from "./providers";
import Header from "@/components/Header";

export const metadata = {
  title: "Niece's World | My Reading Adventures",
  description: "A magical space to collect books and art",
  openGraph: {
    title: "Niece's World | My Reading Adventures",
    description: "A magical space to collect books and art",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("elise_session")?.value ?? null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white">
        <Providers initialToken={token}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
