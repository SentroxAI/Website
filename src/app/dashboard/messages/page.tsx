"use client";

/* -------------------------------------------------------------------------- */
/*                          MESSAGES PAGE                                     */
/*                                                                            */
/*  Module 5: Split-pane messaging interface.                                 */
/*  Left: ConversationList | Right: MessageThread                             */
/*  Mobile: shows list or thread based on selection.                          */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import ConversationList from "@/components/dashboard/messages/ConversationList";
import MessageThread from "@/components/dashboard/messages/MessageThread";
import { conversations, getConversationById } from "@/components/dashboard/messages/data";

export default function MessagesPage() {
    const [activeConversationId, setActiveConversationId] = useState<string | null>(
        conversations[0]?.id || null
    );
    const isMobile = useIsMobile();

    const activeConversation = activeConversationId
        ? getConversationById(activeConversationId) || null
        : null;

    const handleSelect = (id: string) => {
        setActiveConversationId(id);
    };

    const handleBack = () => {
        setActiveConversationId(null);
    };

    /* ── Mobile: show list OR thread ──────────────────────────────── */
    if (isMobile) {
        return (
            <div className="h-[calc(100vh-4rem)]">
                {activeConversation ? (
                    <div className="flex h-full flex-col">
                        {/* Back button */}
                        <div className="shrink-0 flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
                            <button
                                onClick={handleBack}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-sx-text-muted hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-medium text-white">
                                {activeConversation.contact.name}
                            </span>
                        </div>
                        <div className="flex-1 min-h-0">
                            <MessageThread conversation={activeConversation} />
                        </div>
                    </div>
                ) : (
                    <ConversationList
                        activeId={activeConversationId}
                        onSelect={handleSelect}
                    />
                )}
            </div>
        );
    }

    /* ── Desktop: split pane ───────────────────────────────────────── */
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.01] mx-4 md:mx-6 lg:mx-8 my-4"
        >
            {/* Left: conversation list */}
            <div className="w-[320px] shrink-0 border-r border-white/[0.06] overflow-hidden">
                <ConversationList
                    activeId={activeConversationId}
                    onSelect={handleSelect}
                />
            </div>

            {/* Right: message thread */}
            <div className="flex-1 min-w-0">
                <MessageThread conversation={activeConversation} />
            </div>
        </motion.div>
    );
}
