import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
export const metadata: Metadata = {
  title: "সাইন আপ | বাজার দর",
  description:
    "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে। বিনা খরচে অ্যাকাউন্ট তৈরি করুন।",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: { borderRadius: "14px", fontFamily: "inherit" },
          }}
        />
      </body>
    </html>
  );
}
