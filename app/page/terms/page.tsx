'use client';

import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/10 border border-blue-500/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        Terms & Conditions
                    </h2>
                </div>
                <p className="text-gray-400 text-lg mb-4">
                    Last Updated: February 13, 2026
                </p>
                <p className="text-gray-300 leading-relaxed">
                    Please read these Terms and Conditions carefully before using Life OS Plus. By accessing or using
                    our service, you agree to be bound by these terms.
                </p>
            </section>

            {/* Content */}
            <section className="max-w-4xl mx-auto px-6 pb-20">
                <div className="prose prose-invert prose-blue max-w-none space-y-12">

                    {/* Section 1 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                By creating an account or using Life OS Plus, you acknowledge that you have read, understood,
                                and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not
                                agree to these terms, you may not access or use our services.
                            </p>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">2. Eligibility</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                You must be at least 13 years old to use Life OS Plus. By using our service, you represent
                                and warrant that you meet this age requirement. If you are under 18, you must have permission
                                from a parent or legal guardian to use our services.
                            </p>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">3. User Accounts</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                To access certain features, you must create an account. You are responsible for:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Maintaining the confidentiality of your account credentials</li>
                                <li>All activities that occur under your account</li>
                                <li>Notifying us immediately of any unauthorized access</li>
                                <li>Providing accurate and complete information</li>
                            </ul>
                            <p className="leading-relaxed mt-4">
                                We reserve the right to suspend or terminate accounts that violate these terms or engage
                                in fraudulent, abusive, or illegal activities.
                            </p>
                        </div>
                    </div>

                    {/* Section 4 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">4. Subscription and Payments</h3>
                        <div className="space-y-4 text-gray-300">
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-2">Free and Premium Tiers</h4>
                                <p className="leading-relaxed">
                                    Life OS Plus offers both free and premium subscription plans. Premium features require
                                    a paid subscription, which will be billed according to the plan you select.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-2">Payment Processing</h4>
                                <p className="leading-relaxed">
                                    Payments are processed through secure third-party payment processors (Razorpay). By
                                    subscribing, you authorize us to charge your payment method for the subscription fees.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-2">Refunds</h4>
                                <p className="leading-relaxed">
                                    All subscription fees are non-refundable except as required by law. You may cancel
                                    your subscription at any time, and you will continue to have access until the end of
                                    your current billing period.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 5 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">5. User Content and Conduct</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                You retain ownership of any content you create or upload to Life OS Plus. However, you
                                grant us a license to use, store, and process this content to provide our services.
                            </p>
                            <p className="leading-relaxed">You agree not to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Use the service for any illegal or unauthorized purpose</li>
                                <li>Violate any laws in your jurisdiction</li>
                                <li>Infringe upon the rights of others</li>
                                <li>Transmit any harmful code, viruses, or malware</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Interfere with or disrupt the service</li>
                                <li>Impersonate any person or entity</li>
                                <li>Harass, abuse, or harm other users</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 6 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                All content, features, and functionality of Life OS Plus, including but not limited to
                                text, graphics, logos, icons, images, audio clips, and software, are the exclusive property
                                of Life OS Plus and are protected by copyright, trademark, and other intellectual property laws.
                            </p>
                            <p className="leading-relaxed">
                                You may not reproduce, distribute, modify, create derivative works, publicly display, or
                                exploit any content from our service without our express written permission.
                            </p>
                        </div>
                    </div>

                    {/* Section 7 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">7. Disclaimer of Warranties</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                Life OS Plus is provided "as is" and "as available" without warranties of any kind, either
                                express or implied. We do not warrant that:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>The service will be uninterrupted, secure, or error-free</li>
                                <li>The results obtained from using the service will be accurate or reliable</li>
                                <li>Any errors in the service will be corrected</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 8 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                To the maximum extent permitted by law, Life OS Plus and its affiliates, officers, employees,
                                and agents shall not be liable for any indirect, incidental, special, consequential, or
                                punitive damages, including but not limited to loss of profits, data, or other intangible
                                losses, resulting from:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Your use or inability to use the service</li>
                                <li>Unauthorized access to or alteration of your data</li>
                                <li>Any third-party conduct or content on the service</li>
                                <li>Any other matter relating to the service</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 9 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">9. Indemnification</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                You agree to indemnify, defend, and hold harmless Life OS Plus and its affiliates from any
                                claims, liabilities, damages, losses, and expenses arising from your use of the service,
                                violation of these terms, or infringement of any third-party rights.
                            </p>
                        </div>
                    </div>

                    {/* Section 10 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">10. Termination</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                We reserve the right to suspend or terminate your account and access to Life OS Plus at our
                                sole discretion, without notice, for conduct that we believe violates these terms or is
                                harmful to other users, us, or third parties, or for any other reason.
                            </p>
                            <p className="leading-relaxed">
                                You may terminate your account at any time by contacting us or using the account deletion
                                feature in the app.
                            </p>
                        </div>
                    </div>

                    {/* Section 11 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                We reserve the right to modify these Terms and Conditions at any time. We will notify you
                                of significant changes by posting the updated terms on this page and updating the "Last
                                Updated" date. Your continued use of the service after changes constitutes acceptance of
                                the new terms.
                            </p>
                        </div>
                    </div>

                    {/* Section 12 */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">12. Governing Law</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                These Terms and Conditions shall be governed by and construed in accordance with the laws
                                of India, without regard to its conflict of law provisions. Any disputes arising from these
                                terms shall be subject to the exclusive jurisdiction of the courts in India.
                            </p>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">13. Contact Information</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="leading-relaxed">
                                If you have any questions about these Terms and Conditions, please contact us:
                            </p>
                            <div className="mt-4 space-y-2">
                                <p><strong className="text-white">Email:</strong> <a href="mailto:legal@lifeosplus.com" className="text-blue-400 hover:text-blue-300">legal@lifeosplus.com</a></p>
                                <p><strong className="text-white">Support:</strong> <a href="mailto:support@lifeosplus.com" className="text-blue-400 hover:text-blue-300">support@lifeosplus.com</a></p>
                                <p><strong className="text-white">Website:</strong> <a href="https://lifeosplus.com" className="text-blue-400 hover:text-blue-300">lifeosplus.com</a></p>
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
                            <Link href="/page/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
