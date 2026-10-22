import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Guitar Salon International - Clone UI",
  description: "Ecommerce guitar UI with auth/profile flow.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className="min-h-full flex flex-col bg-[#f5f5f5] text-black"
        style={{ fontFamily: "Montserrat, Helvetica, Arial, sans-serif" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
