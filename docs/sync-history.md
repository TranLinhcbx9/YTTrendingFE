# Sync history UX

## Routes

| Route                | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| /sync-history        | Browse sync runs, filter the history, and start a global sync. |
| /sync-history/:runId | Observe one run, its per-channel result, and its errors.       |

## History filters

The history supports status, source, and time-range filters. **Custom range**
uses Material datepickers for **From** and **To**:

- Both dates are required before the custom filter is sent.
- **To** cannot be later than today; **From** also cannot be in the future.
- Once one side is selected, the other calendar only offers dates that keep
  `From <= To`.
- The selected calendar date is serialized without a timezone shift: `From`
  uses the beginning of that UTC date and `To` its end.

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

The landing page reads its paged history from `GET /api/jobs`; it sends the
selected status/source/time-range or custom `from`/`to` query parameters. Run
creation, summary, and item detail use the SyncRun endpoints documented in
[`api-contract.md`](api-contract.md).
