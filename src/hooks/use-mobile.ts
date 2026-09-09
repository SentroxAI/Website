"use client";

/* -------------------------------------------------------------------------- */
/*                          USE-MOBILE HOOK                                    */
/*                                                                            */
/*  Returns true when viewport width ≤ 768px.                                */
/*  Uses matchMedia for efficient, resize-free detection.                     */
/* -------------------------------------------------------------------------- */

import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

        const onChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };

        // Set initial value
        setIsMobile(mql.matches);

        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return isMobile;
}
