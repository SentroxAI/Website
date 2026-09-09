# Dashboard Area — Full Functionality & Responsive Overhaul

Complete the SentroxAI client dashboard so every page is fully functional (connected to Supabase), all buttons/actions work, and every section is properly responsive on mobile/tablet/desktop.

## Current State Assessment

| Page | Status | Data Source | Key Issues |
|------|--------|-------------|------------|
| `/dashboard` (Overview) | ⚠️ Partial | Hardcoded mock data | Stats, activity, meetings, projects — all mock |
| `/dashboard/projects` | ⚠️ Partial | Hardcoded mock data | "New Project" button does nothing |
| `/dashboard/messages` | ⚠️ Partial | Hardcoded mock data | Can't send messages, mock conversations |
| `/dashboard/files` | ✅ Works | Supabase Storage | Already connected |
| `/dashboard/meetings` | ⚠️ Partial | Hardcoded mock data | "Schedule Meeting" button does nothing |
| `/dashboard/billing` | ✅ Works | Supabase + UPI | Already connected |
| `/dashboard/settings` | ⚠️ Partial | Hardcoded mock data | "Save" doesn't persist to Supabase |
| `/dashboard/profile` | ❌ Placeholder | None | Just says "coming in Module 8" |
| `/dashboard/invoices` | ❌ Placeholder | None | Just says "coming soon" |

> [!IMPORTANT]
> **Scope Decision**: Since the Supabase DB may have empty tables, we will keep mock data as the **fallback** and layer real Supabase data on top. Each component will try to fetch real data first, and gracefully fall back to mock data if the DB tables are empty. This ensures the dashboard always looks populated for demo purposes while being production-ready.

## Proposed Changes

### Phase 1: Profile Page (replaces placeholder)
Build a real `/dashboard/profile` page that fetches user profile from Supabase using the `useAuth` hook.

#### [MODIFY] [page.tsx](file:///f:/SentroxAI/website/src/app/dashboard/profile/page.tsx)
- Replace the placeholder with a full profile view
- Use `useAuth()` hook to get real user data (name, email, avatar, company, phone)
- Show profile card with avatar, editable fields
- Add "Edit Profile" button that links to Settings → Profile tab
- Make fully responsive (stack on mobile)

---

### Phase 2: Invoices Page (replaces placeholder)
Build a real `/dashboard/invoices` page that fetches from the `payments` table.

#### [MODIFY] [page.tsx](file:///f:/SentroxAI/website/src/app/dashboard/invoices/page.tsx)
- Replace placeholder with a table of past payments fetched from Supabase `payments` table
- Show: invoice number, date, amount, status, download button
- Filter by status (all, completed, processing, failed)
- Responsive: collapse table to card layout on mobile
- Fall back to "No invoices yet" empty state if table is empty

---

### Phase 3: Settings — Connect to Supabase
Make settings Profile and Security sections save changes to Supabase.

#### [MODIFY] [ProfileSection.tsx](file:///f:/SentroxAI/website/src/components/dashboard/settings/ProfileSection.tsx)
- Load initial data from `useAuth()` hook instead of `userProfile` mock
- "Save" button calls Supabase to update the `users` table
- Show toast on success/error
- Avatar upload via Supabase Storage

#### [MODIFY] [SecuritySection.tsx](file:///f:/SentroxAI/website/src/components/dashboard/settings/SecuritySection.tsx)
- "Change Password" calls `supabase.auth.updateUser({ password })`
- Show real active sessions info if available
- "Sign out other sessions" functionality

---

### Phase 4: Dashboard Overview — Connect Stats to Real Data
Connect overview widgets to Supabase queries (with mock fallback).

#### [MODIFY] [StatsGrid.tsx](file:///f:/SentroxAI/website/src/components/dashboard/overview/StatsGrid.tsx)
- Fetch real counts: active projects, completed projects, unread messages, upcoming meetings
- Query Supabase `projects`, `messages`, `meetings` tables
- Fall back to mock data if queries return empty

#### [MODIFY] [RecentProjects.tsx](file:///f:/SentroxAI/website/src/components/dashboard/overview/RecentProjects.tsx)
- Fetch 4 most recent projects from Supabase
- Fall back to mock data

#### [MODIFY] [RecentMessages.tsx](file:///f:/SentroxAI/website/src/components/dashboard/overview/RecentMessages.tsx)
- Fetch latest messages from Supabase
- Fall back to mock data

#### [MODIFY] [UpcomingMeetings.tsx](file:///f:/SentroxAI/website/src/components/dashboard/overview/UpcomingMeetings.tsx)
- Fetch upcoming meetings from Supabase
- Fall back to mock data

---

### Phase 5: Projects — Connect to Supabase + Working Buttons

#### [MODIFY] [ProjectsPage](file:///f:/SentroxAI/website/src/app/dashboard/projects/page.tsx)
- Fetch projects from Supabase `projects` table for current user's client
- "New Project" button → shows a simple request form / redirects to contact
- Fall back to mock data if empty

---

### Phase 6: Messages — Working Send Functionality

#### [MODIFY] [MessageThread.tsx](file:///f:/SentroxAI/website/src/components/dashboard/messages/MessageThread.tsx)
- Send message input → insert into Supabase `messages` table
- Real-time subscription for new messages
- Fall back to mock conversations when DB is empty

#### [MODIFY] [ConversationList.tsx](file:///f:/SentroxAI/website/src/components/dashboard/messages/ConversationList.tsx)
- Fetch conversation list from Supabase
- Show unread badge counts from real data
- Fall back to mock

---

### Phase 7: Meetings — Working Schedule Button

#### [MODIFY] [MeetingsPage](file:///f:/SentroxAI/website/src/app/dashboard/meetings/page.tsx)
- Fetch meetings from Supabase `meetings` table
- "Schedule Meeting" button → modal form (title, date/time, description)
- Insert new meeting into Supabase
- Fall back to mock data

---

### Phase 8: Responsive Audit & Fixes
Audit every dashboard page on mobile (< 640px) and tablet (640–1024px) viewports.

#### Files to audit and fix:
- [DashboardSidebar.tsx](file:///f:/SentroxAI/website/src/components/dashboard/DashboardSidebar.tsx) — Ensure proper collapse on mobile
- [DashboardHeader.tsx](file:///f:/SentroxAI/website/src/components/dashboard/DashboardHeader.tsx) — Search, user menu on small screens
- [StatsCard.tsx](file:///f:/SentroxAI/website/src/components/dashboard/overview/StatsCard.tsx) — Grid collapse
- [ProjectCard.tsx](file:///f:/SentroxAI/website/src/components/dashboard/projects/ProjectCard.tsx) — Card layout on mobile
- [MeetingCard.tsx](file:///f:/SentroxAI/website/src/components/dashboard/meetings/MeetingCard.tsx) — Card layout on mobile
- [FileManager.tsx](file:///f:/SentroxAI/website/src/components/dashboard/files/FileManager.tsx) — Table → card on mobile
- All billing components — Tab overflow, card layouts

## Open Questions

> [!IMPORTANT]
> **1. "New Project" behavior**: Should the "New Project" button open a request form (client requests a project from SentroxAI), or should it create a project directly in the database? For a client dashboard, a request form seems more appropriate.

> [!IMPORTANT]  
> **2. "Schedule Meeting" behavior**: Should clients be able to directly create meetings, or should it open a booking request? A direct meeting scheduler is more useful.

> [!IMPORTANT]
> **3. Message recipients**: In the messages system, who does the client message? The SentroxAI support team / assigned project manager? We need to define the contact list.

## Verification Plan

### Automated Tests
```bash
npx next build
```

### Manual Verification
- Test each page loads without errors
- Verify responsive layouts at 375px, 768px, 1024px, 1440px
- Test profile save → verify data persists in Supabase
- Test message send → verify message appears
- Test meeting creation → verify meeting shows in list
