# Deployment Guide — Phase 2

This guide covers the steps you (the human) need to take after the agent generates these features. The code is in your repo; you need to push the SQL and edge function to Supabase.

---

## 1. Apply the SQL migration

The new schema is in `supabase-phase2.sql` at the project root.

**Option A — Supabase Dashboard (easiest):**
1. Open https://app.supabase.com → your project → **SQL Editor**
2. Click **New query**, paste the contents of `supabase-phase2.sql`
3. Click **Run**

**Option B — Supabase CLI:**
```bash
supabase db push --include-all
```

If you hit `constraint already exists` errors on re-run, drop the constraint with `ALTER TABLE <t> DROP CONSTRAINT <name>;` and re-run that block.

---

## 2. Deploy the contact-email edge function

```bash
# install the CLI if you haven't: https://supabase.com/docs/guides/cli
supabase login
supabase link --project-ref <your-project-ref>
supabase functions deploy send-contact-email --no-verify-jwt
```

Then set the secrets the function needs:

```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxx
supabase secrets set NOTIFY_TO_EMAIL=tejas.mellimpudi@gmail.com
supabase secrets set FROM_EMAIL="Portfolio <onboarding@resend.dev>"
```

- Get `RESEND_API_KEY` from https://resend.com (free tier: 3,000 emails/month).
- For testing, leave `FROM_EMAIL` as `onboarding@resend.dev`. For production, verify your domain in Resend and use `noreply@yourdomain.com`.

**Verify it works:** Submit the contact form on your site. You should:
1. See the message in `/admin/messages`
2. Receive an email at `NOTIFY_TO_EMAIL`
3. The sender receives an auto-reply

---

## 3. Custom domain (`tejas.dev` or similar)

This is a UI-only flow inside Lovable — no code:

1. **Project Settings → Domains** in Lovable
2. Either:
   - **Buy new domain** — search, purchase, auto-connected (paid plan)
   - **Connect Domain** — enter a domain you already own at another registrar
3. Follow the DNS instructions Lovable shows you (A record → `185.158.133.1`, TXT record)
4. SSL is auto-provisioned. Propagation can take up to 72h.

Once active, update your `index.html` canonical URL and the `Person.url` in your JSON-LD to the new domain.

---

## 4. Analytics

- Live at `/admin/analytics`.
- Events being tracked:
  - `page_view` — every homepage load
  - `project_click` — demo / GitHub clicks on project cards
  - `resume_download` — Download Resume button
  - `contact_submit` — successful form submission
  - `blog_click` — any blog card click
  - `social_click` — social icons in contact section
- Anonymized via random `session_id` in `localStorage`. No PII collected.

For more events, just call `trackEvent("custom_type", "label", { extra })` from anywhere.

---

## 5. Blog CMS

- Editor at `/admin/blog`.
- Each post has: title, slug (auto-generated from title), excerpt, cover image, rich-text content, publish toggle.
- Drafts (`published = false`) are hidden from the public site.
- Public post URLs are `/blog/<slug>`.
- The home BlogSection automatically switches from hardcoded fallback data to your DB posts once you publish your first one.

---

## ⚠️ Security todo (still open)

The agent skipped these per your request. Highly recommended before public launch:

1. **Disable open signups** in Supabase → Authentication → Settings.
2. Replace `auth.role() = 'authenticated'` policies with a `user_roles` + `has_role('admin')` check. Ask the agent to do this when you're ready.
