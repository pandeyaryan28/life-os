'use client';

import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
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
            <section className="max-w-4xl mx-auto px-6 py-20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/20 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                        Privacy Policy
                    </h2>
                </div>
                <p className="text-gray-400 text-lg mb-4">
                    Last Updated: February 13, 2026
                </p>
                <p className="text-gray-300 leading-relaxed">
                    At Life OS Plus, we take your privacy seriously. This Privacy Policy explains how we collect,
                    use, disclose, and safeguard your information when you use our application.
                </p>
            </section>

            {/* Content */}
            <section className="max-w-4xl mx-auto px-6 pb-20">
                <div className="prose prose-invert prose-cyan max-w-none space-y-12">

                    {/* Section 1 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h3>
                        <div className="space-y-4 text-gray-300">
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-2">Personal Information</h4>
                                <p className="leading-relaxed">
                                    When you create an account, we collect information such as your name, email address,
                                    and profile picture (if provided through Google authentication). We also collect any
                                    information you voluntarily provide when customizing your profile.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-2">Usage Data</h4>
                                <p className="leading-relaxed">
                                    We automatically collect information about your interactions with the app, including
                                    habits tracked, goals set, tasks completed, and progress metrics. This data helps us
                                    provide personalized insights and improve your experience.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-2">Device Information</h4>
                                <p className="leading-relaxed">
                                    We may collect information about the device you use to access Life OS Plus, including
                                    device type, operating system, browser type, and IP address for security and analytics purposes.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">We use the information we collect to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Personalize your experience and provide customized content</li>
                                <li>Track your progress and generate insights</li>
                                <li>Send you updates, notifications, and promotional materials (with your consent)</li>
                                <li>Respond to your inquiries and provide customer support</li>
                                <li>Detect, prevent, and address technical issues and security threats</li>
                                <li>Analyze usage patterns to improve our application</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">3. Information Sharing and Disclosure</h3>
                        <div className="space-y-4 text-gray-300">
                            <p className="leading-relaxed">
                                We do not sell, trade, or rent your personal information to third parties. We may share
                                your information only in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong className="text-white">Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our application (e.g., Firebase, Google Analytics, Razorpay for payments)</li>
                                <li><strong className="text-white">Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests</li>
                                <li><strong className="text-white">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity</li>
                                <li><strong className="text-white">With Your Consent:</strong> We may share information with your explicit consent for specific purposes</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 4 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">4. Data Security</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                We implement industry-standard security measures to protect your personal information, including:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Encryption of data in transit and at rest</li>
                                <li>Secure authentication through Firebase Authentication</li>
                                <li>Regular security audits and updates</li>
                                <li>Access controls and monitoring</li>
                            </ul>
                            <p className="leading-relaxed mt-4">
                                However, no method of transmission over the internet is 100% secure. While we strive to
                                protect your information, we cannot guarantee absolute security.
                            </p>
                        </div>
                    </div>

                    {/* Section 5 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">5. Your Rights and Choices</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">You have the following rights regarding your personal information:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong className="text-white">Access:</strong> Request a copy of the personal information we hold about you</li>
                                <li><strong className="text-white">Correction:</strong> Request correction of inaccurate or incomplete information</li>
                                <li><strong className="text-white">Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                                <li><strong className="text-white">Data Portability:</strong> Request a copy of your data in a machine-readable format</li>
                                <li><strong className="text-white">Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                                <li><strong className="text-white">Withdraw Consent:</strong> Withdraw consent for data processing where applicable</li>
                            </ul>
                            <p className="leading-relaxed mt-4">
                                To exercise these rights, please contact us at <a href="mailto:privacy@lifeosplus.com" className="text-cyan-400 hover:text-cyan-300">privacy@lifeosplus.com</a>.
                            </p>
                        </div>
                    </div>

                    {/* Section 6 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">6. Data Retention</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                We retain your personal information for as long as necessary to provide our services and
                                fulfill the purposes outlined in this Privacy Policy. When you delete your account, we will
                                delete or anonymize your personal information within 30 days, except where we are required
                                to retain it for legal or regulatory purposes.
                            </p>
                        </div>
                    </div>

                    {/* Section 7 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">7. Children's Privacy</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                Life OS Plus is not intended for children under the age of 13. We do not knowingly collect
                                personal information from children under 13. If you believe we have collected information
                                from a child under 13, please contact us immediately.
                            </p>
                        </div>
                    </div>

                    {/* Section 8 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">8. International Data Transfers</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                Your information may be transferred to and processed in countries other than your country
                                of residence. These countries may have different data protection laws. By using Life OS Plus,
                                you consent to the transfer of your information to these countries.
                            </p>
                        </div>
                    </div>

                    {/* Section 9 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">9. Cookies and Tracking Technologies</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                We use cookies and similar tracking technologies to enhance your experience, analyze usage,
                                and deliver personalized content. You can control cookies through your browser settings,
                                but disabling cookies may affect the functionality of our application.
                            </p>
                        </div>
                    </div>

                    {/* Section 10 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">10. Changes to This Privacy Policy</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any significant
                                changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                                We encourage you to review this Privacy Policy periodically.
                            </p>
                        </div>
                    </div>

                    {/* Section 11 */}
                    <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">11. Contact Us</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                If you have any questions, concerns, or requests regarding this Privacy Policy or our
                                data practices, please contact us:
                            </p>
                            <div className="mt-4 space-y-2">
                                <p><strong className="text-white">Email:</strong> <a href="mailto:privacy@lifeosplus.com" className="text-cyan-400 hover:text-cyan-300">privacy@lifeosplus.com</a></p>
                                <p><strong className="text-white">Support:</strong> <a href="mailto:support@lifeosplus.com" className="text-cyan-400 hover:text-cyan-300">support@lifeosplus.com</a></p>
                                <p><strong className="text-white">Website:</strong> <a href="https://lifeosplus.com" className="text-cyan-400 hover:text-cyan-300">lifeosplus.com</a></p>
                            </div>
                        </div>
                    </div>

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
                            <Link href="/page/support" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                Support
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
