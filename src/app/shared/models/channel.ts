export interface Channel {
  id: number;
  youtubeChannelId: string;
  name: string;
  url: string;
  uploadsPlaylistId: string | null;
  isEnabled: boolean;
  lastSyncAt: string | null;
  createdAt: string;
}
