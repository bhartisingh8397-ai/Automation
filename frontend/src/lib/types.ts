export type SocialPlatform = 'instagram' | 'facebook' | 'youtube' | 'linkedin';

export interface SocialAccount {
  id: number;
  client_id: number;
  platform: SocialPlatform;
  account_name: string;
  account_handle?: string;
  page_id?: string;
  is_connected: boolean;
  created_at?: string;
}

export interface Client {
  id: number;
  name: string;
  business_type: string;
  logo_url?: string;
  social_accounts: SocialAccount[];
  created_at?: string;
}

export interface PostPlatform {
  id: number;
  post_id: number;
  platform: SocialPlatform;
  post_type: string;
  status: 'Pending' | 'Published' | 'Failed';
  platform_post_id?: string;
  platform_post_url?: string;
  error_message?: string;
  published_at?: string;
}

export interface AutomationLog {
  id: number;
  post_id?: number;
  step_number: number;
  step_name: string;
  status: 'info' | 'success' | 'warning' | 'error';
  message: string;
  created_at?: string;
}

export interface Post {
  id: number;
  client_id: number;
  client_name: string;
  video_filename: string;
  video_url: string;
  thumbnail_url?: string;
  file_size_mb: number;
  duration_str: string;
  media_type?: 'video' | 'photo';
  caption_general?: string;
  caption_instagram?: string;
  caption_facebook?: string;
  caption_youtube?: string;
  caption_linkedin?: string;
  youtube_title?: string;
  hashtags?: string;
  schedule_type: 'now' | 'later';
  scheduled_at: string;
  timezone: string;
  overall_status: 'Scheduled' | 'Published' | 'Partially Failed' | 'Failed' | 'Processing' | 'Cancelled';
  created_at?: string;
  platforms: PostPlatform[];
  client_social_accounts?: SocialAccount[];
}

export interface DatabaseInfo {
  engine: string;
  connected: boolean;
  database: string;
  host: string;
  port: number;
  user: string;
  fallback_to_sqlite: boolean;
  message: string;
}

export interface SystemStatus {
  status: string;
  app_name: string;
  database: DatabaseInfo;
  team_user: {
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
}
