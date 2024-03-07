import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionContext from "@/components/context/SessionContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Steam On",
  description: "Steam Achievements List",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className+" min-h-screen"}>
        <SessionContext>
        {children}
        </SessionContext>
        </body>
    </html>
  );
}
