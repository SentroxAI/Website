# Dashboard Overhaul — Task Tracker

## Phase 1: Profile Page
- [x] Build full profile page with `useAuth()` data
- [x] Avatar display, editable fields, link to Settings

## Phase 2: Invoices Page
- [x] Replace placeholder with payment history from Supabase
- [x] Filters, responsive card layout on mobile

## Phase 3: Settings — Connect to Supabase
- [x] ProfileSection: load from `useAuth()`, save to Supabase
- [x] SecuritySection: change password via Supabase Auth

## Phase 4: Dashboard Overview — Real Data
- [x] StatsGrid: fetch real counts from Supabase
- [x] RecentProjects, RecentMessages, UpcomingMeetings: real data + mock fallback

## Phase 5: Projects — Supabase + Working Buttons
- [x] Fetch projects from Supabase
- [x] "New Project" → request form modal

## Phase 6: Messages — Working Send
- [x] Fetch conversations from Supabase
- [x] Send message → insert into Supabase
- [x] Real-time subscription

## Phase 7: Meetings — Working Schedule
- [x] Fetch meetings from Supabase
- [x] "Schedule Meeting" → modal form + insert

## Phase 8: Responsive Audit
- [x] Sidebar, Header, Stats, Project/Meeting/File cards
- [x] Billing tabs, Profile, Settings layouts
