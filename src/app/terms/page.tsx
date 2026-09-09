import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/home/Footer";
import LegalLayout from "@/components/legal/LegalLayout";

/* -------------------------------------------------------------------------- */
/*                                 METADATA                                   */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
    title: "Terms of Service",
    description:
        "Read the terms and conditions governing the use of Sentrox AI services and website.",
    robots: { index: true, follow: true },
    alternates: {
        canonical: "https://sentrox.ai/terms",
    },
};

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

export default function TermsPage() {
    return (
        <>
            <Navbar />

            <main>
                <LegalLayout
                    title="Terms of Service"
                    lastUpdated="July 27, 2026"
                >
                    {/* 1 — Agreement */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            1. Agreement to Terms
                        </h2>

                        <p className="mt-4">
                            By accessing or using the Sentrox AI website
                            (&quot;sentrox.ai&quot;) and services, you agree
                            to be bound by these Terms of Service. If you do
                            not agree to these terms, you must not use our
                            website or services.
                        </p>
                    </section>

                    {/* 2 — Services */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            2. Services
                        </h2>

                        <p className="mt-4">
                            Sentrox AI provides AI-powered web development,
                            automation, chatbot development, SEO, and related
                            digital services. The specific scope, deliverables,
                            timeline, and pricing for each project are defined
                            in a separate project agreement or proposal.
                        </p>

                        <p className="mt-4">
                            We reserve the right to modify, suspend, or
                            discontinue any part of our services at any time
                            with reasonable notice.
                        </p>
                    </section>

                    {/* 3 — Client Responsibilities */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            3. Client Responsibilities
                        </h2>

                        <p className="mt-4">
                            When engaging our services, you agree to:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6">
                            <li>
                                Provide accurate, complete, and timely
                                information necessary for project execution
                            </li>
                            <li>
                                Respond to requests for feedback and approval
                                within the agreed timeframes
                            </li>
                            <li>
                                Ensure that all content you provide does not
                                infringe on third-party intellectual property
                                rights
                            </li>
                            <li>
                                Make payments according to the schedule
                                outlined in the project agreement
                            </li>
                            <li>
                                Not use our services for any unlawful or
                                prohibited purpose
                            </li>
                        </ul>
                    </section>

                    {/* 4 — Intellectual Property */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            4. Intellectual Property
                        </h2>

                        <h3 className="mt-6 text-lg font-semibold text-slate-200">
                            Our Website
                        </h3>

                        <p className="mt-3">
                            All content on the Sentrox AI website — including
                            text, graphics, logos, icons, images, code, and
                            design — is owned by Sentrox AI and protected by
                            intellectual property laws. You may not copy,
                            modify, distribute, or reproduce any part of our
                            website without prior written consent.
                        </p>

                        <h3 className="mt-6 text-lg font-semibold text-slate-200">
                            Client Projects
                        </h3>

                        <p className="mt-3">
                            Upon full payment, clients receive ownership of
                            the final project deliverables as specified in the
                            project agreement. We retain the right to use
                            anonymized or non-confidential portions of
                            completed projects in our portfolio, unless
                            otherwise agreed in writing.
                        </p>
                    </section>

                    {/* 5 — Payment Terms */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            5. Payment Terms
                        </h2>

                        <ul className="mt-4 list-disc space-y-2 pl-6">
                            <li>
                                Payment schedules and amounts are defined in
                                each project proposal or agreement
                            </li>
                            <li>
                                A non-refundable deposit may be required before
                                work begins
                            </li>
                            <li>
                                Late payments may result in project suspension
                                and/or late fees as outlined in the agreement
                            </li>
                            <li>
                                We accept bank transfers, PayPal, and major
                                credit cards
                            </li>
                        </ul>
                    </section>

                    {/* 6 — Limitation of Liability */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            6. Limitation of Liability
                        </h2>

                        <p className="mt-4">
                            To the maximum extent permitted by law, Sentrox AI
                            shall not be liable for any indirect, incidental,
                            special, consequential, or punitive damages
                            arising from or related to the use of our website
                            or services. Our total liability shall not exceed
                            the amount paid by you for the specific service
                            giving rise to the claim.
                        </p>
                    </section>

                    {/* 7 — Warranties */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            7. Warranties and Disclaimers
                        </h2>

                        <p className="mt-4">
                            Our website and services are provided &quot;as
                            is&quot; without warranties of any kind, either
                            express or implied. We do not guarantee that our
                            website will be uninterrupted, error-free, or free
                            of viruses.
                        </p>

                        <p className="mt-4">
                            While we strive to deliver high-quality work, we
                            do not guarantee specific business outcomes such
                            as increased revenue, traffic, or conversions.
                        </p>
                    </section>

                    {/* 8 — Termination */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            8. Termination
                        </h2>

                        <p className="mt-4">
                            Either party may terminate a project engagement
                            with written notice as defined in the project
                            agreement. Upon termination, the client is
                            responsible for payment for all work completed up
                            to the date of termination.
                        </p>
                    </section>

                    {/* 9 — Governing Law */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            9. Governing Law
                        </h2>

                        <p className="mt-4">
                            These Terms shall be governed by and construed in
                            accordance with the laws of India. Any disputes
                            shall be resolved through good-faith negotiation
                            first, and if unresolved, through the courts of
                            competent jurisdiction.
                        </p>
                    </section>

                    {/* 10 — Changes */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            10. Changes to These Terms
                        </h2>

                        <p className="mt-4">
                            We reserve the right to update these Terms at any
                            time. Changes will be posted on this page with an
                            updated &quot;Last Updated&quot; date. Continued
                            use of our website after changes constitutes
                            acceptance of the revised terms.
                        </p>
                    </section>

                    {/* 11 — Contact */}

                    <section>
                        <h2 className="text-2xl font-bold text-white">
                            11. Contact Us
                        </h2>

                        <p className="mt-4">
                            If you have questions about these Terms of Service,
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
