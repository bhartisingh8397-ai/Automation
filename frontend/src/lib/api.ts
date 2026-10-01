import { Client, Post, SystemStatus, AutomationLog } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  async getStatus(): Promise<SystemStatus> {
    const res = await fetch(`${API_BASE}/auth/status`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch system status');
    return res.json();
  },

  async getClients(): Promise<Client[]> {
    const res = await fetch(`${API_BASE}/clients`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch clients');
    return res.json();
  },

  async createClient(name: string, business_type: string, social_links?: { facebook?: string; instagram?: string; youtube?: string; linkedin?: string }): Promise<Client> {
    const res = await fetch(`${API_BASE}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, business_type, social_links })
    });
    if (!res.ok) throw new Error('Failed to create client');
    return res.json();
  },

  async toggleAccount(clientId: number, platform: string): Promise<any> {
    const res = await fetch(`${API_BASE}/clients/${clientId}/accounts/${platform}/toggle`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to toggle account');
    return res.json();
  },

  async updateClientAccounts(clientId: number, social_links: Record<string, string>): Promise<Client> {
    const res = await fetch(`${API_BASE}/clients/${clientId}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ social_links })
    });
    if (!res.ok) throw new Error('Failed to update client accounts');
    return res.json();
  },

  async deleteClientAccount(clientId: number, platform: string): Promise<any> {
    const res = await fetch(`${API_BASE}/clients/${clientId}/accounts/${platform}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete account');
    return res.json();
  },


  async getPosts(): Promise<Post[]> {
    const res = await fetch(`${API_BASE}/posts`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  async createPost(payload: any): Promise<Post> {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  },

  async publishPost(postId: number): Promise<any> {
    const res = await fetch(`${API_BASE}/posts/${postId}/publish`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to publish post');
    return res.json();
  },

  async retryPost(postId: number): Promise<any> {
    const res = await fetch(`${API_BASE}/posts/${postId}/retry`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to retry post');
    return res.json();
  },

  async cancelPost(postId: number): Promise<any> {
    const res = await fetch(`${API_BASE}/posts/${postId}/cancel`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to cancel post');
    return res.json();
  },

  async deletePost(postId: number): Promise<any> {
    const res = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete post');
    return res.json();
  },

  async uploadVideo(file: File, duration: string = '1:30'): Promise<{ filename: string; file_size_mb: number; duration_str: string; video_url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('duration', duration);

    const res = await fetch(`${API_BASE}/posts/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload video');
    return res.json();
  },

  async generateAiCaption(topic: string, clientName: string, businessType: string): Promise<any> {
    const res = await fetch(`${API_BASE}/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, client_name: clientName, business_type: businessType })
    });
    if (!res.ok) throw new Error('Failed to generate AI caption');
    return res.json();
  },

  async getLogs(): Promise<AutomationLog[]> {
    const res = await fetch(`${API_BASE}/logs`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch logs');
    return res.json();
  },

  async getYouTubeStatus(): Promise<{
    configured: boolean;
    client_id: string;
    masked_client_id: string;
    api_key_configured: boolean;
    api_key_valid: boolean;
    api_key_error?: string | null;
    authenticated: boolean;
    channel?: { id: string; title: string; custom_url?: string; subscriber_count?: string } | null;
    redirect_uri: string;
    auth_url?: string;
  }> {
    const res = await fetch(`${API_BASE}/youtube/status`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch YouTube status');
    return res.json();
  },

  async testYouTube(): Promise<any> {
    const res = await fetch(`${API_BASE}/youtube/test`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to test YouTube connection');
    return res.json();
  },

  async disconnectYouTube(): Promise<any> {
    const res = await fetch(`${API_BASE}/youtube/disconnect`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to disconnect YouTube');
    return res.json();
  },

  async getMetaStatus(checkLive: boolean = false): Promise<{
    configured: boolean;
    app_id?: string;
    masked_app_id?: string;
    app_valid: boolean;
    app_name?: string;
    app_error?: string;
    authenticated: boolean;
    user?: { id: string; name: string };
    pages?: Array<{ id: string; name: string; category?: string }>;
    instagram_accounts?: Array<{ id: string; username: string; name?: string; page_id?: string }>;
    redirect_uri: string;
    auth_url?: string;
  }> {
    const res = await fetch(`${API_BASE}/meta/status?check_live=${checkLive}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch Meta status');
    return res.json();
  },

  async testMeta(): Promise<any> {
    const res = await fetch(`${API_BASE}/meta/test`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to test Meta connection');
    return res.json();
  },

  async disconnectMeta(): Promise<any> {
    const res = await fetch(`${API_BASE}/meta/disconnect`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to disconnect Meta');
    return res.json();
  }
};

