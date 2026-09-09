import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/home/Footer";
import LegalLayout from "@/components/legal/LegalLayout";

/* -------------------------------------------------------------------------- */
/*                                 METADATA                                   */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "Learn how Sentrox AI collects, uses, and protects your personal information.",
    robots: { index: true, follow: true },
    alternates: {
        canonical: "https://sentrox.ai/privacy-policy",
    },
};

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

export default function PrivacyPolicyPage() {
    return (
        <>
            <Navbar />

            <main>
                <LegalLayout
                    title="Privacy Policy"
                    lastUpdated="July 27, 2026"
                >
                    {/* 1 — Introduction */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            1. Introduction
                        </h2>

                        <p className="mt-4">
                            Sentrox AI (&quot;we,&quot; &quot;us,&quot; or
                            &quot;our&quot;) is committed to protecting your
                            privacy. This Privacy Policy explains how we
                            collect, use, disclose, and safeguard your
                            information when you visit our website{" "}
                            <span className="text-blue-400">sentrox.ai</span>{" "}
                            or engage with our services.
                        </p>

                        <p className="mt-4">
                            By accessing our website, you consent to the
                            practices described in this policy. If you do not
                            agree, please discontinue use of our website.
                        </p>
                    </section>

                    {/* 2 — Information We Collect */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            2. Information We Collect
                        </h2>

                        <h3 className="mt-6 text-lg font-semibold text-slate-200">
                            Personal Information
                        </h3>

                        <p className="mt-3">
                            When you fill out our contact form, book a
                            consultation, or subscribe to our newsletter, we
                            may collect:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6">
                            <li>Full name</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Company name</li>
                            <li>Project details and messages</li>
                        </ul>

                        <h3 className="mt-6 text-lg font-semibold text-slate-200">
                            Automatically Collected Information
                        </h3>

                        <p className="mt-3">
                            When you visit our website, we automatically
                            collect certain technical information, including:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6">
                            <li>IP address and geolocation data</li>
                            <li>Browser type and version</li>
                            <li>Device type and operating system</li>
                            <li>Pages visited, time spent, and referral source</li>
                            <li>
                                Cookies and similar tracking technologies
                            </li>
                        </ul>
                    </section>

                    {/* 3 — How We Use Your Information */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            3. How We Use Your Information
                        </h2>

                        <p className="mt-4">
                            We use the information we collect for the following
                            purposes:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6">
                            <li>To respond to your inquiries and provide services</li>
                            <li>To schedule consultations and meetings</li>
                            <li>To send newsletter updates (with your consent)</li>
                            <li>To improve our website and user experience</li>
                            <li>To analyze website traffic and usage patterns</li>
                            <li>To comply with legal obligations</li>
                        </ul>
                    </section>

                    {/* 4 — Data Sharing */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            4. Data Sharing and Disclosure
                        </h2>

                        <p className="mt-4">
                            We do not sell, trade, or rent your personal
                            information. We may share data with:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6">
                            <li>
                                <span className="text-slate-200">Service providers:</span>{" "}
                                Trusted third parties that help us operate our
                                website (hosting, email, analytics)
                            </li>
                            <li>
                                <span className="text-slate-200">Legal requirements:</span>{" "}
                                When required by law or to protect our rights
                            </li>
                            <li>
                                <span className="text-slate-200">Business transfers:</span>{" "}
                                In connection with a merger, acquisition, or
                                sale of assets
                            </li>
                        </ul>
                    </section>

                    {/* 5 — Data Security */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            5. Data Security
                        </h2>

                        <p className="mt-4">
                            We implement industry-standard security measures
                            to protect your personal information, including
                            encrypted data transmission (SSL/TLS), secure
                            servers, and access controls. However, no method
                            of electronic transmission is 100% secure.
                        </p>
                    </section>

                    {/* 6 — Your Rights */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            6. Your Rights
                        </h2>

                        <p className="mt-4">
                            Depending on your jurisdiction, you may have the
                            right to:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6">
                            <li>Access, correct, or delete your personal data</li>
                            <li>Withdraw consent for data processing</li>
                            <li>Object to or restrict certain processing</li>
                            <li>Request data portability</li>
                            <li>Opt out of marketing communications</li>
                        </ul>

                        <p className="mt-4">
                            To exercise these rights, contact us at{" "}
                            <a
                                href="mailto:founder.sentrox@gmail.com"
                                className="text-blue-400 hover:underline"
                            >
                                founder.sentrox@gmail.com
                            </a>
                            .
                        </p>
                    </section>

                    {/* 7 — Contact */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            7. Contact Us
                        </h2>

                        <p className="mt-4">
                            If you have questions about this Privacy Policy,
                            please contact us:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6">
                            <li>
                                Email:{" "}
                                <a
                                    href="mailto:founder.sentrox@gmail.com"
                                    className="text-blue-400 hover:underline"
                                >
                                    founder.sentrox@gmail.com
                                </a>
                            </li>
                            <li>Website: sentrox.ai</li>
                        </ul>
                    </section>
                </LegalLayout>
            </main>

            <Footer />
        </>
    );
}
