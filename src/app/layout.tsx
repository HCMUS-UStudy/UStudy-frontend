import type { Metadata } from "next";
import "./globals.css";
import { nunito } from "@/app/ui/fonts";
import Providers from "./store/Provider";
import ToastProvider from "./_provider/ToastProvider";
import QueryClientProviders from "./_provider/QueryClientProviders";
import ChatProvider from "./_provider/ChatProvider";
import InitDataProvider from "./_provider/InitDataProvider";

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
      <body className={`${nunito.className} antialiased bg-background`}>
        <Providers>
          <QueryClientProviders>
            <InitDataProvider>
              <ChatProvider>
                <ToastProvider>{children}</ToastProvider>
              </ChatProvider>
            </InitDataProvider>
          </QueryClientProviders>
        </Providers>
      </body>
    </html>
  );
}
