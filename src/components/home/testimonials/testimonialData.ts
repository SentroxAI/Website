import { Testimonial } from "./types";

/** Generate a deterministic avatar URL from a name (no local file needed). */
function avatar(name: string, bg = "0f172a", fg = "60a5fa"): string {
    const encoded = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encoded}&size=128&background=${bg}&color=${fg}&bold=true&format=svg`;
}

export const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "CEO",
        company: "Luxury Hotels",
        industry: "Hospitality",
        image: avatar("Sarah Johnson"),
        rating: 5,
        review:
            "Sentrox AI completely redesigned our hotel website. Bookings increased significantly, our website became much faster, and guests now find it much easier to reserve rooms online.",
    },

    {
        id: 2,
        name: "Michael Chen",
        role: "Founder",
        company: "Urban Bistro",
        industry: "Restaurant",
        image: avatar("Michael Chen"),
        rating: 5,
        review:
            "The AI chatbot handles customer queries instantly, reducing our support workload while improving customer satisfaction.",
    },

    {
        id: 3,
        name: "Emma Wilson",
        role: "Clinic Director",
        company: "CarePlus Clinic",
        industry: "Healthcare",
        image: avatar("Emma Wilson"),
        rating: 5,
        review:
            "Appointment scheduling became effortless after Sentrox AI built our new website. Patients love the improved experience.",
    },

    {
        id: 4,
        name: "Daniel Carter",
        role: "Managing Director",
        company: "Prime Estates",
        industry: "Real Estate",
        image: avatar("Daniel Carter"),
        rating: 5,
        review:
            "Professional, fast, and beautifully designed. The new website generates more qualified leads than our previous platform.",
    },

    {
        id: 5,
        name: "Olivia Brown",
        role: "Owner",
        company: "Elite Fitness",
        industry: "Fitness",
        image: avatar("Olivia Brown"),
        rating: 5,
        review:
            "Our online memberships increased thanks to the premium user experience and seamless booking system.",
    },

    {
        id: 6,
        name: "James Taylor",
        role: "Founder",
        company: "Bright Future Academy",
        industry: "Education",
        image: avatar("James Taylor"),
        rating: 5,
        review:
            "Sentrox AI delivered exactly what we needed. Parents can now easily explore courses and enroll online.",
    },

    {
        id: 7,
        name: "Sophia Martinez",
        role: "Owner",
        company: "Glow Beauty Studio",
        industry: "Beauty",
        image: avatar("Sophia Martinez"),
        rating: 5,
        review:
            "Our online appointment bookings increased immediately after launching the new website. The design perfectly represents our brand.",
    },

    {
        id: 8,
        name: "David Miller",
        role: "Co-Founder",
        company: "CloudNova",
        industry: "Technology",
        image: avatar("David Miller"),
        rating: 5,
        review:
            "Outstanding communication and exceptional execution. The AI automation saved countless hours every week.",
    },
];