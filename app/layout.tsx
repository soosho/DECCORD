import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { ClerkThemeProvider } from "@/components/ClerkThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkThemeProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkThemeProvider>
  );
}
