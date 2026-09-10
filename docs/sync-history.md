# Sync history UX

## Routes

| Route | Purpose |
| --- | --- |
| /sync-history | Start a global sync. History browsing waits for a server list endpoint. |
| /sync-history/:runId | Observe one run, its per-channel result, and its errors. |

## Final global sync flow

1. User selects **Sync all** on Sync history.
2. The backend creates exactly one SyncRun.
3. On success, the UI immediately navigates to /sync-history/:runId.
4. Sync run detail is the only place for live progress, per-channel outcomes,
   errors, and the terminal summary. Poll or refresh until a terminal
   status is returned.
5. If create conflicts, Sync history shows the mapped `409` state. The current
   contract does not return an active run ID, so it does not expose a fake
   **View active run** action.

## Channels boundary

Channels is limited to channel management and the existing per-channel Sync
action. It never shows global batch-run progress, batch results, or batch
errors.

## Backend dependency

Batch 1–3 documents `POST /api/jobs/sync`, run summary, and paged run items,
so the launcher and run detail are implemented. `GET /api/jobs/sync` (history
list), its filters, and an active-run lookup are still absent; keep the landing
page start-only until those endpoints exist.
