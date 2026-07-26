"use client";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Workspace from "./WorkSpace";
export default function BrowserFrame() {
    return (
        <div
            className="
      overflow-hidden
      rounded-[32px]
      border
      border-white/10
      bg-slate-900/70
      backdrop-blur-3xl
      shadow-[0_40px_120px_rgba(0,0,0,.45)]
    "
        >
            <div className="flex h-[640px]">
                <Sidebar />

                <div className="flex flex-1 flex-col">
                    <TopBar />

                    <div className="flex-1 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black">
                        <Workspace />
                    </div>
                </div>
            </div>
        </div>
    );
}