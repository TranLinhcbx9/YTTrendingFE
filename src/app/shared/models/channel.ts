export interface Channel {
  id: number;
  youtubeChannelId: string;
  name: string;
  url: string;
  isEnabled: boolean;
  lastSyncAt: string | null;
  createdAt: string;
}
