/** Response from POST /api/channels/{id}/sync. */
export interface SyncChannelResult {
  fetchedShortsCount: number;
  qualifiedShortsCount: number;
  newlyTrackedCount: number;
  existingVideosRefreshedCount: number;
  archivedVideosCount: number;
}
