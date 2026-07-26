import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HeroActions() {
    return (
        <div className="flex flex-wrap gap-4">
            <Link href="/contact">
                <Button size="lg">
                    Start Your Project
                </Button>
            </Link>

            <Link href="/portfolio">
                <Button variant="outline" size="lg">
                    View Portfolio
                </Button>
            </Link>
        </div>
    );
}