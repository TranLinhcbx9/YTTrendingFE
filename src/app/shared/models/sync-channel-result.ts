/** Response from POST /api/channels/{id}/sync. */
export interface SyncChannelResult {
  fetchedShortsCount: number;
  qualifiedShortsCount: number;
  /** Videos newly discovered during this sync, initially in the `New` state. */
  newlyDiscoveredCount: number;
  /** Videos transitioned from `New` to `Tracking` during this sync. */
  newlyTrackedCount: number;
  existingVideosRefreshedCount: number;
  archivedVideosCount: number;
}
