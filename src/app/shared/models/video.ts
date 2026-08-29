/** Matches backend `VideoDto` 1:1 (`Features/Videos/Dtos/VideoDto.cs`). */
export type VideoStatus = 'New' | 'Tracking' | 'Archived';

/** Status labels — single source for `StatusChip` and the filter dropdown. */
export const VIDEO_STATUS_LABELS: Record<VideoStatus, string> = {
  New: 'New',
  Tracking: 'Tracking',
  Archived: 'Archived',
};

export interface Video {
  id: number;
  youtubeVideoId: string;
  channelId: number;
  channelName: string;
  title: string;
  publishedAt: string;
  durationSeconds: number;
  thumbnailUrl: string | null;
  status: VideoStatus;
  latestViews: number;
  latestLikes: number;
  latestComments: number;
}
