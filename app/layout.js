import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.scss";
import Footer from "@/components/SSG/Footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "bakushin's portfolio",
  description: "bakushin's portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* index メタタグ（デフォルト設定） */}
        <meta name="robots" content="index, follow" />

        {/* ファビコン関連 */}
        <link rel="icon" type="image/webp" sizes="64x62" href="/favicon.webp" />
        <meta name="theme-color" content="#ffffff" />

        {/* OGP・Twitterカード */}
        <meta property="og:title" content="bakushin's portfolio" />
        <meta property="og:description" content="bakushin's portfolio" />
        <meta property="og:image" content="/OGP.webp" />
        <meta property="og:url" content="https://bakushin.blog" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
      <Footer />
    </html>
  );
}
