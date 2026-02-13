import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
    metadataBase: new URL('https://lifeosplus.com'), // Replace with your actual domain
    title: {
        default: "Life OS | Gamified Life Management System",
        template: "%s | Life OS"
    },
    description: "Transform your life into a RPG. Track habits, manage finances, and achieve goals with a powerful gamified dashboard.",
    keywords: ["productivity", "gamification", "habit tracker", "life rpg", "dashboard", "finance tracker", "goal setting"],
    authors: [{ name: "Aryan Pandey" }], // Replace with actual author if needed
    creator: "Aryan Pandey",
    publisher: "Life OS Plus",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: "Life OS | Gamified Life Management System",
        description: "Level up your life. The ultimate dashboard for productivity, finance, and self-improvement.",
        url: 'https://lifeosplus.com',
        siteName: 'Life OS',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: '/og-image.png', // Ensure you add an og-image.png to public folder
                width: 1200,
                height: 630,
                alt: 'Life OS Dashboard Preview',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Life OS | Level Up Your Life',
        description: 'Transform your daily routine into an engaging RPG experience.',
        creator: '@pandeyaryan28', // Replace with your handle
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    manifest: "/manifest.json",
    icons: {
        icon: [
            { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-touch-icon.png' },
        ],
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Life OS',
    },
};

export const viewport: Viewport = {
    themeColor: "#0a0a0b",
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Life OS',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: 'A comprehensive gamified life management system tracking habits, finances, and goals.',
        author: {
            '@type': 'Person',
            name: 'Aryan Pandey'
        }
    };

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
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
