import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/home/Footer";
import LegalLayout from "@/components/legal/LegalLayout";

/* -------------------------------------------------------------------------- */
/*                                 METADATA                                   */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
    title: "Cookie Policy",
    description:
        "Learn about how Sentrox AI uses cookies and similar technologies on our website.",
    robots: { index: true, follow: true },
    alternates: {
        canonical: "https://sentrox.ai/cookies",
    },
};

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

export default function CookiePolicyPage() {
    return (
        <>
            <Navbar />

            <main>
                <LegalLayout
                    title="Cookie Policy"
                    lastUpdated="July 27, 2026"
                >
                    {/* 1 — What Are Cookies */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            1. What Are Cookies
                        </h2>

                        <p className="mt-4">
                            Cookies are small text files stored on your device
                            when you visit a website. They help the website
                            remember your preferences, understand how you
                            interact with the site, and improve your overall
                            experience.
                        </p>
                    </section>

                    {/* 2 — How We Use Cookies */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            2. How We Use Cookies
                        </h2>

                        <p className="mt-4">
                            Sentrox AI uses cookies for the following purposes:
                        </p>

                        <h3 className="mt-6 text-lg font-semibold text-slate-200">
                            Essential Cookies
                        </h3>

                        <p className="mt-3">
                            These cookies are necessary for the website to
                            function properly. They enable core features such
                            as page navigation, secure access, and form
                            submissions. You cannot opt out of these cookies.
                        </p>

                        <h3 className="mt-6 text-lg font-semibold text-slate-200">
                            Analytics Cookies
                        </h3>

                        <p className="mt-3">
                            We use analytics cookies to understand how visitors
                            interact with our website. This data helps us
                            improve performance and content. These cookies
                            collect anonymous, aggregated information.
                        </p>

                        <h3 className="mt-6 text-lg font-semibold text-slate-200">
                            Preference Cookies
                        </h3>

                        <p className="mt-3">
                            These cookies remember your settings and
                            preferences, such as theme mode (dark/light) and
                            cookie consent status, to provide a personalized
                            experience.
                        </p>
                    </section>

                    {/* 3 — Cookie List */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            3. Cookies We Use
                        </h2>

                        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="px-5 py-3 font-semibold text-slate-200">
                                            Cookie
                                        </th>
                                        <th className="px-5 py-3 font-semibold text-slate-200">
                                            Purpose
                                        </th>
                                        <th className="px-5 py-3 font-semibold text-slate-200">
                                            Duration
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-white/5">
                                    <tr>
                                        <td className="px-5 py-3 font-mono text-xs text-blue-400">
                                            sentrox-cookie-consent
                                        </td>
                                        <td className="px-5 py-3">
                                            Stores your cookie consent preference
                                        </td>
                                        <td className="px-5 py-3">
                                            Persistent
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-5 py-3 font-mono text-xs text-blue-400">
                                            theme
                                        </td>
                                        <td className="px-5 py-3">
                                            Remembers your dark/light mode preference
                                        </td>
                                        <td className="px-5 py-3">
                                            Persistent
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 4 — Third-Party Cookies */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            4. Third-Party Cookies
                        </h2>

                        <p className="mt-4">
                            Some features on our site may use third-party
                            services that set their own cookies. We do not
                            control these cookies. Third-party services we
                            may use include:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6">
                            <li>Analytics platforms (e.g., Google Analytics)</li>
                            <li>Booking and scheduling tools</li>
                            <li>Social media embeds</li>
                        </ul>

                        <p className="mt-4">
                            Please refer to the respective third-party
                            privacy policies for more information.
                        </p>
                    </section>

                    {/* 5 — Managing Cookies */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            5. Managing Your Cookies
                        </h2>

                        <p className="mt-4">
                            You can control and manage cookies through your
                            browser settings. Most browsers allow you to:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6">
                            <li>View what cookies are stored on your device</li>
                            <li>Delete all or specific cookies</li>
                            <li>Block cookies from specific sites or all sites</li>
                            <li>Set preferences for cookie acceptance</li>
                        </ul>

                        <p className="mt-4">
                            Please note that blocking essential cookies may
                            affect your ability to use certain features of our
                            website.
                        </p>
                    </section>

                    {/* 6 — Updates */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            6. Updates to This Policy
                        </h2>

                        <p className="mt-4">
                            We may update this Cookie Policy periodically to
                            reflect changes in our practices or for legal
                            reasons. Updates will be posted on this page with
                            a revised &quot;Last Updated&quot; date.
                        </p>
                    </section>

                    {/* 7 — Contact */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            7. Contact Us
                        </h2>

                        <p className="mt-4">
                            If you have questions about our use of cookies,
                            contact us at:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6">
                            <li>
                                Email:{" "}
                                <a
                                    href="mailto:hello@sentrox.ai"
                                    className="text-blue-400 hover:underline"
                                >
                                    hello@sentrox.ai
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
