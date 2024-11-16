import type { Metadata } from "next";
import "./globals.css";
import { roboto } from "@/app/ui/fonts";

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
      <body className={`${roboto.className} antialiased`}>{children}</body>
    </html>
  );
}
