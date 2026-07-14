# 02 — Tasks

- [ ] In `GET /api/slots` (`server/index.ts`), remove the `today` date-prefix
      variable.
- [ ] Replace the filter with an instant comparison:
      `new Date(s.startsAt).getTime() > Date.now()`.
- [ ] Keep the `taken` mapping unchanged.
- [ ] Add a test in `server/index.test.ts` asserting every returned slot's
      `startsAt` is strictly in the future.
- [ ] Run `npm test` and confirm all tests pass.
- [ ] Update status in `spec/README.md`.
