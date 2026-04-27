import { ThemeProvider } from "@/components/providers/theme-provider";
import { ContainerProvider } from "@/components/shared/container-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "@/redux/provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spenditor",
  description: "Spenditor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ContainerProvider>
            <SidebarProvider>
              <TooltipProvider>
                <ClerkProvider>
                  <Providers>
                    {children}
                  </Providers>
                </ClerkProvider>
              </TooltipProvider>
            </SidebarProvider>
          </ContainerProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
