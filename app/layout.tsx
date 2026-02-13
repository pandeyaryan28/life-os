import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Life OS",
    description: "Gamified Life Management System",
    manifest: "/manifest.json",
    icons: {
        icon: "/icon-192.png",
        apple: "/apple-touch-icon.png",
    },
};

export const viewport: Viewport = {
    themeColor: "#0a0a0b",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                {/* Resource Hints */}
                <link rel="preconnect" href="https://firebase.googleapis.com" />
                <link rel="preconnect" href="https://apis.google.com" />
                <link rel="preconnect" href="https://checkout.razorpay.com" />
                <link rel="dns-prefetch" href="https://firebaseinstallations.googleapis.com" />
                <link rel="dns-prefetch" href="https://life-os-1e607.firebaseapp.com" />
                <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
