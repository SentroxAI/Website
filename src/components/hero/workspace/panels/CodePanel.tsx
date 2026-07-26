"use client";

import { motion } from "framer-motion";

import Panel from "./Panel";

export default function CodePanel() {
    return (
        <Panel title="AI Code Generator">
            <pre className="overflow-auto rounded-2xl bg-slate-950 p-5 text-sm text-slate-300">
                {`const website = await sentrox.generate({
  business: "Hotel",
  booking: true,
  seo: true,
  aiChatbot: true,
  responsive: true,
});`}
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
            </pre>
        </Panel>
    );
}