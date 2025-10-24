// Main Layoutx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

// Automatic Injection - Next.js automatically injects this metadata into the <head> of every page in your app.
/**
<head>
  <title>Prostore</title>
  <meta name="description" content="A modern ecommerce platform built with Next.js">
</head>
 */
export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: `${APP_DESCRIPTION}`,
  metadataBase: new URL(SERVER_URL),
  // OPEN GRAPH TAGS - Social media previews
  openGraph: {
    title: "Prosotre",
    description: "Best Shopping platform",
    images: [
      {
        url: "/public/images/promo.jpg", // ← Auto becomes absolute!
        width: 1200,
        height: 630,
        alt: "Prostore Preview",
      },
    ],
    type: "website",
    siteName: "My Tech Store",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
