# Deskly — front desk software for small clinics

Next.js 15 · React 19 · Tailwind 3. All data is simulated (in-memory store, resets on server restart).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Areas
| Route | What it is |
|---|---|
| `/` | Landing page / demo entry |
| `/book/*` | Patient booking (service → clinician → time → details → intake → consent → deposit → confirmation), `/book/manage/:id` to reschedule or cancel |
| `/staff/day`, `/week`, `/payments`, `/reminders` | Front desk |
| `/onboarding/*` | 7-step clinic setup wizard |
| `/design` | Living style guide of the UI kit |

## Design system
- Tokens: `tailwind.config.ts` (`brand-*` teal scale, `ink`, semantic `ok/warn/danger/info`), standard Tailwind spacing.
- Kit: `src/components/ui/*` (Button, Input, Select, Switch, Modal/Drawer as bottom sheets on phones, Tabs/Segmented, StatCard, Avatar, Toasts, Stepper …).
- Demo "today" is pinned to 5 Nov 2026 (`DEMO_TODAY` in `src/lib/utils.ts`) to match the seed data.
