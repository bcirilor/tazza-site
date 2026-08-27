# Tazza, company website

Website for a visual communication company (neon LED signage, ACM facades, 3D
lettering, decals and printing). Real application, in production. The goal is not to
inform: it is to turn a visit into a WhatsApp conversation with the lead already
qualified.

> **This repository is an excerpt.** The full application is private. What is here is
> `samples/`, four files that carry the decisions described below, plus the commits
> that produced them. It does not build or run on its own.

**Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, Supabase, Vercel.

## Defensive lead capture

`samples/leads-route.ts` (from `app/api/leads/route.ts`) stacks four layers:

- rate limit per IP (`x-forwarded-for`, 30s window) returning 429, in
  `samples/rate-limit.ts`;
- **honeypot**, a hidden field a bot fills and a human does not. If it comes back
  filled, the response is `200 ok` and nothing is stored, so the bot never learns it
  was blocked;
- strict validation, name between 2 and 80 characters and product checked against an
  allowlist instead of free text;
- optional phone, accepted only in Brazilian E.164 (`+55` plus 10 or 11 digits),
  normalized in `samples/phone.ts`.

One small decision keeps sales from being lost: the insert tries to write the phone
and, if the `phone` column does not exist in the database yet, it redoes the insert
without that field rather than failing. A late migration should not cost a lead.

## Neon simulator

`samples/NeonSimulator.tsx` renders a sign in SVG with a glow filter applied in real
time, using 8 real neon LED colors (warm white, cool white, blue, cyan, orange, red,
yellow, pink). Each one carries its own glow triple, swatch and background color. The
visitor sees the effect before asking for a quote, which persuades better than a
color table.

## License

All rights reserved. See [LICENSE](LICENSE). Published to be read and reviewed, not
reused.
