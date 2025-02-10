import type { Metadata } from "next";
import "./globals.css";
import { varelaRound } from "@/app/ui/fonts";
import Providers from "./store/Provider";

export const metadata: Metadata = {
  title: "UStudy",
  description: "UStudy app",
  icons: {
    icon: "/UStudyIcon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${varelaRound.className} antialiased bg-background`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
