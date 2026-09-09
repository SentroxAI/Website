import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";

export default function HeroActions() {
    return (
        <div className="flex flex-wrap items-center gap-4">
            <PrimaryButton
                href="/contact"
                size="lg"
            >
                Start Your Project
            </PrimaryButton>

            <SecondaryButton
                href="/portfolio"
                size="lg"
            >
                View Portfolio
            </SecondaryButton>
        </div>
    );
}