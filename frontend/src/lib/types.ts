export interface TrackData {
  id: string;
  title: string;
  artist: string;
  progress: number;
  tags: string[];
  hasUnreadMessage: boolean;
  hasFeedback: boolean;
}

export interface MessageData {
  sender: string;
  time: string;
  message?: string;
  track: string;
  isDJ?: boolean;
}