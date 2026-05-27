import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppProvider } from "@/core/providers/AppProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-family-01",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Infinityfy",
  description: "Infinityfy",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Infinityfy",
  },
  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/favicon-32x32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${poppins.variable} antialiased`}>
        <TooltipProvider>
          <AppProvider>{children}</AppProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
