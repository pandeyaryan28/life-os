import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Support",
    description: "Get help with Life OS Plus. Find answers to common questions, contact our support team, and access helpful resources.",
    keywords: ["support", "help", "contact", "faq", "customer service", "life os support"],
    openGraph: {
        title: "Support | Life OS Plus",
        description: "Need help? Our support team is here to assist you with any questions about Life OS Plus.",
        url: 'https://lifeosplus.com/page/support',
        siteName: 'Life OS',
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'Support | Life OS Plus',
        description: 'Get help with Life OS Plus. Contact our support team.',
    },
};

export default function SupportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
