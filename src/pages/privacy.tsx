import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';
import Head from 'next/head';

const PrivacyPolicy = () => {
    return (
        <>
            <Head>
                <title>Privacy Policy - Seniru&rsquo;s Place</title>
                <meta name="description" content="Privacy Policy for Seniru's Place" />
            </Head>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-primary/70 via-secondary/60 to-accent/50 py-10 px-4 sm:px-8 lg:px-16">
                <div className="max-w-4xl mx-auto bg-base-100/90 shadow-xl rounded-xl p-8 lg:p-12">
                    <h1 className="text-5xl font-bold text-primary-content mb-8 text-center">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-base-content leading-relaxed mb-6">
                        This Privacy Policy explains how we collect, use, and protect your personal information when you use <span className="text-accent font-semibold">Seniru&rsquo;s Place</span>. By using our services, you agree to the terms outlined in this policy.
                    </p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-3xl font-bold text-secondary mb-4">
                                1. Information We Collect
                            </h2>
                            <p className="text-base-content mb-4">
                                We collect the following types of information:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-base-content">
                                <li>
                                    <strong>Personal Information:</strong> Your email address when you subscribe to our mailing list.
                                </li>
                                <li>
                                    <strong>Usage Data:</strong> Information about your interactions with our website, such as pages visited and time spent on the site.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-secondary mb-4">
                                2. How We Use Your Information
                            </h2>
                            <p className="text-base-content mb-4">
                                We use the information collected for the following purposes:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-base-content">
                                <li>To provide updates and announcements via email.</li>
                                <li>To improve our website and services.</li>
                                <li>To comply with legal requirements.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-secondary mb-4">
                                3. Data Security
                            </h2>
                            <p className="text-base-content mb-4">
                                We take appropriate measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-secondary mb-4">
                                4. Third-Party Services
                            </h2>
                            <p className="text-base-content mb-4">
                                We may use third-party services for analytics or email distribution. These services are governed by their own privacy policies.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-secondary mb-4">
                                5. Your Rights
                            </h2>
                            <p className="text-base-content mb-4">
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-base-content">
                                <li>Access and update your personal information.</li>
                                <li>Request the deletion of your personal data.</li>
                                <li>Withdraw consent for data processing at any time.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-secondary mb-4">
                                6. Changes to This Privacy Policy
                            </h2>
                            <p className="text-base-content mb-4">
                                We may update this Privacy Policy from time to time. We encourage you to review this page periodically for any changes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-secondary mb-4">
                                7. Contact Us
                            </h2>
                            <p className="text-base-content">
                                If you have any questions or concerns about this Privacy Policy, please contact us at{' '}
                                <a
                                    href="mailto:dilmithseniru@gmail.com"
                                    className="text-accent hover:text-accent-focus underline font-semibold"
                                >
                                    dilmithseniru@gmail.com
                                </a>
                                .
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;
