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
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KHZZ5D9C"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KHZZ5D9C');
          `}
        </Script>

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
