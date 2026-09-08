# Sync history UX

## Routes

| Route | Purpose |
| --- | --- |
| /sync-history | Browse global sync runs and start a new one. |
| /sync-history/:runId | Observe one run, its per-channel result, and its errors. |

## Final global sync flow

1. User selects **Sync all** on Sync history.
2. The backend creates exactly one SyncRun.
3. On success, the UI immediately navigates to /sync-history/:runId.
4. Sync run detail is the only place for live progress, per-channel outcomes,
   errors, and the terminal summary. Poll or refresh until a terminal
   status is returned.
5. While an active run exists, Sync history disables **Sync all** and exposes
   **View active run**. If a create request conflicts and returns an active run
   ID, navigate to it; otherwise show the mapped 409 state.

## Channels boundary

Channels is limited to channel management and the existing per-channel Sync
action. It never shows global batch-run progress, batch results, or batch
errors.

## Backend dependency

The current API contract contains only POST /api/channels/{id}/sync for one
channel. Do not implement this feature until the API documents SyncRun create,
history list, run detail, statuses, and the active-run conflict response.
