'use client';

import Link from 'next/link';
import { ArrowLeft, Target, Zap, Users, TrendingUp } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#050505] via-[#0a0a0b] to-[#050505]">
            {/* Header */}
            <header className="border-b border-white/5 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Dashboard</span>
                    </Link>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Life OS Plus
                    </h1>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-6 py-20 text-center">
                <div className="inline-block mb-6 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    <span className="text-cyan-400 text-sm font-medium">About Us</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent leading-tight">
                    Level Up Your Life
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    Life OS Plus transforms your daily routine into an engaging RPG experience.
                    Track habits, manage finances, and achieve your goals with a powerful gamified dashboard.
                </p>
            </section>

            {/* Mission Section */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-white/10 rounded-3xl p-12 backdrop-blur-sm">
                    <h3 className="text-3xl font-bold mb-6 text-white">Our Mission</h3>
                    <p className="text-lg text-gray-300 leading-relaxed mb-4">
                        We believe that personal growth should be engaging, rewarding, and fun. Life OS Plus
                        was created to help people transform their daily tasks and long-term goals into an
                        immersive game-like experience.
                    </p>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        By combining productivity tools with RPG mechanics, we make self-improvement
                        addictive in the best way possible. Every habit tracked, every goal achieved,
                        and every milestone reached helps you level up in the game of life.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <h3 className="text-3xl font-bold mb-12 text-center text-white">What Makes Us Different</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            icon: Target,
                            title: "Goal-Oriented",
                            description: "Set and track meaningful goals with our intuitive system",
                            color: "cyan"
                        },
                        {
                            icon: Zap,
                            title: "Gamified Experience",
                            description: "Earn XP, level up, and unlock achievements as you progress",
                            color: "blue"
                        },
                        {
                            icon: TrendingUp,
                            title: "Progress Tracking",
                            description: "Visualize your growth with detailed analytics and insights",
                            color: "purple"
                        },
                        {
                            icon: Users,
                            title: "Community Driven",
                            description: "Join a community of achievers on the same journey",
                            color: "pink"
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-600/10 border border-${feature.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Story Section */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/10 rounded-3xl p-12 backdrop-blur-sm">
                    <h3 className="text-3xl font-bold mb-6 text-white">Our Story</h3>
                    <p className="text-lg text-gray-300 leading-relaxed mb-4">
                        Life OS Plus was born from a simple observation: people love games, but often
                        struggle with productivity. What if we could combine the addictive nature of
                        gaming with the practical benefits of productivity tools?
                    </p>
                    <p className="text-lg text-gray-300 leading-relaxed mb-4">
                        Our founder, Aryan Pandey, experienced firsthand how gamification could transform
                        motivation and achievement. After years of development and refinement, Life OS Plus
                        emerged as a comprehensive platform that makes personal growth genuinely enjoyable.
                    </p>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        Today, we're helping thousands of users turn their lives into an epic adventure,
                        one quest at a time.
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-6xl mx-auto px-6 py-20 text-center">
                <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-12 backdrop-blur-sm">
                    <h3 className="text-4xl font-bold mb-6 text-white">Ready to Start Your Journey?</h3>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who are leveling up their lives with Life OS Plus.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
                    >
                        Get Started Now
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 mt-20">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm">
                            © 2026 Life OS Plus. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link href="/page/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                Privacy Policy
                            </Link>
                            <Link href="/page/terms" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                Terms & Conditions
                            </Link>
                            <Link href="/page/support" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                Support
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
