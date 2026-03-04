export type PlatformKey =
  | "reddit"
  | "twitter"
  | "facebook"
  | "linkedin"
  | "instagram"
  | "tiktok";

export interface Post {
  id: string;
  content: string;
  platform: PlatformKey;
  index: number;
}

export interface PlatformConfig {
  key: PlatformKey;
  name: string;
  color: string;
  bgColor: string;
  icon: string; // emoji fallback
  charLimit?: number;
}

export interface GenerateResponse {
  [key: string]: Post[];
}

