import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Read Life OS Plus's privacy policy to understand how we collect, use, and protect your personal information. Your privacy is our priority.",
    keywords: ["privacy policy", "data protection", "gdpr", "ccpa", "privacy", "data security"],
    openGraph: {
        title: "Privacy Policy | Life OS Plus",
        description: "Learn how Life OS Plus protects your privacy and handles your personal data.",
        url: 'https://lifeosplus.com/page/privacy',
        siteName: 'Life OS',
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'Privacy Policy | Life OS Plus',
        description: 'Learn how we protect your privacy and handle your data.',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function PrivacyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
