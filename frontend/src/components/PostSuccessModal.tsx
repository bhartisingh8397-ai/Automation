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
  X,
  History,
  PlusCircle,
  Video,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Loader2,
  Calendar,
  Clock
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
  onRetry?: (postId: number) => Promise<void>;
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
  onCreateNewPost,
  onRetry
}) => {
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [retrySuccess, setRetrySuccess] = useState<string | null>(null);

  const slug = (clientName || 'digigyapan').toLowerCase().replace(/\s+/g, '');
  const isImmediate = scheduleType === 'now';

  // Real YouTube Channel URL for Bharti Singh / Digigyapan
  const REAL_YOUTUBE_CHANNEL = 'https://www.youtube.com/@bhartisingh-e9h';

  // Helper to determine clean post type
  function getPostType(plat: SocialPlatform): string {
    switch (plat) {
      case 'instagram': return 'Reel';
      case 'facebook': return 'Video/Reel';
      case 'youtube': return 'Video';
      case 'linkedin': return 'Post & Video';
      default: return 'Post';
    }
  }

  // Safe URL generator that links to client's authentic channels
  function getAccountHandle(plat: SocialPlatform): string {
    if (post?.client_social_accounts && post.client_social_accounts.length > 0) {
      const match = post.client_social_accounts.find(a => a.platform.toLowerCase() === plat);
      if (match?.account_handle) {
        return match.account_handle.trim().replace(/^@/, '');
      }
    }
    return slug;
  }

  function resolvePlatformLink(plat: SocialPlatform, rawUrl?: string | null, status?: string): { url: string; label: string; isRealVideo: boolean } {
    const handle = getAccountHandle(plat).replace(/\s+/g, '').replace(/^https?:\/\/[^/]+\/?/, '').replace(/\/$/, '');

    // If rawUrl is provided by backend (e.g. from Meta, YouTube, or LinkedIn publish)
    if (rawUrl && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))) {
      return {
        url: rawUrl,
        label: `View Post`,
        isRealVideo: true
      };
    }

    if (plat === 'youtube') {
      return {
        url: `${REAL_YOUTUBE_CHANNEL}/videos`,
        label: 'View Post on YouTube',
        isRealVideo: false
      };
    }

    if (plat === 'instagram') {
      return {
        url: `https://www.instagram.com/${handle}/`,
        label: 'View Post on Instagram',
        isRealVideo: false
      };
    }

    if (plat === 'facebook') {
      return {
        url: `https://www.facebook.com/${handle}`,
        label: 'View Post on Facebook',
        isRealVideo: false
      };
    }

    if (plat === 'linkedin') {
      return {
        url: `https://www.linkedin.com/company/${handle}`,
        label: 'View Post on LinkedIn',
        isRealVideo: false
      };
    }

    return {
      url: `https://${plat}.com/${handle}`,
      label: `View Post on ${plat}`,
      isRealVideo: false
    };
  }

  // Build platform list
  const platformsToDisplay = (post?.platforms && post.platforms.length > 0)
    ? post.platforms.map(p => {
        const linkInfo = resolvePlatformLink(p.platform as SocialPlatform, p.platform_post_url, p.status);
        return {
          platform: p.platform as SocialPlatform,
          postType: p.post_type || getPostType(p.platform as SocialPlatform),
          url: linkInfo.url,
          buttonLabel: linkInfo.label,
          isRealVideo: linkInfo.isRealVideo,
          status: p.status,
          errorMessage: p.error_message
        };
      })
    : selectedPlatforms.map(plat => {
        const linkInfo = resolvePlatformLink(plat, null, scheduleType === 'now' ? 'Published' : 'Scheduled');
        return {
          platform: plat,
          postType: getPostType(plat),
          url: linkInfo.url,
          buttonLabel: linkInfo.label,
          isRealVideo: linkInfo.isRealVideo,
          status: scheduleType === 'now' ? 'Published' : 'Scheduled',
          errorMessage: undefined
        };
      });

  const anyFailed = platformsToDisplay.some(p => p.status === 'Failed');
  const allFailed = platformsToDisplay.length > 0 && platformsToDisplay.every(p => p.status === 'Failed');
  const allPublished = platformsToDisplay.length > 0 && platformsToDisplay.every(p => p.status === 'Published');
  const primaryPlatform = platformsToDisplay.find(p => p.status === 'Published' && p.url) || platformsToDisplay[0];
  const primaryPostUrl = primaryPlatform?.url;

  // Trigger confetti only when publish succeeded without complete failure
  useEffect(() => {
    if (isOpen && !allFailed) {
      fireConfetti();
    }
  }, [isOpen, allFailed]);

  if (!isOpen) return null;

  const fireConfetti = () => {
    if (typeof window === 'undefined') return;
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#22c55e', '#16a34a', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']
      });

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

  const handleInlineRetry = async () => {
    if (!post || !onRetry) return;
    try {
      setIsRetrying(true);
      setRetrySuccess(null);
      await onRetry(post.id);
      setRetrySuccess('Post retried successfully! Check updated status.');
      setTimeout(() => setRetrySuccess(null), 4000);
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1000,
        backgroundColor: 'rgba(9, 9, 11, 0.75)',
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
          maxWidth: '580px',
          width: '100%',
          borderRadius: '20px',
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

        {/* Dynamic Header State */}
        <div style={{ textAlign: 'center', paddingBottom: '16px' }}>
          
          {/* Animated Status Icon */}
          <div style={{
            width: '76px',
            height: '76px',
            margin: '0 auto 16px auto',
            borderRadius: '50%',
            backgroundColor: allFailed ? '#fee2e2' : (anyFailed ? '#fef3c7' : '#dcfce7'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: allFailed
              ? '0 0 0 8px #fef2f2, 0 8px 24px rgba(239, 68, 68, 0.25)'
              : (anyFailed
                ? '0 0 0 8px #fffbeb, 0 8px 24px rgba(245, 158, 11, 0.25)'
                : '0 0 0 8px #f0fdf4, 0 8px 24px rgba(34, 197, 94, 0.25)'),
            position: 'relative'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: allFailed ? '#ef4444' : (anyFailed ? '#f59e0b' : '#22c55e'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {allFailed ? (
                <AlertTriangle size={30} color="#ffffff" strokeWidth={2.5} />
              ) : (
                anyFailed ? (
                  <AlertCircle size={30} color="#ffffff" strokeWidth={2.5} />
                ) : (
                  <Check size={32} color="#ffffff" strokeWidth={3.5} />
                )
              )}
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
            {allFailed
              ? 'Publishing Encountered Errors'
              : (anyFailed
                ? 'Partially Published'
                : (isImmediate ? 'Post Successful & Live!' : 'Post Scheduled Successfully!'))
            }
          </h2>

          <p style={{
            fontSize: '13px',
            color: '#71717a',
            margin: 0,
            lineHeight: '1.4'
          }}>
            {allFailed ? (
              <>Social platforms could not be reached. Review the error details below and retry.</>
            ) : (
              anyFailed ? (
                <>Some channels were published successfully, while others encountered errors. You can retry failed platforms below.</>
              ) : (
                isImmediate ? (
                  <>Video processed and posted to <strong>{platformsToDisplay.length} social channels</strong> for <strong style={{ color: '#09090b' }}>{clientName}</strong>.</>
                ) : (
                  <>Post queued for automatic publishing on <strong>{scheduleDate} at {scheduleTime} ({timezone})</strong>.</>
                )
              )
            )}
          </p>

          {/* Hero Action: View Post Button */}
          {primaryPostUrl && !allFailed && (
            <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <a
                href={primaryPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#09090b',
                  color: '#ffffff',
                  padding: '11px 24px',
                  borderRadius: '12px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.15s ease'
                }}
              >
                <ExternalLink size={16} />
                <span>View Post ({primaryPlatform.platform.toUpperCase()})</span>
              </a>

              <button
                type="button"
                onClick={fireConfetti}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '11px 16px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  color: '#16a34a',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={14} />
                <span>Celebrate 🎊</span>
              </button>
            </div>
          )}

          {/* Retry Success Banner */}
          {retrySuccess && (
            <div style={{
              marginTop: '12px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#16a34a',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              ✓ {retrySuccess}
            </div>
          )}
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

        {/* Media Preview Box */}
        {post?.video_url && (
          <div style={{
            marginBottom: '16px',
            borderRadius: '10px',
            overflow: 'hidden',
            backgroundColor: '#09090b',
            maxHeight: '180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {(post.media_type === 'photo' || /\.(jpg|jpeg|png|webp|gif)$/i.test(videoFilename)) ? (
              <img
                src={post.video_url.startsWith('http') ? post.video_url : `http://localhost:5000${post.video_url.startsWith('/') ? '' : '/'}${post.video_url}`}
                alt={videoFilename}
                style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain' }}
              />
            ) : (
              <video
                src={post.video_url.startsWith('http') ? post.video_url : `http://localhost:5000${post.video_url.startsWith('/') ? '' : '/'}${post.video_url}`}
                controls
                playsInline
                style={{ maxHeight: '180px', maxWidth: '100%', width: '100%' }}
              />
            )}
          </div>
        )}

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
              Social Channels ({platformsToDisplay.length})
            </span>
            <span style={{
              fontSize: '11px',
              color: allPublished ? '#16a34a' : (anyFailed ? '#d97706' : '#2563eb'),
              fontWeight: '600',
              backgroundColor: allPublished ? '#f0fdf4' : (anyFailed ? '#fef3c7' : '#eff6ff'),
              padding: '2px 8px',
              borderRadius: '12px'
            }}>
              {allPublished ? '✓ All Published' : (anyFailed ? '⚠ Review Status' : '📅 Scheduled')}
            </span>
          </div>

          {/* List of Platforms with Verified Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {platformsToDisplay.map((item) => {
              const isCopied = copiedPlatform === item.platform;
              const isFailed = item.status === 'Failed';
              const isScheduled = item.status === 'Scheduled' || (!isImmediate && item.status !== 'Published');

              return (
                <div
                  key={item.platform}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: isFailed ? '#fff5f5' : '#ffffff',
                    border: isFailed ? '1px solid #fecaca' : '1px solid #e4e4e7',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    gap: '8px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    {/* Left: Brand Icon + Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <SocialIcon platform={item.platform} size={26} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '700',
                          color: '#09090b',
                          textTransform: 'capitalize'
                        }}>
                          {item.platform} {item.postType}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: isFailed ? '#dc2626' : (isScheduled ? '#d97706' : '#16a34a'),
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          marginTop: '2px',
                          fontWeight: '500'
                        }}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: isFailed ? '#ef4444' : (isScheduled ? '#f59e0b' : '#22c55e'),
                            display: 'inline-block'
                          }} />
                          <span>
                            {isFailed
                              ? 'Upload Failed'
                              : (isScheduled
                                ? `Scheduled for ${scheduleDate || 'Selected Time'}`
                                : 'Published & Live')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      {/* Copy Link Button (only if not failed) */}
                      {!isFailed && (
                        <button
                          type="button"
                          onClick={() => handleCopyLink(item.url, item.platform)}
                          title="Copy social link"
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
                      )}

                      {/* If Failed, show Retry Button */}
                      {isFailed && onRetry && post && (
                        <button
                          type="button"
                          disabled={isRetrying}
                          onClick={handleInlineRetry}
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '700',
                            borderRadius: '6px',
                            border: '1px solid #f87171',
                            backgroundColor: '#fee2e2',
                            color: '#b91c1c',
                            cursor: isRetrying ? 'wait' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          {isRetrying ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              <span>Retrying...</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw size={12} />
                              <span>Retry Upload</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* View Post / Channel External Link */}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{
                          padding: '7px 14px',
                          fontSize: '12px',
                          fontWeight: '700',
                          gap: '6px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          backgroundColor: isFailed ? '#71717a' : '#09090b',
                          color: '#ffffff',
                          borderRadius: '8px',
                          boxShadow: isFailed ? 'none' : '0 2px 6px rgba(0,0,0,0.12)'
                        }}
                      >
                        <span>{item.buttonLabel || 'View Post'}</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>

                  {/* Failure reason notice */}
                  {isFailed && item.errorMessage && (
                    <div style={{
                      fontSize: '11px',
                      color: '#b91c1c',
                      backgroundColor: '#fef2f2',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      marginTop: '2px',
                      lineHeight: '1.3'
                    }}>
                      Error: {item.errorMessage}
                    </div>
                  )}

                  {/* Scheduled note */}
                  {isScheduled && item.platform === 'youtube' && (
                    <div style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      backgroundColor: '#f9fafb',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      marginTop: '2px'
                    }}>
                      ℹ️ Video will go live on YouTube channel at scheduled time.
                    </div>
                  )}
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
          borderTop: '1px solid #e4e4e7',
          flexWrap: 'wrap'
        }}>
          {primaryPostUrl && !allFailed && (
            <a
              href={primaryPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                flex: 1,
                minWidth: '130px',
                padding: '10px 14px',
                fontSize: '13px',
                gap: '6px',
                backgroundColor: '#2563eb',
                borderColor: '#2563eb',
                color: '#ffffff',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(37,99,235,0.25)'
              }}
            >
              <ExternalLink size={15} />
              <span>View Post</span>
            </a>
          )}

          <button
            type="button"
            onClick={onCreateNewPost}
            className="btn btn-primary"
            style={{
              flex: 1,
              minWidth: '130px',
              padding: '10px 14px',
              fontSize: '13px',
              gap: '6px',
              backgroundColor: '#09090b',
              color: '#ffffff',
              fontWeight: '600',
              borderRadius: '8px'
            }}
          >
            <PlusCircle size={15} />
            <span>Publish Another</span>
          </button>

          <button
            type="button"
            onClick={onViewHistory}
            className="btn btn-outline"
            style={{
              flex: 1,
              minWidth: '130px',
              padding: '10px 14px',
              fontSize: '13px',
              gap: '6px',
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              color: '#09090b',
              fontWeight: '600',
              borderRadius: '8px'
            }}
          >
            <History size={15} />
            <span>Post History</span>
          </button>
        </div>

      </div>
    </div>
  );
};
