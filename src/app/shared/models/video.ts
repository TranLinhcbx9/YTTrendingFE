/** Khớp 1:1 `VideoDto` của backend (`Features/Videos/Dtos/VideoDto.cs`). */
export type VideoStatus = 'New' | 'Tracking' | 'Archived';

/** Nhãn tiếng Việt của status — 1 nguồn duy nhất cho `StatusChip` và ô filter. */
export const VIDEO_STATUS_LABELS: Record<VideoStatus, string> = {
  New: 'Mới',
  Tracking: 'Đang theo dõi',
  Archived: 'Lưu trữ',
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
