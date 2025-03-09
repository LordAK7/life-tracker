import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Tracker",
  description: "Organize your life with elegance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
