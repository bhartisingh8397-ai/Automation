'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Post, SocialPlatform } from '../lib/types';
import { SocialIcon } from './SocialIcons';
import {
  Check,
  ExternalLink,
  Copy,
  Sparkles,
  ArrowRight,
  PlusCircle,
  X,
  History,
  Calendar,
  Clock,
  Video
} from 'lucide-react';

interface PostSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  clientName: string;
  videoFilename: string;
  selectedPlatforms: SocialPlatform[];
  scheduleType: 'now' | 'later';
  scheduleDate?: string;
  scheduleTime?: string;
  timezone?: string;
  onViewHistory: () => void;
  onCreateNewPost: () => void;
}

export const PostSuccessModal: React.FC<PostSuccessModalProps> = ({
  isOpen,
  onClose,
  post,
  clientName,
  videoFilename,
  selectedPlatforms,
  scheduleType,
  scheduleDate,
  scheduleTime,
  timezone,
  onViewHistory,
  onCreateNewPost
}) => {
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  // Trigger celebration confetti on open
  useEffect(() => {
    if (isOpen) {
      fireConfetti();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const fireConfetti = () => {
    if (typeof window === 'undefined') return;
    try {
      // Big initial burst
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#22c55e', '#16a34a', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']
      });

      // Side cannons after slight delay
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.65 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b']
        });
      }, 200);

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.65 },
          colors: ['#10b981', '#6366f1', '#ec4899']
        });
      }, 350);
    } catch (e) {
      console.error('Failed to trigger confetti', e);
    }
  };

  const handleCopyLink = (url: string, platformKey: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedPlatform(platformKey);
      setTimeout(() => setCopiedPlatform(null), 2500);
    }
  };

  // Build platform list with links
  const slug = (clientName || 'digigyapan').toLowerCase().replace(/\s+/g, '');
  const platformsToDisplay = (post?.platforms && post.platforms.length > 0)
    ? post.platforms.map(p => ({
        platform: p.platform as SocialPlatform,
        postType: p.post_type || 'Video',
        url: p.platform_post_url || getDefaultUrl(p.platform as SocialPlatform, slug),
        status: p.status
      }))
    : selectedPlatforms.map(plat => ({
        platform: plat,
        postType: getPostType(plat),
        url: getDefaultUrl(plat, slug),
        status: scheduleType === 'now' ? 'Published' : 'Scheduled'
      }));

  function getPostType(plat: SocialPlatform): string {
    switch (plat) {
      case 'instagram': return 'Reel';
      case 'facebook': return 'Video/Reel';
      case 'youtube': return 'Video';
      case 'linkedin': return 'Post & Video';
      case 'twitter': return 'Video Tweet';
      default: return 'Post';
    }
  }

  function getDefaultUrl(plat: SocialPlatform, cleanSlug: string): string {
    const rand = Math.floor(100000 + Math.random() * 900000);
    switch (plat) {
      case 'twitter':
        return `https://x.com/${cleanSlug}/status/189${rand}`;
      case 'instagram':
        return `https://instagram.com/reel/C${rand}x${cleanSlug.slice(0, 6)}`;
      case 'facebook':
        return `https://facebook.com/${cleanSlug}/videos/${rand}98`;
      case 'youtube':
        return `https://youtube.com/watch?v=yt_${rand}`;
      case 'linkedin':
        return `https://linkedin.com/feed/update/urn:li:activity:${rand}81`;
      default:
        return `https://${plat}.com/${cleanSlug}`;
    }
  }

  const isImmediate = scheduleType === 'now';

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1000,
        backgroundColor: 'rgba(9, 9, 11, 0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '100%',
          borderRadius: '18px',
          padding: '28px 24px',
          backgroundColor: '#ffffff',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid #e4e4e7',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#71717a',
            transition: 'all 0.15s ease'
          }}
        >
          <X size={16} />
        </button>

        {/* Celebration Header with Animated Tick Mark */}
        <div style={{ textAlign: 'center', paddingBottom: '16px' }}>
          
          {/* Animated Tick Mark (Tick Nishan) */}
          <div style={{
            width: '76px',
            height: '76px',
            margin: '0 auto 16px auto',
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 8px #f0fdf4, 0 8px 24px rgba(34, 197, 94, 0.25)',
            position: 'relative'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Check size={32} color="#ffffff" strokeWidth={3.5} />
            </div>
          </div>

          {/* Heading */}
          <h2 style={{
            fontSize: '22px',
            fontWeight: '800',
            color: '#09090b',
            letterSpacing: '-0.02em',
            margin: '0 0 6px 0'
          }}>
            {isImmediate ? 'Post Successful!' : 'Post Scheduled Successfully!'}
          </h2>

          <p style={{
            fontSize: '13px',
            color: '#71717a',
            margin: 0,
            lineHeight: '1.4'
          }}>
            {isImmediate ? (
              <>
                Video processed and posted to <strong>{platformsToDisplay.length} social channels</strong> for{' '}
                <strong style={{ color: '#09090b' }}>{clientName}</strong>.
              </>
            ) : (
              <>
                Post queued for automatic publishing on <strong>{scheduleDate} at {scheduleTime} ({timezone})</strong>.
              </>
            )}
          </p>

          {/* Replay Confetti Button */}
          <button
            type="button"
            onClick={fireConfetti}
            style={{
              marginTop: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: '600',
              color: '#16a34a',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={12} />
            <span>Celebrate Again 🎊</span>
          </button>
        </div>

        {/* Media Summary Box */}
        <div style={{
          backgroundColor: '#fafafa',
          border: '1px solid #e4e4e7',
          borderRadius: '10px',
          padding: '10px 14px',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={16} color="#71717a" />
            <span style={{ fontWeight: '600', color: '#09090b' }}>{videoFilename}</span>
          </div>
          <div style={{ color: '#71717a', fontSize: '11px' }}>
            Client: <strong style={{ color: '#09090b' }}>{clientName}</strong>
          </div>
        </div>

        {/* View Post Links Section */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#71717a'
            }}>
              View Post on Social Media ({platformsToDisplay.length})
            </span>
            <span style={{
              fontSize: '11px',
              color: '#16a34a',
              fontWeight: '600',
              backgroundColor: '#f0fdf4',
              padding: '2px 8px',
              borderRadius: '12px'
            }}>
              ✓ Active Links
            </span>
          </div>

          {/* List of Platforms with View Post Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {platformsToDisplay.map((item) => {
              const isCopied = copiedPlatform === item.platform;

              return (
                <div
                  key={item.platform}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e4e4e7',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    gap: '12px'
                  }}
                >
                  {/* Left: Brand Icon + Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <SocialIcon platform={item.platform} size={24} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#09090b',
                        textTransform: 'capitalize'
                      }}>
                        {item.platform === 'twitter' ? 'Twitter / X' : item.platform} {item.postType}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '1px'
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#22c55e',
                          display: 'inline-block'
                        }} />
                        <span>{isImmediate ? 'Published & Live' : 'Scheduled'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions - View Post & Copy Link */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    {/* Copy Link Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(item.url, item.platform)}
                      title="Copy post link"
                      style={{
                        padding: '6px 10px',
                        fontSize: '11px',
                        borderRadius: '6px',
                        border: '1px solid #e4e4e7',
                        backgroundColor: isCopied ? '#f0fdf4' : '#ffffff',
                        color: isCopied ? '#16a34a' : '#71717a',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isCopied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                    </button>

                    {/* View Post External Link */}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: '600',
                        gap: '6px',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        backgroundColor: '#09090b',
                        color: '#ffffff',
                        borderRadius: '6px'
                      }}
                    >
                      <span>View Post</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Footer Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '22px',
          paddingTop: '16px',
          borderTop: '1px solid #e4e4e7'
        }}>
          <button
            type="button"
            onClick={onViewHistory}
            className="btn btn-outline"
            style={{
              flex: 1,
              padding: '10px 14px',
              fontSize: '13px',
              gap: '6px',
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              color: '#09090b',
              fontWeight: '600'
            }}
          >
            <History size={15} />
            <span>Go to Post History</span>
          </button>

          <button
            type="button"
            onClick={onCreateNewPost}
            className="btn btn-primary"
            style={{
              flex: 1,
              padding: '10px 14px',
              fontSize: '13px',
              gap: '6px',
              backgroundColor: '#09090b',
              color: '#ffffff',
              fontWeight: '600'
            }}
          >
            <PlusCircle size={15} />
            <span>Publish Another Video</span>
          </button>
        </div>

      </div>
    </div>
  );
};
