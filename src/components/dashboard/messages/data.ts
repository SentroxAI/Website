/* -------------------------------------------------------------------------- */
/*                       MESSAGES MODULE – MOCK DATA                          */
/*                                                                            */
/*  Conversations and messages with typed interfaces.                         */
/*  Mirrors Supabase schema for easy migration later.                         */
/* -------------------------------------------------------------------------- */

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface Contact {
    id: string;
    name: string;
    avatar?: string;
    role: string;
    online: boolean;
}

export interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    relativeTime: string;
    read: boolean;
    type: "text" | "file" | "system";
    fileName?: string;
    fileSize?: string;
}

export interface Conversation {
    id: string;
    contact: Contact;
    projectName?: string;
    lastMessage: string;
    lastMessageTime: string;
    relativeTime: string;
    unreadCount: number;
    messages: Message[];
    pinned?: boolean;
}

/* ── Contacts ──────────────────────────────────────────────────────────────── */

const contacts: Record<string, Contact> = {
    u1: { id: "u1", name: "Alice Johnson", role: "Lead Designer", online: true },
    u2: { id: "u2", name: "Bob Smith", role: "Frontend Developer", online: true },
    u3: { id: "u3", name: "Charlie Davis", role: "Backend Developer", online: false },
    u4: { id: "u4", name: "Diana Wilson", role: "Product Manager", online: false },
    u5: { id: "u5", name: "Eve Martinez", role: "Mobile Developer", online: true },
    admin: { id: "admin", name: "Sentrox Support", role: "Support Team", online: true },
};

/* ── Mock conversations ────────────────────────────────────────────────────── */

export const conversations: Conversation[] = [
    {
        id: "c1",
        contact: contacts.u1,
        projectName: "Website Redesign",
        lastMessage: "The new homepage design looks great! I have a few suggestions for the hero section that I'd love to discuss.",
        lastMessageTime: "2026-08-04T16:30:00",
        relativeTime: "30 min ago",
        unreadCount: 2,
        pinned: true,
        messages: [
            {
                id: "m1",
                senderId: "me",
                content: "Hi Alice, I've just pushed the latest design updates for the homepage. Can you take a look?",
                timestamp: "2026-08-04T14:00:00",
                relativeTime: "3 hours ago",
                read: true,
                type: "text",
            },
            {
                id: "m2",
                senderId: "u1",
                content: "Just checked it out! The layout looks clean and modern. Really love the hero section with the gradient effect.",
                timestamp: "2026-08-04T14:15:00",
                relativeTime: "2h 45m ago",
                read: true,
                type: "text",
            },
            {
                id: "m3",
                senderId: "u1",
                content: "I've uploaded the revised brand guidelines with the updated color palette.",
                timestamp: "2026-08-04T14:20:00",
                relativeTime: "2h 40m ago",
                read: true,
                type: "file",
                fileName: "brand-guidelines-v3.pdf",
                fileSize: "2.8 MB",
            },
            {
                id: "m4",
                senderId: "me",
                content: "Thanks! I'll integrate the new colors into the design system today. Should have the components updated by EOD.",
                timestamp: "2026-08-04T14:45:00",
                relativeTime: "2h 15m ago",
                read: true,
                type: "text",
            },
            {
                id: "m5",
                senderId: "u1",
                content: "Perfect. One thing — can we make the CTA button a bit more prominent? Maybe increase the size slightly and add a subtle glow effect?",
                timestamp: "2026-08-04T16:00:00",
                relativeTime: "1 hour ago",
                read: false,
                type: "text",
            },
            {
                id: "m6",
                senderId: "u1",
                content: "The new homepage design looks great! I have a few suggestions for the hero section that I'd love to discuss.",
                timestamp: "2026-08-04T16:30:00",
                relativeTime: "30 min ago",
                read: false,
                type: "text",
            },
        ],
    },
    {
        id: "c2",
        contact: contacts.u2,
        projectName: "Website Redesign",
        lastMessage: "Can we move the sprint planning to Thursday? I have a conflict on Wednesday.",
        lastMessageTime: "2026-08-04T14:15:00",
        relativeTime: "2 hours ago",
        unreadCount: 1,
        messages: [
            {
                id: "m7",
                senderId: "u2",
                content: "Hey! Quick question about the responsive breakpoints. Are we targeting tablet at 768px or 1024px?",
                timestamp: "2026-08-04T10:00:00",
                relativeTime: "7 hours ago",
                read: true,
                type: "text",
            },
            {
                id: "m8",
                senderId: "me",
                content: "We're using 768px for tablet and 1024px for desktop. The sidebar collapses at 768px and hides completely below that.",
                timestamp: "2026-08-04T10:30:00",
                relativeTime: "6h 30m ago",
                read: true,
                type: "text",
            },
            {
                id: "m9",
                senderId: "u2",
                content: "Can we move the sprint planning to Thursday? I have a conflict on Wednesday.",
                timestamp: "2026-08-04T14:15:00",
                relativeTime: "2 hours ago",
                read: false,
                type: "text",
            },
        ],
    },
    {
        id: "c3",
        contact: contacts.u3,
        lastMessage: "Invoice #103 has been processed. Payment should arrive within 2 business days.",
        lastMessageTime: "2026-08-04T11:00:00",
        relativeTime: "5 hours ago",
        unreadCount: 0,
        messages: [
            {
                id: "m10",
                senderId: "u3",
                content: "The backend API for the user dashboard is ready. I've deployed it to staging for testing.",
                timestamp: "2026-08-03T16:00:00",
                relativeTime: "Yesterday",
                read: true,
                type: "text",
            },
            {
                id: "m11",
                senderId: "me",
                content: "Great work! I'll start integrating it with the frontend components today.",
                timestamp: "2026-08-03T16:30:00",
                relativeTime: "Yesterday",
                read: true,
                type: "text",
            },
            {
                id: "m12",
                senderId: "u3",
                content: "Invoice #103 has been processed. Payment should arrive within 2 business days.",
                timestamp: "2026-08-04T11:00:00",
                relativeTime: "5 hours ago",
                read: true,
                type: "text",
            },
        ],
    },
    {
        id: "c4",
        contact: contacts.u4,
        projectName: "Mobile App v2.0",
        lastMessage: "Looking forward to our quarterly review next week. I'll prepare the deck.",
        lastMessageTime: "2026-08-03T09:45:00",
        relativeTime: "Yesterday",
        unreadCount: 0,
        messages: [
            {
                id: "m13",
                senderId: "u4",
                content: "The mobile app requirements document has been finalized. Here's the latest version.",
                timestamp: "2026-08-02T14:00:00",
                relativeTime: "2 days ago",
                read: true,
                type: "file",
                fileName: "mobile-app-requirements.pdf",
                fileSize: "1.5 MB",
            },
            {
                id: "m14",
                senderId: "me",
                content: "Thanks Diana! I've reviewed it and everything looks good. Let's proceed with the development phase.",
                timestamp: "2026-08-02T15:00:00",
                relativeTime: "2 days ago",
                read: true,
                type: "text",
            },
            {
                id: "m15",
                senderId: "u4",
                content: "Looking forward to our quarterly review next week. I'll prepare the deck.",
                timestamp: "2026-08-03T09:45:00",
                relativeTime: "Yesterday",
                read: true,
                type: "text",
            },
        ],
    },
    {
        id: "c5",
        contact: contacts.admin,
        lastMessage: "Your account has been upgraded to the Pro plan. You now have access to all premium features.",
        lastMessageTime: "2026-08-01T10:00:00",
        relativeTime: "3 days ago",
        unreadCount: 0,
        pinned: true,
        messages: [
            {
                id: "m16",
                senderId: "admin",
                content: "Welcome to Sentrox! We're here to help you get the most out of our platform.",
                timestamp: "2026-07-28T10:00:00",
                relativeTime: "1 week ago",
                read: true,
                type: "system",
            },
            {
                id: "m17",
                senderId: "admin",
                content: "Your account has been upgraded to the Pro plan. You now have access to all premium features.",
                timestamp: "2026-08-01T10:00:00",
                relativeTime: "3 days ago",
                read: true,
                type: "system",
            },
        ],
    },
];

/* ── Helpers ───────────────────────────────────────────────────────────────── */

export function getConversationById(id: string): Conversation | undefined {
    return conversations.find((c) => c.id === id);
}

export function getTotalUnread(): number {
    return conversations.reduce((sum, c) => sum + c.unreadCount, 0);
}
