import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Database, Lock, Eye, UserCheck, Cookie, FileText } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
    useEffect(() => {
        document.title = 'Privacy Policy — LIFE OS';
        let meta = document.querySelector('meta[name="description"]');
        if (meta) {
            meta.setAttribute('content', 'LIFE OS Privacy Policy. Learn how we collect, use, and protect your data.');
        }
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = window.location.origin + '/privacy';
        return () => {
            document.title = 'LIFE OS — Gamified Life Management';
        };
    }, []);

    const sections = [
        {
            icon: <Database size={16} className="text-cyan-400" />,
            iconBg: 'bg-cyan-500/10 border-cyan-500/20',
            title: '1. Information Collected',
            content: (
                <div className="space-y-3">
                    <p className="text-sm text-gray-300 leading-relaxed">We collect the following categories of information:</p>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                            <span className="text-cyan-500 mt-1">•</span>
                            <span><strong className="text-gray-300">Account Information</strong> — Email address and display name provided during registration.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-cyan-500 mt-1">•</span>
                            <span><strong className="text-gray-300">User-Generated Data</strong> — Quests, goals, expenses, and other content you create within the platform.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-cyan-500 mt-1">•</span>
                            <span><strong className="text-gray-300">Usage Analytics</strong> — Basic usage patterns for system improvement, if analytics are enabled.</span>
                        </li>
                    </ul>
                    <div className="bg-green-500/5 border border-green-500/15 rounded-lg p-3 mt-3">
                        <p className="text-xs text-green-400 font-medium">We do not sell, trade, or rent your personal data to any third parties.</p>
                    </div>
                </div>
            ),
        },
        {
            icon: <Lock size={16} className="text-purple-400" />,
            iconBg: 'bg-purple-500/10 border-purple-500/20',
            title: '2. How Data Is Stored',
            content: (
                <div className="space-y-3">
                    <p className="text-sm text-gray-300 leading-relaxed">Your data is stored using industry-standard secure infrastructure:</p>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span><strong className="text-gray-300">Firebase Authentication</strong> — Handles identity management and secure sign-in.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span><strong className="text-gray-300">Cloud Firestore</strong> — Stores user-generated data with real-time synchronization.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span><strong className="text-gray-300">Secure Cloud Infrastructure</strong> — All data is hosted on Google Cloud Platform with enterprise-grade security.</span>
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            icon: <Eye size={16} className="text-blue-400" />,
            iconBg: 'bg-blue-500/10 border-blue-500/20',
            title: '3. Data Usage',
            content: (
                <div className="space-y-3">
                    <p className="text-sm text-gray-300 leading-relaxed">We use your data solely for the following purposes:</p>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>Providing core service functionality (quests, goals, economy tracking).</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>Improving system performance and user experience.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>Debugging and analytics to maintain service reliability (if enabled).</span>
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            icon: <Shield size={16} className="text-green-400" />,
            iconBg: 'bg-green-500/10 border-green-500/20',
            title: '4. Data Security',
            content: (
                <div className="space-y-3">
                    <p className="text-sm text-gray-300 leading-relaxed">We implement the following security measures:</p>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span><strong className="text-gray-300">Authentication-Based Access Rules</strong> — All data access is controlled through Firebase Security Rules.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span><strong className="text-gray-300">User Data Isolation</strong> — Each user can only access their own data. Cross-user data access is not possible.</span>
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            icon: <UserCheck size={16} className="text-yellow-400" />,
            iconBg: 'bg-yellow-500/10 border-yellow-500/20',
            title: '5. User Rights',
            content: (
                <div className="space-y-3">
                    <p className="text-sm text-gray-300 leading-relaxed">You have the following rights regarding your data:</p>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span><strong className="text-gray-300">Request Deletion</strong> — You may request complete deletion of your account and associated data.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span><strong className="text-gray-300">Request Data Export</strong> — You may request an export of your personal data.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span><strong className="text-gray-300">Modify Profile Information</strong> — You can update your display name and profile details at any time.</span>
                        </li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">
                        To exercise any of these rights, contact{' '}
                        <a href="mailto:hello@lifeosplus.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                            hello@lifeosplus.com
                        </a>.
                    </p>
                </div>
            ),
        },
        {
            icon: <Cookie size={16} className="text-orange-400" />,
            iconBg: 'bg-orange-500/10 border-orange-500/20',
            title: '6. Cookies & Local Storage',
            content: (
                <div className="space-y-3">
                    <p className="text-sm text-gray-300 leading-relaxed">
                        LIFE OS uses minimal cookies and local storage, limited to:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            <span><strong className="text-gray-300">Session Persistence</strong> — Maintaining your authenticated session across page reloads.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            <span><strong className="text-gray-300">Performance Optimization</strong> — Caching assets locally for faster load times.</span>
                        </li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">
                        No third-party tracking cookies are used.
                    </p>
                </div>
            ),
        },
        {
            icon: <FileText size={16} className="text-gray-400" />,
            iconBg: 'bg-gray-500/10 border-gray-500/20',
            title: '7. Changes to This Policy',
            content: (
                <div className="space-y-3">
                    <p className="text-sm text-gray-300 leading-relaxed">
                        We may update this Privacy Policy from time to time. Changes will be versioned and the date of the
                        last update will be displayed at the top of this page. Continued use of LIFE OS after changes
                        constitutes acceptance of the updated policy.
                    </p>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 md:py-16">
                {/* Back Navigation */}
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-cyan-400 transition-colors uppercase tracking-widest mb-8"
                >
                    <ArrowLeft size={14} />
                    Back to Login
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center">
                            <Lock className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight font-mono">
                                LIFE <span className="text-cyan-500">OS</span> <span className="text-white/40 font-normal text-lg">Privacy Policy</span>
                            </h1>
                        </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-purple-500/30 via-white/10 to-transparent mb-4" />
                    <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                        <span>Last Updated: <strong className="text-gray-400">v1.7.5</strong></span>
                        <span className="text-white/10">|</span>
                        <span>Effective: February 2026</span>
                    </div>
                </div>

                {/* Intro */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 md:p-6 mb-10">
                    <p className="text-sm text-gray-300 leading-relaxed">
                        This Privacy Policy describes how LIFE OS ("we", "us", or "our") collects, uses, and protects
                        your information when you use our gamified life management platform. By using LIFE OS, you agree
                        to the collection and use of information in accordance with this policy.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <section key={index} id={`privacy-section-${index + 1}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-8 h-8 ${section.iconBg} border rounded-md flex items-center justify-center`}>
                                    {section.icon}
                                </div>
                                <h2 className="text-lg font-bold font-mono uppercase tracking-wider">{section.title}</h2>
                            </div>
                            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 md:p-6">
                                {section.content}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer */}
                <footer className="mt-16 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                    <div className="flex items-center gap-4">
                        <Link to="/support" className="hover:text-cyan-400 transition-colors">Support</Link>
                        <span className="text-white/10">|</span>
                        <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
                    </div>
                    <span>LIFE OS v1.7.5</span>
                </footer>
            </div>
        </div>
    );
};
