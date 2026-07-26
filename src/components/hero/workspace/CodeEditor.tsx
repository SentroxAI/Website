"use client";

import { motion } from "framer-motion";

export default function CodeEditor() {
    return (
        <div className="rounded-2xl border border-white/10 bg-slate-950 p-5 font-mono text-sm backdrop-blur-xl">
            <pre className="text-slate-300">
                {`const website = await sentrox.generate({
  business: "Hotel",
  ai: true,
  seo: true,
  responsive: true,
});`}
            </pre>

            <motion.span
                animate={{
                    opacity: [0, 1, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1,
                }}
            >
                |
            </motion.span>
        </div>
    );
}