'use client';

import React, { useState } from 'react';
import { SocialPlatform, Post } from '../lib/types';
import { SocialIcon } from './SocialIcons';
import {
  Check,
  Calendar,
  Clock,
  Send,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Share2,
  Layers,
  LayoutGrid,
  Heart,
  MessageCircle,
  Repeat,
  Bookmark,
  Play,
  Image as ImageIcon,
  Film,
  Sparkles
} from 'lucide-react';

interface PublishingStepProps {
  clientName: string;
  videoFilename: string;
  fileSizeMb: number;
  durationStr: string;
  mediaType?: 'video' | 'photo';
  mediaPreviewUrl?: string | null;
  captions: {
    general: string;
    instagram: string;
    facebook: string;
    youtube: string;
    linkedin: string;
    twitter?: string;
  };
  youtubeTitle: string;
  hashtags: string;
  selectedPlatforms: SocialPlatform[];
  onTogglePlatform: (platform: SocialPlatform) => void;
  onSelectAllPlatforms: () => void;
  onClearAllPlatforms: () => void;
  scheduleType: 'now' | 'later';
  onScheduleTypeChange: (type: 'now' | 'later') => void;
  scheduleDate: string;
  onDateChange: (date: string) => void;
  scheduleTime: string;
  onTimeChange: (time: string) => void;
  timezone: string;
  onTimezoneChange: (tz: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onBack?: () => void;
  onViewHistory?: () => void;
  posts?: Post[];
  onViewLinks?: (post: Post) => void;
  onRetry?: (postId: number) => void;
  onCancel?: (postId: number) => void;
  onDelete?: (postId: number) => void;
  onSync?: () => void;
  isSyncing?: boolean;
}

export const PublishingStep: React.FC<PublishingStepProps> = ({
  clientName,
  videoFilename,
  fileSizeMb,
  durationStr,
  mediaType = 'video',
  mediaPreviewUrl = null,
  captions,
  youtubeTitle,
  hashtags,
  selectedPlatforms,
  onTogglePlatform,
  onSelectAllPlatforms,
  onClearAllPlatforms,
  scheduleType,
  onScheduleTypeChange,
  scheduleDate,
  onDateChange,
  scheduleTime,
  onTimeChange,
  timezone,
  onTimezoneChange,
  onSubmit,
  isSubmitting,
  onBack
}) => {
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform | 'overview'>('instagram');

  const isPhoto = mediaType === 'photo' || videoFilename.match(/\.(jpg|jpeg|png|webp)$/i);
  const handleClean = clientName.toLowerCase().replace(/\s+/g, '');
  const handleIg = clientName.toLowerCase().replace(/\s+/g, '_');

  const platformList: { id: SocialPlatform; label: string; subLabel: string }[] = [
    { id: 'instagram', label: 'Instagram', subLabel: isPhoto ? 'Publish as Feed Photo / Carousel' : 'Publish as official Reel' },
    { id: 'twitter', label: 'Twitter / X', subLabel: isPhoto ? 'Post Tweet with Photo attachment' : 'Post Tweet with Video attachment' },
    { id: 'youtube', label: 'YouTube', subLabel: isPhoto ? 'Post to Channel Community' : 'Upload directly to Channel' },
    { id: 'facebook', label: 'Facebook', subLabel: isPhoto ? 'Post Photo to Page' : 'Post to Page as Video / Reel' },
    { id: 'linkedin', label: 'LinkedIn', subLabel: isPhoto ? 'Post Image to Company' : 'Post Video to Company' }
  ];

  const timezones = [
    'Asia/Kolkata (IST)',
    'UTC',
    'America/New_York (EST)',
    'America/Los_Angeles (PST)',
    'Europe/London (GMT)',
    'Asia/Dubai (GST)',
    'Asia/Singapore (SGT)'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Step 4 Main Setup Card */}
      <div className="card" style={{ padding: '28px' }}>
        
        {/* Step 4 Header */}
        <div className="card-header" style={{ marginBottom: '22px' }}>
          <div>
            <div className="card-title" style={{ fontSize: '20px' }}>
              <span className="step-badge">4</span>
              <span>Live Social Media Previews &amp; Multi-Platform Publishing</span>
            </div>
            <div className="card-subtitle" style={{ fontSize: '13px', marginTop: '4px' }}>
              Review how your customized captions and media appear across social networks, select target platforms, and publish for <strong style={{ color: '#09090b' }}>{clientName}</strong>.
            </div>
          </div>
        </div>

        {/* SECTION 1: LIVE SOCIAL MEDIA PREVIEW (AFTER CAPTIONS & DETAILS) */}
        <div style={{
          marginBottom: '28px',
          border: '1px solid #e4e4e7',
          borderRadius: '14px',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
        }}>
          {/* Header Bar with Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #e4e4e7',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#09090b" />
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#09090b' }}>
                Live Post Preview (with your Step 3 Captions &amp; Details)
              </span>
            </div>

            {/* Platform Selector Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
              {[
                { id: 'instagram', label: isPhoto ? 'Instagram Photo' : 'Instagram Reel' },
                { id: 'twitter', label: 'Twitter / X' },
                { id: 'youtube', label: isPhoto ? 'YouTube Post' : 'YouTube Video' },
                { id: 'facebook', label: 'Facebook' },
                { id: 'linkedin', label: 'LinkedIn' },
                { id: 'overview', label: 'All Previews' }
              ].map(item => {
                const isActive = previewPlatform === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreviewPlatform(item.id as any)}
                    style={{
                      padding: '5px 12px',
                      fontSize: '11px',
                      fontWeight: isActive ? '700' : '500',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: isActive ? '#09090b' : 'transparent',
                      color: isActive ? '#ffffff' : '#71717a',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {item.id === 'overview' ? <LayoutGrid size={13} /> : <SocialIcon platform={item.id} size={14} />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div style={{ padding: '24px 20px', backgroundColor: '#fafafa', minHeight: '340px' }}>
            
            {/* 1. Instagram Preview */}
            {previewPlatform === 'instagram' && (
              <div style={{
                maxWidth: '320px',
                margin: '0 auto',
                borderRadius: '24px',
                background: '#000000',
                boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
                overflow: 'hidden',
                border: '4px solid #18181b',
                position: 'relative',
                aspectRatio: isPhoto ? '4 / 5' : '9 / 16'
              }}>
                {/* Header */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '14px',
                  right: '14px',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#ffffff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <SocialIcon platform="instagram" size={16} />
                    <span style={{ fontSize: '13px', fontWeight: '800' }}>{isPhoto ? 'Post' : 'Reels'}</span>
                  </div>
                  <span style={{ fontSize: '11px', opacity: 0.9 }}>📷</span>
                </div>

                {/* Center Media Area */}
                <div style={{
                  position: 'absolute',
                  inset: 0
                }}>
                  {mediaPreviewUrl ? (
                    isPhoto ? (
                      <img src={mediaPreviewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <>
                        <video src={mediaPreviewUrl} muted loop autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Play size={24} color="#ffffff" fill="#ffffff" style={{ marginLeft: '3px' }} />
                          </div>
                        </div>
                      </>
                    )
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at center, #27272a 0%, #09090b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', textAlign: 'center', padding: '20px' }}>
                      {isPhoto ? (
                        <div>
                          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto' }}>
                            <ImageIcon size={26} color="#ffffff" />
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: '700' }}>{videoFilename}</div>
                          <div style={{ fontSize: '10px', opacity: 0.75 }}>1080x1350 High-Res Post</div>
                        </div>
                      ) : (
                        <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Play size={24} color="#ffffff" fill="#ffffff" style={{ marginLeft: '3px' }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Action Rail */}
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  bottom: '45px',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#ffffff'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <Heart size={20} fill="#ff3040" color="#ff3040" />
                    <span style={{ fontSize: '9px', display: 'block', marginTop: '1px', fontWeight: '600' }}>14.2K</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <MessageCircle size={20} />
                    <span style={{ fontSize: '9px', display: 'block', marginTop: '1px', fontWeight: '600' }}>189</span>
                  </div>
                  <Share2 size={18} />
                  <Bookmark size={18} />
                </div>

                {/* Bottom Overlay with Real Captions */}
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  right: '50px',
                  bottom: '12px',
                  zIndex: 10,
                  color: '#ffffff',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ffffff', color: '#000000', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {clientName.charAt(0)}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700' }}>@{handleIg}</span>
                    <span style={{ fontSize: '9px', border: '1px solid #ffffff', padding: '1px 5px', borderRadius: '3px', fontWeight: '600' }}>Follow</span>
                  </div>
                  <p style={{
                    fontSize: '11px',
                    lineHeight: '1.3',
                    margin: '0 0 4px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {captions.instagram || captions.general}
                  </p>
                </div>
              </div>
            )}

            {/* 2. Twitter / X Tweet Preview */}
            {previewPlatform === 'twitter' && (
              <div style={{
                maxWidth: '460px',
                margin: '0 auto',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #e4e4e7',
                padding: '16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#000000', color: '#ffffff', fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {clientName.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#09090b' }}>{clientName}</span>
                      <span style={{ color: '#1d9bf0', fontSize: '13px' }}>✓</span>
                      <span style={{ fontSize: '12px', color: '#71717a' }}>@{handleClean}</span>
                      <span style={{ fontSize: '12px', color: '#a1a1aa' }}>· Just now</span>
                    </div>
                  </div>
                  <SocialIcon platform="twitter" size={18} />
                </div>

                {/* Tweet Body from Step 3 */}
                <p style={{ fontSize: '13px', color: '#0f1419', lineHeight: '1.45', margin: '0 0 12px 0' }}>
                  {captions.twitter || captions.general}
                </p>

                {/* Media Attachment */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000000', height: '210px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  {mediaPreviewUrl ? (
                    isPhoto ? (
                      <img src={mediaPreviewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <>
                        <video src={mediaPreviewUrl} muted loop autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Play size={20} color="#ffffff" fill="#ffffff" style={{ marginLeft: '2px' }} />
                          </div>
                        </div>
                        <span style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px' }}>{durationStr}</span>
                      </>
                    )
                  ) : (
                    isPhoto ? (
                      <div style={{ textAlign: 'center', color: '#ffffff' }}>
                        <ImageIcon size={32} color="#ffffff" style={{ margin: '0 auto 6px auto', display: 'block' }} />
                        <div style={{ fontSize: '12px', fontWeight: '700' }}>{videoFilename}</div>
                      </div>
                    ) : (
                      <>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Play size={20} color="#ffffff" fill="#ffffff" style={{ marginLeft: '2px' }} />
                        </div>
                        <span style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px' }}>{durationStr}</span>
                      </>
                    )
                  )}
                </div>

                {/* Tweet Metrics */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #f4f4f5', fontSize: '12px', color: '#71717a' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MessageCircle size={14} /> 48</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Repeat size={14} /> 112</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Heart size={14} /> 890</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Bookmark size={14} /> 54</span>
                  <span>📊 2.4K</span>
                </div>
              </div>
            )}

            {/* 3. YouTube Preview */}
            {previewPlatform === 'youtube' && (
              <div style={{
                maxWidth: '460px',
                margin: '0 auto',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #e4e4e7',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
              }}>
                {/* YouTube media */}
                <div style={{ backgroundColor: '#09090b', height: '210px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {mediaPreviewUrl ? (
                    isPhoto ? (
                      <img src={mediaPreviewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <>
                        <video src={mediaPreviewUrl} muted loop autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '54px', height: '38px', backgroundColor: '#FF0000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(255,0,0,0.4)', cursor: 'pointer' }}>
                            <Play size={20} color="#ffffff" fill="#ffffff" style={{ marginLeft: '2px' }} />
                          </div>
                        </div>
                        <span style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px' }}>{durationStr}</span>
                        <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.75)', color: '#ffffff', fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px' }}>HD 1080p</span>
                      </>
                    )
                  ) : (
                    isPhoto ? (
                      <div style={{ textAlign: 'center', color: '#ffffff' }}>
                        <ImageIcon size={34} color="#ffffff" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                        <div style={{ fontSize: '13px', fontWeight: '700' }}>YouTube Community Post Image</div>
                      </div>
                    ) : (
                      <>
                        <div style={{ width: '54px', height: '38px', backgroundColor: '#FF0000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(255, 0, 0, 0.4)', cursor: 'pointer' }}>
                          <Play size={20} color="#ffffff" fill="#ffffff" style={{ marginLeft: '2px' }} />
                        </div>
                        <span style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px' }}>{durationStr}</span>
                        <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.75)', color: '#ffffff', fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px' }}>HD 1080p</span>
                      </>
                    )
                  )}
                </div>

                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#09090b', lineHeight: '1.3', marginBottom: '4px' }}>
                    {youtubeTitle || `${clientName} Official Update`}
                  </div>
                  <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '8px' }}>
                    {hashtags || '#Healthcare #Official'}
                  </div>
                  <p style={{ fontSize: '11px', color: '#52525b', lineHeight: '1.4', margin: '0 0 12px 0', whiteSpace: 'pre-line' }}>
                    {captions.youtube ? captions.youtube.slice(0, 150) + '...' : captions.general}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #f4f4f5' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FF0000', color: '#ffffff', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {clientName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#09090b' }}>{clientName} Official</div>
                        <div style={{ fontSize: '10px', color: '#71717a' }}>24.5K subscribers</div>
                      </div>
                    </div>
                    <button type="button" style={{ padding: '6px 14px', backgroundColor: '#09090b', color: '#ffffff', borderRadius: '20px', fontSize: '11px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Facebook Preview */}
            {previewPlatform === 'facebook' && (
              <div style={{
                maxWidth: '460px',
                margin: '0 auto',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #e4e4e7',
                padding: '16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1877F2', color: '#ffffff', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {clientName.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#09090b' }}>{clientName}</div>
                    <div style={{ fontSize: '11px', color: '#71717a' }}>Just now · 🌐 Public</div>
                  </div>
                  <SocialIcon platform="facebook" size={20} />
                </div>

                <p style={{ fontSize: '12px', color: '#1c1e21', lineHeight: '1.4', margin: '0 0 10px 0' }}>
                  {captions.facebook || captions.general}
                </p>

                {/* Facebook media */}
                <div style={{ backgroundColor: '#000000', height: '200px', borderRadius: '8px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', overflow: 'hidden' }}>
                  {mediaPreviewUrl ? (
                    isPhoto ? (
                      <img src={mediaPreviewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <>
                        <video src={mediaPreviewUrl} muted loop autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Play size={20} color="#ffffff" fill="#ffffff" style={{ marginLeft: '2px' }} />
                          </div>
                        </div>
                      </>
                    )
                  ) : (
                    isPhoto
                      ? <ImageIcon size={32} color="#ffffff" />
                      : <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Play size={20} color="#ffffff" fill="#ffffff" style={{ marginLeft: '2px' }} /></div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#65676b', paddingTop: '8px', borderTop: '1px solid #f4f4f5' }}>
                  <span>👍 ❤️ 420</span>
                  <span>28 comments · 14 shares</span>
                </div>
              </div>
            )}

            {/* 5. LinkedIn Preview */}
            {previewPlatform === 'linkedin' && (
              <div style={{
                maxWidth: '460px',
                margin: '0 auto',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #e4e4e7',
                padding: '16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '4px', backgroundColor: '#0A66C2', color: '#ffffff', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    in
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#09090b' }}>{clientName}</div>
                    <div style={{ fontSize: '11px', color: '#71717a' }}>Official Company Page · Promoted</div>
                  </div>
                  <SocialIcon platform="linkedin" size={20} />
                </div>

                <p style={{ fontSize: '12px', color: '#27272a', lineHeight: '1.45', margin: '0 0 10px 0' }}>
                  {captions.linkedin || captions.general}
                </p>

                {/* LinkedIn media */}
                <div style={{ backgroundColor: '#09090b', height: '200px', borderRadius: '8px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', overflow: 'hidden' }}>
                  {mediaPreviewUrl ? (
                    isPhoto ? (
                      <img src={mediaPreviewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <>
                        <video src={mediaPreviewUrl} muted loop autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Play size={20} color="#ffffff" fill="#ffffff" style={{ marginLeft: '2px' }} />
                          </div>
                        </div>
                      </>
                    )
                  ) : (
                    isPhoto
                      ? <ImageIcon size={32} color="#ffffff" />
                      : <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Play size={20} color="#ffffff" fill="#ffffff" style={{ marginLeft: '2px' }} /></div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#71717a', paddingTop: '8px', borderTop: '1px solid #f4f4f5' }}>
                  <span>👏 💡 ❤️ 190</span>
                  <span>16 comments · 1,420 impressions</span>
                </div>
              </div>
            )}

            {/* 6. Overview (All Previews Grid) */}
            {previewPlatform === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {([
                  { platform: 'instagram', label: `Instagram (${isPhoto ? 'Photo' : '9:16 Reel'})`, note: '✓ Formatted & Ready' },
                  { platform: 'twitter', label: 'Twitter / X Post', note: '✓ 280-char Tweet Ready' },
                  { platform: 'youtube', label: 'YouTube', note: '✓ Channel Metadata Ready' },
                  { platform: 'facebook', label: 'Facebook Post', note: '✓ Page Feed Ready' },
                  { platform: 'linkedin', label: 'LinkedIn Update', note: '✓ Corporate Share Ready' }
                ] as const).map(({ platform, label, note }) => (
                  <div key={platform} style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <SocialIcon platform={platform} size={16} />
                      <span style={{ fontSize: '11px', fontWeight: '700' }}>{label}</span>
                    </div>
                    <div style={{ height: '90px', backgroundColor: '#000', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      {mediaPreviewUrl ? (
                        isPhoto ? (
                          <img src={mediaPreviewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <>
                            <video src={mediaPreviewUrl} muted loop autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Play size={16} color="#fff" fill="#fff" />
                            </div>
                          </>
                        )
                      ) : (
                        isPhoto ? <ImageIcon size={20} color="#fff" /> : <Play size={20} color="#fff" fill="#fff" />
                      )}
                    </div>
                    <div style={{ fontSize: '10px', color: '#16a34a', marginTop: '6px', fontWeight: '600' }}>{note}</div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* SECTION 2: CHOOSE PLATFORMS & SCHEDULE CONTROLS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '28px'
        }}>

          {/* Left Column: Platform Checkboxes */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <label className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#71717a', margin: 0 }}>
                Select Social Networks ({selectedPlatforms.length} of {platformList.length})
              </label>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={onSelectAllPlatforms}
                  className="btn btn-outline"
                  style={{ padding: '3px 8px', fontSize: '11px', backgroundColor: '#ffffff', border: '1px solid #e4e4e7' }}
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={onClearAllPlatforms}
                  className="btn btn-outline"
                  style={{ padding: '3px 8px', fontSize: '11px', backgroundColor: '#ffffff', border: '1px solid #e4e4e7' }}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Platform Selection Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {platformList.map((item) => {
                const isSelected = selectedPlatforms.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => onTogglePlatform(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 16px',
                      background: isSelected ? '#f8f9fa' : '#ffffff',
                      border: `1.5px solid ${isSelected ? '#09090b' : '#e4e4e7'}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '5px',
                      border: `1.5px solid ${isSelected ? '#09090b' : '#d4d4d8'}`,
                      background: isSelected ? '#09090b' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isSelected && <Check size={14} color="#ffffff" strokeWidth={3} />}
                    </div>

                    <SocialIcon platform={item.id} size={28} />

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#09090b' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '11px', color: '#71717a', marginTop: '1px' }}>
                        {item.subLabel}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Schedule Controls & Review CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <label className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#71717a', marginBottom: '12px' }}>
                Publishing Schedule
              </label>

              {/* Radio Options */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
                <label
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: scheduleType === 'now' ? '#09090b' : '#ffffff',
                    color: scheduleType === 'now' ? '#ffffff' : '#09090b',
                    border: `1px solid ${scheduleType === 'now' ? '#09090b' : '#e4e4e7'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <input
                    type="radio"
                    name="schedule_type"
                    checked={scheduleType === 'now'}
                    onChange={() => onScheduleTypeChange('now')}
                    style={{ accentColor: '#ffffff' }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700' }}>Publish Now</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>Immediately trigger APIs</div>
                  </div>
                </label>

                <label
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: scheduleType === 'later' ? '#09090b' : '#ffffff',
                    color: scheduleType === 'later' ? '#ffffff' : '#09090b',
                    border: `1px solid ${scheduleType === 'later' ? '#09090b' : '#e4e4e7'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <input
                    type="radio"
                    name="schedule_type"
                    checked={scheduleType === 'later'}
                    onChange={() => onScheduleTypeChange('later')}
                    style={{ accentColor: '#ffffff' }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700' }}>Schedule Later</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>Pick date &amp; time</div>
                  </div>
                </label>
              </div>

              {/* Date & Time Inputs (If Later) */}
              {scheduleType === 'later' && (
                <div style={{
                  padding: '16px',
                  background: '#f8f9fa',
                  border: '1px solid #e4e4e7',
                  borderRadius: '10px',
                  marginBottom: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px' }}>
                        Posting Date
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => onDateChange(e.target.value)}
                          className="input-text"
                          style={{ fontSize: '12px', paddingLeft: '32px' }}
                        />
                        <Calendar size={14} color="#71717a" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                      </div>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px' }}>
                        Posting Time
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => onTimeChange(e.target.value)}
                          className="input-text"
                          style={{ fontSize: '12px', paddingLeft: '32px' }}
                        />
                        <Clock size={14} color="#71717a" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px' }}>
                      Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => onTimezoneChange(e.target.value)}
                      className="input-text"
                      style={{ fontSize: '12px' }}
                    >
                      {timezones.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Execution Summary Box */}
              <div style={{
                padding: '14px 16px',
                background: '#f4f4f5',
                borderRadius: '8px',
                border: '1px solid #e4e4e7',
                fontSize: '12px',
                color: '#27272a',
                lineHeight: '1.45',
                marginBottom: '18px'
              }}>
                <div style={{ fontWeight: '700', marginBottom: '4px', color: '#09090b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="#16a34a" />
                  <span>Ready to Dispatch:</span>
                </div>
                <div>
                  Publishing <strong>{videoFilename}</strong> ({fileSizeMb} MB, {isPhoto ? 'Photo' : 'Video'}) across <strong>{selectedPlatforms.length} networks</strong> for <strong>{clientName}</strong>.
                </div>
                <div style={{ marginTop: '4px', fontSize: '11px', color: '#71717a' }}>
                  {scheduleType === 'now' ? 'Instant execution via live OAuth APIs.' : `Scheduled for ${scheduleDate} at ${scheduleTime} (${timezone}).`}
                </div>
              </div>
            </div>

            {/* Big Action Submit Button */}
            <div>
              <button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting || selectedPlatforms.length === 0}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  fontSize: '14px',
                  fontWeight: '700',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Publishing Across Social Networks...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>{scheduleType === 'now' ? `Publish to ${selectedPlatforms.length} Platforms Now` : 'Schedule Automated Post'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Footer Navigation */}
        <div className="wizard-nav-footer">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="btn btn-outline"
              style={{ padding: '10px 18px', fontSize: '13px', gap: '8px', backgroundColor: '#ffffff', border: '1px solid #e4e4e7' }}
            >
              <ArrowLeft size={15} />
              <span>Back to Captions &amp; Details</span>
            </button>
          )}

          <div style={{ fontSize: '12px', color: '#71717a' }}>
            Current Client: <strong style={{ color: '#09090b' }}>{clientName}</strong>
          </div>
        </div>

      </div>

    </div>
  );
};
