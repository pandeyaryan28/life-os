import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Life OS Plus",
    description: "Discover how Life OS Plus transforms your daily routine into an engaging RPG experience. Track habits, manage finances, and level up your life with our gamified productivity platform.",
    keywords: ["about life os", "gamified productivity", "life rpg", "habit tracking", "personal development", "productivity app"],
    openGraph: {
        title: "About Life OS Plus | Gamify Your Life",
        description: "Transform your life into a RPG. Learn about our mission to help you achieve your goals through gamification.",
        url: 'https://lifeosplus.com/page/about',
        siteName: 'Life OS',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Life OS Plus - About Us',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Life OS Plus',
        description: 'Discover how we help you level up your life through gamification.',
        images: ['/og-image.png'],
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
