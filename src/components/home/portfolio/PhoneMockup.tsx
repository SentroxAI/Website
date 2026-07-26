"use client";

import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";

export default function PhoneMockup() {

    return (

        <motion.div

            animate={{
                y: [0, -12, 0],
                rotate: [0, -2, 0],
            }}

            transition={{
                repeat: Infinity,
                duration: 5,
            }}

            className="absolute -right-10 top-16 hidden lg:block"
        >

            <div className="w-56 rounded-[34px] border border-white/10 bg-[#0E1628] p-3 shadow-2xl">

                <div className="rounded-[28px] bg-slate-900 p-4">

                    <div className="mb-4 flex justify-center">

                        <div className="h-1.5 w-16 rounded-full bg-slate-700" />

                    </div>

                    <div className="rounded-2xl bg-gradient-to-b from-blue-500 to-cyan-500 p-5">

                        <Smartphone
                            className="mx-auto text-white"
                            size={42}
                        />

                        <h3 className="mt-4 text-center text-white font-semibold">
                            Mobile Booking
                        </h3>

                    </div>

                    <div className="mt-5 space-y-3">

                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-10 rounded-xl bg-slate-800"
                            />
                        ))}

                    </div>

                </div>

            </div>

        </motion.div>

    );
}