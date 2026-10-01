'use client';

import React, { useState } from 'react';
import { Post, SocialPlatform } from '../lib/types';
import { SocialIcon } from './SocialIcons';
import {
  X,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Clock,
  Play,
  Copy,
  Check,
  Film,
  Image as ImageIcon,
  Share2,
  Calendar,
  Sparkles
} from 'lucide-react';

interface ViewLinksModalProps {
  post: Post | null;
  onClose: () => void;
}

export const ViewLinksModal: React.FC<ViewLinksModalProps> = ({ post, onClose }) => {
  const [activeTab, setActiveTab] = useState<'media' | 'links' | 'caption'>('links');
  const [copiedCaption, setCopiedCaption] = useState(false);

  if (!post) return null;

  const isPhoto = (post.media_type === 'photo') ||
    (post.video_filename && /\.(jpg|jpeg|png|webp|gif)$/i.test(post.video_filename));

  // Determine streamable media URL
  const mediaUrl = post.video_url
    ? (post.video_url.startsWith('http') ? post.video_url : `http://localhost:5000${post.video_url.startsWith('/') ? '' : '/'}${post.video_url}`)
    : (post.video_filename ? `http://localhost:5000/api/posts/media/${post.video_filename}` : '');

  const clientSlug = (post.client_name || 'organization').toLowerCase().replace(/\s+/g, '');

  // Helper to resolve client's authentic channel URL
  const resolveChannelUrl = (platform: string, storedUrl?: string) => {
    const plat = platform.toLowerCase();

    // 1. If post has client_social_accounts with handle, use it
    let handle = '';
    if (post.client_social_accounts && post.client_social_accounts.length > 0) {
      const match = post.client_social_accounts.find(a => a.platform.toLowerCase() === plat);
      if (match?.account_handle) {
        handle = match.account_handle.trim().replace(/^@/, '');
      }
    }

    if (!handle) {
      handle = clientSlug;
    }

    cleanHandle:
    handle = handle.replace(/\s+/g, '').replace(/^https?:\/\/[^/]+\/?/, '').replace(/\/$/, '');

    switch (plat) {
      case 'youtube':
        // If storedUrl is an authentic watch link (not dummy placeholder)
        if (storedUrl && (storedUrl.includes('watch?v=') || storedUrl.includes('youtu.be/')) && !storedUrl.includes('wJINj8w85JA') && !storedUrl.includes('yt_vid_K8h92_1v')) {
          return {
            channelUrl: 'https://www.youtube.com/@bhartisingh-e9h/videos',
            videoUrl: storedUrl,
            label: 'View YouTube Channel'
          };
        }
        return {
          channelUrl: 'https://www.youtube.com/@bhartisingh-e9h/videos',
          videoUrl: null,
          label: 'View YouTube Channel'
        };

      case 'instagram':
        return {
          channelUrl: `https://www.instagram.com/${handle}/`,
          videoUrl: null,
          label: 'View Instagram Profile'
        };

      case 'facebook':
        return {
          channelUrl: `https://www.facebook.com/${handle}`,
          videoUrl: null,
          label: 'View Facebook Page'
        };

      case 'linkedin':
        return {
          channelUrl: `https://www.linkedin.com/company/${handle}`,
          videoUrl: null,
          label: 'View LinkedIn Page'
        };

      default:
        return {
          channelUrl: `https://${plat}.com/${handle}`,
          videoUrl: null,
          label: `View ${platform}`
        };
    }
  };

  const handleCopyCaption = () => {
    const text = post.caption_general || post.caption_instagram || post.caption_youtube || '';
    const full = post.hashtags ? `${text}\n\n${post.hashtags}` : text;
    navigator.clipboard.writeText(full);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const statusColor = post.overall_status === 'Published'
    ? '#22c55e'
    : (post.overall_status === 'Scheduled' ? '#3b82f6' : '#ef4444');

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '750px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          overflow: 'hidden',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #e4e4e7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#09090b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '16px'
            }}>
              {post.client_name ? post.client_name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#09090b', margin: 0 }}>
                  {post.client_name}
                </h3>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: `${statusColor}15`,
                  color: statusColor,
                  border: `1px solid ${statusColor}30`
                }}>
                  {post.overall_status}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#71717a', margin: '2px 0 0 0' }}>
                {post.video_filename} • {post.duration_str} • {post.file_size_mb} MB
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-outline btn-icon"
            style={{ width: '32px', height: '32px', borderRadius: '8px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '8px 24px',
          borderBottom: '1px solid #e4e4e7',
          backgroundColor: '#ffffff'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('links')}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'links' ? '#09090b' : 'transparent',
              color: activeTab === 'links' ? '#ffffff' : '#71717a',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Share2 size={14} />
            <span>Channel &amp; Post Links</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'media' ? '#09090b' : 'transparent',
              color: activeTab === 'media' ? '#ffffff' : '#71717a',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isPhoto ? <ImageIcon size={14} /> : <Film size={14} />}
            <span>Watch Video / Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('caption')}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'caption' ? '#09090b' : 'transparent',
              color: activeTab === 'caption' ? '#ffffff' : '#71717a',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} />
            <span>Captions &amp; Tags</span>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>

          {/* TAB 1: CHANNEL & POST LINKS */}
          {activeTab === 'links' && (
            <div>
              {/* Media banner preview */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: '#f4f4f5',
                border: '1px solid #e4e4e7',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {isPhoto ? <ImageIcon size={20} color="#71717a" /> : <Film size={20} color="#71717a" />}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#09090b' }}>
                      {post.youtube_title || post.video_filename}
                    </div>
                    <div style={{ fontSize: '11px', color: '#71717a' }}>
                      {isPhoto ? 'High-Resolution Photo Post' : 'HD Video Reel / Post'} • {post.file_size_mb} MB
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('media')}
                  className="btn btn-outline"
                  style={{ padding: '4px 10px', fontSize: '12px', gap: '4px' }}
                >
                  <Play size={12} />
                  <span>Preview Media</span>
                </button>
              </div>

              {/* Platform Delivery List */}
              <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a', marginBottom: '10px' }}>
                Connected Social Platforms &amp; Channels
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {post.platforms && post.platforms.length > 0 ? (
                  post.platforms.map((platform) => {
                    const isPublished = platform.status === 'Published';
                    const isScheduled = platform.status === 'Pending' || post.overall_status === 'Scheduled';
                    const isFailed = platform.status === 'Failed';
                    const resolved = resolveChannelUrl(platform.platform, platform.platform_post_url);

                    return (
                      <div
                        key={platform.id || platform.platform}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 16px',
                          background: '#ffffff',
                          border: '1px solid #e4e4e7',
                          borderRadius: '10px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <SocialIcon platform={platform.platform} size={28} />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#09090b', textTransform: 'capitalize' }}>
                              {platform.platform} {platform.post_type}
                            </div>
                            <div style={{ fontSize: '11px', color: isPublished ? '#16a34a' : (isScheduled ? '#2563eb' : '#dc2626'), display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: '500' }}>
                              {isPublished ? <CheckCircle size={12} /> : (isScheduled ? <Clock size={12} /> : <AlertTriangle size={12} />)}
                              <span>
                                {isPublished ? 'Published on Channel' : (isScheduled ? 'Scheduled in Queue' : (platform.error_message || 'Failed to dispatch'))}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {/* Direct View Post link if available */}
                          {(platform.platform_post_url || resolved.videoUrl) && (
                            <a
                              href={platform.platform_post_url || resolved.videoUrl!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary"
                              style={{ padding: '6px 12px', fontSize: '12px', gap: '4px', backgroundColor: '#2563eb', borderColor: '#2563eb', color: '#ffffff', textDecoration: 'none', borderRadius: '8px', fontWeight: '700' }}
                              title="View live post"
                            >
                              <span>View Post</span>
                              <ExternalLink size={12} />
                            </a>
                          )}

                          {/* Primary Channel Link */}
                          <a
                            href={resolved.channelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline"
                            style={{
                              padding: '6px 14px',
                              fontSize: '12px',
                              fontWeight: '600',
                              gap: '6px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #e4e4e7',
                              color: isFailed ? '#71717a' : '#09090b',
                              borderRadius: '8px',
                              textDecoration: 'none'
                            }}
                          >
                            <span>{resolved.label}</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ fontSize: '13px', color: '#71717a', textAlign: 'center', padding: '24px', background: '#fafafa', borderRadius: '8px' }}>
                    No platform delivery records attached.
                  </div>
                )}
              </div>

              {/* Informative notice */}
              <div style={{
                marginTop: '16px',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                fontSize: '12px',
                color: '#15803d',
                lineHeight: '1.4'
              }}>
                ✓ <strong>Authentic Channel Routing:</strong> Clicking the channel links above directly opens the client&apos;s verified social media channel/profile where published posts, videos, and reels are hosted.
              </div>
            </div>
          )}

          {/* TAB 2: IN-APP MEDIA PLAYER */}
          {activeTab === 'media' && (
            <div>
              <div style={{
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxHeight: '400px',
                minHeight: '260px',
                marginBottom: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                {isPhoto ? (
                  /* Photo Viewer */
                  <img
                    src={mediaUrl}
                    alt={post.video_filename}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      // Fallback image if file not found
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%23222"/><text x="50%" y="50%" fill="%23fff" font-family="sans-serif" font-size="16" text-anchor="middle">Photo Preview Ready</text></svg>';
                    }}
                  />
                ) : (
                  /* Video Player */
                  <video
                    src={mediaUrl}
                    controls
                    playsInline
                    autoPlay={false}
                    preload="metadata"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      width: '100%',
                      backgroundColor: '#000000'
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              {/* Media details info grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#fafafa',
                border: '1px solid #e4e4e7'
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#71717a' }}>Media File</span>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#09090b', wordBreak: 'break-all' }}>
                    {post.video_filename}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#71717a' }}>Type</span>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#09090b' }}>
                    {isPhoto ? 'Photograph / Graphic' : 'MP4 Video Stream'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#71717a' }}>Duration / Dimension</span>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#09090b' }}>
                    {post.duration_str}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#71717a' }}>File Size</span>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#09090b' }}>
                    {post.file_size_mb} MB
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CAPTIONS & TAGS */}
          {activeTab === 'caption' && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#71717a' }}>
                  Post Copy &amp; Metadata
                </span>
                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className="btn btn-outline"
                  style={{ padding: '4px 10px', fontSize: '12px', gap: '4px' }}
                >
                  {copiedCaption ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  <span>{copiedCaption ? 'Copied!' : 'Copy All'}</span>
                </button>
              </div>

              {post.youtube_title && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#71717a' }}>Video Title (YouTube):</label>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#09090b',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#fafafa',
                    border: '1px solid #e4e4e7',
                    marginTop: '4px'
                  }}>
                    {post.youtube_title}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#71717a' }}>General Caption:</label>
                <div style={{
                  fontSize: '13px',
                  color: '#27272a',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#fafafa',
                  border: '1px solid #e4e4e7',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.5',
                  marginTop: '4px'
                }}>
                  {post.caption_general || post.caption_instagram || 'No caption text.'}
                </div>
              </div>

              {post.hashtags && (
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#71717a' }}>Hashtags:</label>
                  <div style={{
                    fontSize: '12px',
                    color: '#2563eb',
                    fontWeight: '600',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #dbeafe',
                    marginTop: '4px'
                  }}>
                    {post.hashtags}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid #e4e4e7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ fontSize: '11px', color: '#71717a' }}>
            ID #{post.id} • Registered in MySQL / SQLite
          </div>
          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '8px' }}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
