# Baseline regression tests

These tests cover existing successful behavior without changing application code.

## Run

Use Node.js 20 or newer for this isolated test harness. The application's existing
runtime declaration is unchanged.

```sh
npm --prefix tests ci
npm test
```

The test harness has its own dependencies and lockfile. Installing the frontend
or backend application dependencies is not required for this suite.
Mongoose, Redux Toolkit, and Axios match the versions in the application's existing
lockfiles; this suite does not upgrade application dependencies.

Backend tests call the real event controllers and Mongoose models against a
temporary, single-node MongoDB replica set. They never load the application server,
database configuration, or environment files. MongoDB 7.0.14 is downloaded on the
first run and cached; subsequent runs can use that cached binary offline. An offline
container must provision this binary and dependencies during image construction.

Cloudinary is mocked. Frontend tests run the real service and Redux event slice
with mocked Axios and in-memory local storage. No production database, image
uploads, provider credentials, or live application requests are used.

## Coverage

- Event creation, normal joining and leaving, owner edits and image replacement.
- Successful deletion and removal of affected memberships, preserving unrelated data.
- Detail, profile, hosted-event, browse, and ranked-home results.
- Frontend API payloads, authentication headers, successful state/cache updates,
  and propagation of rejected join/leave requests at the service/state layer.

## Limits

This is a passing baseline, not a complete correctness evaluation. It does not yet
cover duplicate requests, concurrent last-seat claims, partial-write recovery,
unauthorized mutations, capacity reductions, or stale responses. Those scenarios
need a separate failing-before/fixed-after suite. It does not render React pages,
exercise Express routing/authentication, or prove browser-level error recovery.

The historical frontend `App.test.js` is outside this suite. Running the frontend's
own test command remains separate; these results do not imply that suite passes.

Tests assert observable behavior and persistence. API service tests additionally
protect existing URL and payload contracts. Do not treat passing these tests alone
as evidence that attendance consistency defects have been resolved.

On Windows, the temporary replica set may log `ECONNRESET` while shutting down
after tests finish. Check the final test summary and exit status; this warning is
not an assertion failure. The existing Mongoose version also logs a `strictQuery`
deprecation warning. Neither warning is suppressed by the harness.
