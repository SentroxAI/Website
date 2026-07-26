"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import ThemeToggle from "./ThemeToggle";
import { navigation } from "./data";

export default function MobileNav() {
    return (
        <Sheet>
            <SheetTrigger>
                <Button
                    variant="ghost"
                    size="icon"
                    className="
    lg:hidden
    rounded-xl
    border
    border-white/10
    bg-white/5
    backdrop-blur-xl
    hover:bg-white/10
  "
                >
                    <Menu className="size-5" />
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-[320px] sm:w-[360px]"
            >
                <SheetHeader>
                    <SheetTitle>Sentrox AI</SheetTitle>
                </SheetHeader>

                <nav className="mt-8 flex flex-col gap-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted"
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>

                <Separator className="my-8" />

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                        Theme
                    </span>

                    <ThemeToggle />
                </div>

                <Link
                    href="/contact"
                    className="mt-8 block"
                >
                    <Button className="w-full">
                        Book Discovery Call
                    </Button>
                </Link>
            </SheetContent>
        </Sheet>
    );
}