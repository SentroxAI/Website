# 🚀 SentroxAI Deployment Guide

Deploy `sentroxai.com` via **Vercel** (hosting) + **GitHub** (CI/CD) + **Hostinger** (DNS).

---

## Step 1: Push Code to GitHub ✅ (Automated)

We'll commit all changes and push to `https://github.com/SentroxAI/website.git`.

---

## Step 2: Connect GitHub Repo to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select the **SentroxAI/website** repo
4. Vercel will auto-detect it as a Next.js project (framework settings are already in `vercel.json`)
5. **Before clicking Deploy**, add the environment variables (Step 3)

---

## Step 3: Add Environment Variables in Vercel

Go to **Project Settings → Environment Variables** and add ALL of these:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_APP_NAME` | `Sentrox AI` |
| `NEXT_PUBLIC_APP_URL` | `https://sentroxai.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | *(copy from .env.local)* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(copy from .env.local)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(copy from .env.local)* |
| `RESEND_API_KEY` | *(copy from .env.local)* |
| `FROM_EMAIL` | `Sentrox AI <hello@sentroxai.com>` |
| `NOTIFICATION_EMAIL` | *(copy from .env.local)* |
| `NEXT_PUBLIC_UPI_ID` | *(copy from .env.local)* |
| `NEXT_PUBLIC_UPI_NAME` | `Sentrox AI` |
| `GOOGLE_GENAI_API_KEY` | *(copy from .env.local)* |

> [!IMPORTANT]
> Set all variables for **Production**, **Preview**, and **Development** environments.

---

## Step 4: Add Custom Domain in Vercel

1. Go to **Project Settings → Domains**
2. Add `sentroxai.com`
3. Also add `www.sentroxai.com` (Vercel will auto-redirect www → apex or vice-versa)
4. Vercel will show you the DNS records you need to configure

---

## Step 5: Configure DNS in Hostinger

Log in to [Hostinger DNS Zone Editor](https://hpanel.hostinger.com/domains) for `sentroxai.com` and update:

### Option A: Using Vercel Nameservers (Recommended — simplest)
Change nameservers in Hostinger to Vercel's:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Option B: Keep Hostinger Nameservers (Add Records Manually)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `@` | `76.76.21.21` | 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com` | 3600 |

> [!TIP]
> **Delete** any existing A records for `@` and CNAME records for `www` before adding the new ones.

> [!WARNING]
> If you have email (MX records) or other services on this domain, use **Option B** to avoid disrupting them. Option A transfers ALL DNS control to Vercel.

---

## Step 6: SSL Certificate

Vercel automatically provisions a **free SSL certificate** (Let's Encrypt) once DNS propagates. No action needed — HTTPS will work within minutes.

---

## Step 7: Verify Deployment

After DNS propagation (typically 5-30 minutes, up to 48 hours):

- [ ] `https://sentroxai.com` loads correctly
- [ ] `https://www.sentroxai.com` redirects to apex domain
- [ ] HTTPS padlock shows valid certificate
- [ ] All pages load (dashboard, blog, admin, etc.)
- [ ] Supabase connections work (login, data fetching)
- [ ] Email sending works (contact form, etc.)

---

## Ongoing: Auto-Deploy

Once connected, **every push to `main`** on GitHub will automatically trigger a new Vercel deployment. Preview deployments are created for pull requests.
