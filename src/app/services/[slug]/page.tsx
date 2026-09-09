import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/home/Footer";
import ServiceDetailContent from "@/components/services/ServiceDetailContent";
import { servicesData } from "@/components/services/servicesData";

/* -------------------------------------------------------------------------- */
/*                          SLUG → SERVICE MAPPING                             */
/*                                                                             */
/*  Maps URL slugs (used in footer links) to servicesData IDs.                */
/*  Some slugs match IDs directly; others are aliases.                         */
/* -------------------------------------------------------------------------- */

const slugToServiceId: Record<string, string> = {
    "ai-websites": "ai-website",
    "ai-website": "ai-website",
    "automation": "ai-automation",
    "ai-automation": "ai-automation",
    "chatbots": "ai-agents",
    "ai-agents": "ai-agents",
    "ai-chatbots": "ai-agents",
    "custom-software": "custom-software",
    "seo": "seo",
    "maintenance": "maintenance",
    "landing-pages": "ai-website",  // Landing pages are part of AI Website service
};

function getServiceIdBySlug(slug: string) {
    return slugToServiceId[slug] || null;
}

/* -------------------------------------------------------------------------- */
/*                          STATIC PARAMS                                      */
/* -------------------------------------------------------------------------- */

export function generateStaticParams() {
    return Object.keys(slugToServiceId).map((slug) => ({ slug }));
}

/* -------------------------------------------------------------------------- */
/*                           METADATA                                          */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const serviceId = getServiceIdBySlug(slug);
    const service = serviceId ? servicesData.find((s) => s.id === serviceId) : null;

    if (!service) {
        return { title: "Service Not Found" };
    }

    return {
        title: service.title,
        description: service.shortDescription,
        alternates: {
            canonical: `https://sentrox.ai/services/${slug}`,
        },
        openGraph: {
            title: `${service.title} — Sentrox AI`,
            description: service.shortDescription,
        },
    };
}

/* -------------------------------------------------------------------------- */
/*                              PAGE                                           */
/* -------------------------------------------------------------------------- */

export default async function ServiceDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const serviceId = getServiceIdBySlug(slug);

    if (!serviceId) {
        notFound();
    }

    return (
        <>
            <Navbar />

            <main>
                <ServiceDetailContent serviceId={serviceId} />
            </main>

            <Footer />
        </>
    );
}
