import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Bug, AlertTriangle, HelpCircle, ArrowLeft, Shield } from 'lucide-react';

export const SupportPage: React.FC = () => {
    useEffect(() => {
        document.title = 'Support — LIFE OS';
        // Allow scrolling on this standalone page (body has overflow:hidden globally)
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        // Set meta description
        let meta = document.querySelector('meta[name="description"]');
        if (meta) {
            meta.setAttribute('content', 'Get help with LIFE OS. Contact support, report bugs, and learn about account management.');
        }
        // Set canonical
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = window.location.origin + '/support';
        return () => {
            document.title = 'LIFE OS — Gamified Life Management';
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, []);

    return (
        <div className="fixed inset-0 overflow-y-auto bg-[#050505] text-white selection:bg-cyan-500/30 z-50">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
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
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight font-mono">
                                LIFE <span className="text-cyan-500">OS</span> <span className="text-white/40 font-normal text-lg">Support</span>
                            </h1>
                        </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-cyan-500/30 via-white/10 to-transparent" />
                </div>

                {/* SECTION: Contact */}
                <section className="mb-10" id="support-contact">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/20 rounded-md flex items-center justify-center">
                            <Mail size={16} className="text-cyan-400" />
                        </div>
                        <h2 className="text-lg font-bold font-mono uppercase tracking-wider">Contact Support</h2>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 md:p-6 space-y-4">
                        <div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                For any questions, issues, or feedback, reach out to our support team via email.
                            </p>
                        </div>
                        <div className="bg-cyan-500/5 border border-cyan-500/15 rounded-lg p-4">
                            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Primary Support Email</p>
                            <a href="mailto:hello@lifeosplus.com" className="text-cyan-400 font-mono text-sm hover:text-cyan-300 transition-colors">
                                hello@lifeosplus.com
                            </a>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            We aim to respond to all inquiries within <strong className="text-gray-400">24–72 hours</strong>. Response times may vary during weekends and holidays.
                        </p>
                    </div>
                </section>

                {/* SECTION: Bug Reporting */}
                <section className="mb-10" id="support-bugs">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/20 rounded-md flex items-center justify-center">
                            <Bug size={16} className="text-orange-400" />
                        </div>
                        <h2 className="text-lg font-bold font-mono uppercase tracking-wider">Bug Reporting</h2>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 md:p-6">
                        <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                            If you encounter a bug or unexpected behavior, please help us improve by reporting it with the following details:
                        </p>
                        <ol className="space-y-3">
                            {[
                                { step: '1', label: 'Describe the issue', detail: 'Explain what happened and what you expected to happen.' },
                                { step: '2', label: 'Include device & browser', detail: 'e.g., iPhone 15 / Safari, Windows 11 / Chrome 120.' },
                                { step: '3', label: 'Attach screenshots', detail: 'Visual evidence helps us identify and reproduce the issue faster.' },
                                { step: '4', label: 'Include timestamp', detail: 'Note the approximate date and time (with timezone) when the issue occurred.' },
                            ].map((item) => (
                                <li key={item.step} className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-orange-500/10 border border-orange-500/20 rounded-md flex items-center justify-center text-[10px] font-mono font-bold text-orange-400">
                                        {item.step}
                                    </span>
                                    <div>
                                        <p className="text-sm text-white font-semibold">{item.label}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                        <div className="mt-5 pt-4 border-t border-white/5">
                            <p className="text-xs text-gray-500">
                                Send bug reports to{' '}
                                <a href="mailto:hello@lifeosplus.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                                    hello@lifeosplus.com
                                </a>{' '}
                                with the subject line: <span className="font-mono text-gray-400">[BUG REPORT]</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION: Beta Disclaimer */}
                <section className="mb-10" id="support-beta">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-yellow-500/10 border border-yellow-500/20 rounded-md flex items-center justify-center">
                            <AlertTriangle size={16} className="text-yellow-400" />
                        </div>
                        <h2 className="text-lg font-bold font-mono uppercase tracking-wider">Beta Disclaimer</h2>
                    </div>
                    <div className="bg-yellow-500/[0.03] border border-yellow-500/10 rounded-xl p-5 md:p-6 space-y-3">
                        <p className="text-sm text-gray-300 leading-relaxed">
                            LIFE OS is currently in <strong className="text-yellow-400">beta</strong>. This means:
                        </p>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-500 mt-1">•</span>
                                Features may change, be modified, or be removed without prior notice.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-500 mt-1">•</span>
                                Data integrity is prioritized but cannot be guaranteed during the beta period.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-500 mt-1">•</span>
                                You may experience occasional service interruptions or unexpected behavior.
                            </li>
                        </ul>
                        <p className="text-xs text-gray-500 pt-2">
                            We appreciate your patience and feedback as we work toward a stable release.
                        </p>
                    </div>
                </section>

                {/* SECTION: Account Help */}
                <section className="mb-10" id="support-account">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-md flex items-center justify-center">
                            <HelpCircle size={16} className="text-purple-400" />
                        </div>
                        <h2 className="text-lg font-bold font-mono uppercase tracking-wider">Account Help</h2>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 md:p-6 space-y-5">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-2">Password Reset</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                If you signed up with email and password, you can reset your password through Firebase Authentication.
                                Use the "Forgot Password" option on the login screen to receive a reset link via email.
                            </p>
                        </div>
                        <div className="h-px bg-white/5" />
                        <div>
                            <h3 className="text-sm font-bold text-white mb-2">Account Deletion</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                To request account deletion, please contact our support team at{' '}
                                <a href="mailto:hello@lifeosplus.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                                    hello@lifeosplus.com
                                </a>{' '}
                                with the subject line: <span className="font-mono text-gray-300">[ACCOUNT DELETION]</span>.
                                Include the email address associated with your account. We will process your request and confirm deletion
                                within 7 business days.
                            </p>
                        </div>
                    </div>
                </section>

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
