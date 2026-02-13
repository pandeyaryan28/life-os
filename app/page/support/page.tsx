'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, MessageCircle, Book, HelpCircle, Send } from 'lucide-react';
import { useState } from 'react';

export default function SupportPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission - integrate with your backend
        console.log('Support request:', formData);
        alert('Thank you for contacting us! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

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
                    <span className="text-cyan-400 text-sm font-medium">Support Center</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent leading-tight">
                    How Can We Help?
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    Get answers to your questions, report issues, or reach out to our support team.
                </p>
            </section>

            {/* Quick Help Cards */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {[
                        {
                            icon: Book,
                            title: "Documentation",
                            description: "Browse our comprehensive guides and tutorials",
                            link: "#faq",
                            color: "cyan"
                        },
                        {
                            icon: MessageCircle,
                            title: "Contact Support",
                            description: "Get in touch with our support team",
                            link: "#contact",
                            color: "blue"
                        },
                        {
                            icon: Mail,
                            title: "Email Us",
                            description: "support@lifeosplus.com",
                            link: "mailto:support@lifeosplus.com",
                            color: "purple"
                        }
                    ].map((card, index) => (
                        <a
                            key={index}
                            href={card.link}
                            className="group bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105 block"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${card.color}-500/20 to-${card.color}-600/10 border border-${card.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <card.icon className={`w-6 h-6 text-${card.color}-400`} />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
                        </a>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="max-w-4xl mx-auto px-6 py-16">
                <h3 className="text-3xl font-bold mb-12 text-center text-white">Frequently Asked Questions</h3>
                <div className="space-y-4">
                    {[
                        {
                            question: "How do I get started with Life OS Plus?",
                            answer: "Simply sign up with your email or Google account, complete the onboarding process, and start tracking your habits and goals. The dashboard will guide you through the initial setup."
                        },
                        {
                            question: "Is Life OS Plus free to use?",
                            answer: "Life OS Plus offers both free and premium tiers. The free version includes core features like habit tracking and basic analytics. Premium users get access to advanced features, unlimited goals, and detailed insights."
                        },
                        {
                            question: "How does the XP and leveling system work?",
                            answer: "You earn XP by completing tasks, maintaining streaks, and achieving goals. As you accumulate XP, you level up and unlock new features, achievements, and customization options."
                        },
                        {
                            question: "Can I sync my data across devices?",
                            answer: "Yes! Your data is automatically synced across all your devices when you're logged in. Access your dashboard from any device with an internet connection."
                        },
                        {
                            question: "How do I reset my password?",
                            answer: "Click on 'Forgot Password' on the login screen and follow the instructions sent to your email. If you're using Google authentication, you'll need to reset your Google account password."
                        },
                        {
                            question: "Can I export my data?",
                            answer: "Premium users can export their data in CSV or JSON format from the Settings page. This includes all your habits, goals, and progress history."
                        }
                    ].map((faq, index) => (
                        <details
                            key={index}
                            className="group bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-cyan-500/20 transition-all"
                        >
                            <summary className="flex items-center gap-3 cursor-pointer text-white font-medium">
                                <HelpCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                                <span>{faq.question}</span>
                            </summary>
                            <p className="mt-4 ml-8 text-gray-400 leading-relaxed">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </section>

            {/* Contact Form */}
            <section id="contact" className="max-w-4xl mx-auto px-6 py-16">
                <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-white/10 rounded-3xl p-12 backdrop-blur-sm">
                    <h3 className="text-3xl font-bold mb-6 text-white text-center">Send Us a Message</h3>
                    <p className="text-gray-400 text-center mb-8">
                        Can't find what you're looking for? Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                id="subject"
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                placeholder="How can we help?"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                required
                                rows={6}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                                placeholder="Tell us more about your question or issue..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.02]"
                        >
                            <Send className="w-5 h-5" />
                            Send Message
                        </button>
                    </form>
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
                            <Link href="/page/about" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                About
                            </Link>
                            <Link href="/page/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                Privacy Policy
                            </Link>
                            <Link href="/page/terms" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                Terms & Conditions
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
