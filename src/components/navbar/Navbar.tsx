"use client";

import { motion } from "framer-motion";

import Container from "@/components/layout/Container";
import { useScroll } from "@/hooks/use-scroll";
import Aurora from "@/components/ui/aurora";
import DesktopNav from "./DesktopNav";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import NavCTA from "./NavCTA";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    const scrolled = useScroll();

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.5,
                ease: "easeOut",
            }}
            className={[
                "fixed inset-x-0 top-0 z-50 transition-all duration-300",
                scrolled
                    ? "border-b border-white/10 bg-slate-950/70 backdrop-blur-xl shadow-lg"
                    : "bg-transparent",
            ].join(" ")}
        >
            <Container className="relative">
                <Aurora />

                <div className="relative flex h-20 items-center justify-between">
                    <Logo />

                    <DesktopNav />

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <NavCTA />
                        <MobileNav />
                    </div>
                </div>
            </Container>
        </motion.header>
    );
}