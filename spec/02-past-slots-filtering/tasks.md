# 02 — Tasks

- [x] In `GET /api/slots` (`server/index.ts`), remove the `today` date-prefix
      variable.
- [x] Replace the filter with an instant comparison:
      `new Date(s.startsAt).getTime() > Date.now()`.
- [x] Keep the `taken` mapping unchanged.
- [x] Add a test in `server/index.test.ts` asserting every returned slot's
      `startsAt` is strictly in the future.
- [x] Run `npm test` and confirm all tests pass.
- [x] Update status in `spec/README.md`.
