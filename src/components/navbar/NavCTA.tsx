import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NavCTA() {
    return (
        <Link href="/contact">
            <Button
                size="sm"
                className="
  hidden
  lg:inline-flex
  rounded-xl
  bg-gradient-to-r
  from-blue-600
  to-cyan-500
  text-white
  shadow-lg
  transition-all
  duration-300
  hover:scale-105
  hover:shadow-blue-500/30
  "
            >
                Book Discovery Call
            </Button>
        </Link>
    );
}