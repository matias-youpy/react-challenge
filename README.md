# Booking widget

Small appointment-booking widget. Express + React, TypeScript end-to-end.

## Run

```bash
npm install
npm run dev:server    # in one terminal — starts the API on :3000
npm run dev:client    # in another — starts the React app on :5173 (proxies /api -> :3000)
```

Open http://localhost:5173

## Testing

```bash
npm test          # runs both suites (server tests need the API running)
npm run test:server
npm run test:client
```

## What's known broken

The following issues were reported or found during review:

1. Sometimes the same time slot ends up double-booked (two confirmation emails for the same slot).
2. The list of available slots sometimes shows times that are clearly in the past.
3. The booking confirmation shows the wrong time for users in different timezones than the office.
4. The confirm form's optimistic "Booked" update didn't render reliably and wasn't rolled back when a booking failed.

There may be more. Find what you can.

## Development approach — spec-driven (SDD)

Fixes are tracked in the [`spec/`](./spec) folder using a spec-driven workflow.
Each issue gets its own subfolder with three documents:

- `spec.md` — **what & why**: problem, current vs. expected behavior, acceptance criteria.
- `plan.md` — **how**: technical approach, affected files, edge cases, testing strategy.
- `tasks.md` — the ordered implementation/verification checklist.

```
spec/
├── README.md                  # index + status table + workflow
├── 01-double-booking-race/    # spec.md · plan.md · tasks.md
├── 02-past-slots-filtering/
├── 03-timezone-display/
└── 04-optimistic-update/
```

See [`spec/README.md`](./spec/README.md) for the status of each issue.
