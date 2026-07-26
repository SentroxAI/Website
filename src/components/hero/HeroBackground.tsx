import Aurora from "@/components/ui/aurora";

export default function HeroBackground() {
    return (
        <>
            <Aurora />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_60%)]" />

            <div
                className="
          absolute
          inset-0
          bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]
          bg-[size:48px_48px]
          [mask-image:radial-gradient(circle_at_center,black,transparent_90%)]
        "
            />
        </>
    );
}