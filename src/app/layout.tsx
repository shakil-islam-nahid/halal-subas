import type { Metadata } from "next";
import { Hind_Siliguri, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";


const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Halal Subas | Premium Halal Ator",
  description:
    "Premium halal ator and fragrance products delivered across Bangladesh.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${manrope.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-stone-50 text-zinc-950">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CYD57T4YGZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CYD57T4YGZ');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
