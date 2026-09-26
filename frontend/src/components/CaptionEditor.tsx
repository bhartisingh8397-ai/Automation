'use client';

import React, { useState } from 'react';
import { SocialPlatform } from '../lib/types';
import { SocialIcon } from './SocialIcons';
import {
  Sparkles, Hash, X, Plus, ArrowLeft, ArrowRight,
  Heart, MessageCircle, Share2, Bookmark, Play,
  Image as ImageIcon, Eye, ThumbsUp, Repeat2
} from 'lucide-react';

interface CaptionEditorProps {
  clientName?: string;
  videoFilename?: string;
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
  onCaptionChange: (platform: 'general' | 'instagram' | 'facebook' | 'youtube' | 'linkedin' | 'twitter', text: string) => void;
  onYoutubeTitleChange: (title: string) => void;
  onHashtagsChange: (tags: string) => void;
  onGenerateAi: (topic: string) => Promise<void>;
  isGeneratingAi: boolean;
  onBack?: () => void;
  onNext?: () => void;
}

export const CaptionEditor: React.FC<CaptionEditorProps> = ({
  clientName = 'Client',
  videoFilename = 'media.mp4',
  mediaType = 'video',
  mediaPreviewUrl = null,
  captions,
  youtubeTitle,
  hashtags,
  onCaptionChange,
  onYoutubeTitleChange,
  onHashtagsChange,
  onGenerateAi,
  isGeneratingAi,
  onBack,
  onNext
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'instagram' | 'facebook' | 'youtube' | 'linkedin' | 'twitter'>('general');
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiTopic, setAiTopic] = useState('24x7 Emergency Blood Bank & Intensive Care');
  const [newTag, setNewTag] = useState('');
  const [previewPlatform, setPreviewPlatform] = useState<'instagram' | 'twitter' | 'facebook' | 'youtube' | 'linkedin'>('instagram');

  const isPhoto = mediaType === 'photo' || (videoFilename && videoFilename.match(/\.(jpg|jpeg|png|webp)$/i));
  const handleClean = clientName.toLowerCase().replace(/\s+/g, '');
  const handleIg = clientName.toLowerCase().replace(/\s+/g, '_');

  const charLimits: Record<string, number> = {
    general: 2200,
    instagram: 2200,
    facebook: 5000,
    youtube: 5000,
    linkedin: 3000,
    twitter: 280
  };

  const currentLimit = charLimits[activeTab];
  const currentText = captions[activeTab];
  const charCount = currentText ? currentText.length : 0;

  const tagList = hashtags
    ? hashtags.split(' ').filter(t => t.trim().length > 0)
    : [];

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    const clean = newTag.startsWith('#') ? newTag.trim() : `#${newTag.trim()}`;
    if (!tagList.includes(clean)) {
      onHashtagsChange([...tagList, clean].join(' '));
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = tagList.filter(t => t !== tagToRemove).join(' ');
    onHashtagsChange(updated);
  };

  const triggerAi = async () => {
    await onGenerateAi(aiTopic);
    setShowAiPrompt(false);
  };

  const getPreviewCaption = (plat: string) => {
    if (plat === 'instagram') return captions.instagram || captions.general;
    if (plat === 'twitter') return captions.twitter || captions.general;
    if (plat === 'facebook') return captions.facebook || captions.general;
    if (plat === 'youtube') return captions.youtube || captions.general;
    if (plat === 'linkedin') return captions.linkedin || captions.general;
    return captions.general;
  };

  return (
    <div className="card" style={{ padding: '28px' }}>

      {/* Step 3 Header */}
      <div className="card-header" style={{ marginBottom: '22px' }}>
        <div>
          <div className="card-title" style={{ fontSize: '20px' }}>
            <span className="step-badge">3</span>
            <span>Caption &amp; Details</span>
          </div>
          <div className="card-subtitle" style={{ fontSize: '13px', marginTop: '4px' }}>
            Write platform-specific captions for <strong style={{ color: '#09090b' }}>{clientName}</strong> or use one-click AI to generate. Preview updates live in real-time.
          </div>
        </div>
      </div>

      {/* Two-column layout: Editor + Live Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

        {/* LEFT COLUMN: Caption Editor */}
        <div>
          <div style={{ marginTop: '4px' }}>

            {/* Platform Tabs */}
            <div className="tabs-nav">
              <button type="button" className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>
                General
              </button>
              <button type="button" className={`tab-btn ${activeTab === 'instagram' ? 'active' : ''}`} onClick={() => setActiveTab('instagram')}>
                <SocialIcon platform="instagram" size={13} />
                <span>Instagram</span>
              </button>
              <button type="button" className={`tab-btn ${activeTab === 'facebook' ? 'active' : ''}`} onClick={() => setActiveTab('facebook')}>
                <SocialIcon platform="facebook" size={13} />
                <span>Facebook</span>
              </button>
              <button type="button" className={`tab-btn ${activeTab === 'youtube' ? 'active' : ''}`} onClick={() => setActiveTab('youtube')}>
                <SocialIcon platform="youtube" size={13} />
                <span>YouTube</span>
              </button>
              <button type="button" className={`tab-btn ${activeTab === 'linkedin' ? 'active' : ''}`} onClick={() => setActiveTab('linkedin')}>
                <SocialIcon platform="linkedin" size={13} />
                <span>LinkedIn</span>
              </button>
              <button type="button" className={`tab-btn ${activeTab === 'twitter' ? 'active' : ''}`} onClick={() => setActiveTab('twitter')}>
                <SocialIcon platform="twitter" size={13} />
                <span>Twitter / X</span>
              </button>
            </div>

            {/* YouTube Video Title Field */}
            {activeTab === 'youtube' && (
              <div className="form-group">
                <label className="form-label">YouTube Video Title</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="e.g. खरखौदा में ब्लड बैंक की सुविधा | Keshav Hospital"
                  value={youtubeTitle}
                  onChange={(e) => onYoutubeTitleChange(e.target.value)}
                />
              </div>
            )}

            {/* Main Caption Textarea */}
            <div className="form-group" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  {activeTab === 'general' ? 'Main Caption' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Caption`}
                </label>
                <span style={{ fontSize: '11px', color: charCount > currentLimit ? '#ef4444' : 'var(--text-dim)' }}>
                  {charCount}/{currentLimit}
                </span>
              </div>

              <textarea
                className="textarea-input"
                rows={6}
                placeholder={
                  activeTab === 'general'
                    ? "Enter your primary caption here. It will be synced across all connected platforms..."
                    : `Enter custom caption for ${activeTab}...`
                }
                value={currentText}
                onChange={(e) => onCaptionChange(activeTab, e.target.value)}
              />
            </div>

            {/* AI Generator Trigger */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 14px 0' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAiPrompt(!showAiPrompt)}
                style={{ padding: '6px 12px', fontSize: '12px', gap: '6px' }}
              >
                <Sparkles size={14} color="#09090b" />
                <span>{isGeneratingAi ? 'Generating...' : 'Generate with AI'}</span>
              </button>

              {showAiPrompt && (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Tailored for all 5 platforms
                </span>
              )}
            </div>

            {/* AI Prompt Input Bar */}
            {showAiPrompt && (
              <div style={{
                background: '#f8f9fa',
                border: '1px solid #e4e4e7',
                borderRadius: 'var(--radius-sm)',
                padding: '10px',
                marginBottom: '14px'
              }}>
                <div style={{ fontSize: '11px', color: '#52525b', marginBottom: '6px' }}>
                  Describe topic or key highlight:
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="input-text"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="e.g. 24x7 Emergency Blood Bank & Trauma Care"
                    style={{ padding: '6px 10px', fontSize: '12px', background: '#ffffff', color: '#09090b' }}
                  />
                  <button
                    type="button"
                    onClick={triggerAi}
                    disabled={isGeneratingAi}
                    className="btn btn-primary"
                    style={{ padding: '6px 14px', fontSize: '11px', whiteSpace: 'nowrap' }}
                  >
                    {isGeneratingAi ? 'Creating...' : 'Generate'}
                  </button>
                </div>
              </div>
            )}

            {/* Hashtags Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Hash size={13} color="var(--text-dim)" />
                <label className="form-label" style={{ margin: 0 }}>Hashtags</label>
              </div>

              {/* Hashtag Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {tagList.map(tag => (
                  <span
                    key={tag}
                    style={{
                      background: '#f4f4f5',
                      border: '1px solid #e4e4e7',
                      borderRadius: 'var(--radius-full)',
                      padding: '3px 8px',
                      fontSize: '11px',
                      color: '#09090b',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontWeight: '500'
                    }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      style={{ background: 'transparent', color: '#71717a', padding: 0 }}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Tag Input */}
              <form onSubmit={handleAddTag} style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  className="input-text"
                  placeholder="Add tag (e.g. #HealthCare)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  style={{ padding: '5px 9px', fontSize: '11px' }}
                />
                <button
                  type="submit"
                  className="btn btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '11px' }}
                >
                  <Plus size={12} />
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Live Social Media Preview Panel */}
        <div style={{ position: 'sticky', top: '20px' }}>
          <div style={{
            border: '1px solid #e4e4e7',
            borderRadius: '14px',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            {/* Preview Header */}
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #e4e4e7',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              justifyContent: 'space-between',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={14} color="#09090b" />
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#09090b' }}>Live Preview</span>
                <span style={{ fontSize: '10px', color: '#16a34a', backgroundColor: '#f0fdf4', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>Real-time</span>
              </div>
              {/* Platform pills */}
              <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                {(['instagram', 'twitter', 'facebook', 'youtube', 'linkedin'] as const).map(plat => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setPreviewPlatform(plat)}
                    style={{
                      padding: '3px 7px',
                      fontSize: '10px',
                      fontWeight: previewPlatform === plat ? '700' : '500',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: previewPlatform === plat ? '#09090b' : 'transparent',
                      color: previewPlatform === plat ? '#ffffff' : '#71717a',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <SocialIcon platform={plat} size={11} />
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Canvas */}
            <div style={{ padding: '14px', backgroundColor: '#fafafa', minHeight: '340px' }}>

              {/* Instagram Preview */}
              {previewPlatform === 'instagram' && (
                <div style={{
                  maxWidth: '280px',
                  margin: '0 auto',
                  borderRadius: '18px',
                  background: '#000000',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
                  overflow: 'hidden',
                  border: '3px solid #18181b',
                  position: 'relative',
                  aspectRatio: isPhoto ? '4/5' : '9/16'
                }}>
                  <div style={{ position: 'absolute', top: '10px', left: '12px', right: '12px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#ffffff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <SocialIcon platform="instagram" size={14} />
                      <span style={{ fontSize: '11px', fontWeight: '800' }}>{isPhoto ? 'Post' : 'Reels'}</span>
                    </div>
                    <span style={{ fontSize: '10px' }}>📷</span>
                  </div>
                  {/* Media fill — real image/video or dark gradient placeholder */}
                  <div style={{ position: 'absolute', inset: 0 }}>
                    {mediaPreviewUrl ? (
                      isPhoto ? (
                        <img
                          src={mediaPreviewUrl}
                          alt="preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <>
                          <video
                            src={mediaPreviewUrl}
                            muted
                            loop
                            autoPlay
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          {/* Play icon overlay */}
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Play size={20} color="#ffffff" fill="#ffffff" style={{ marginLeft: '2px' }} />
                            </div>
                          </div>
                        </>
                      )
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at center, #27272a 0%, #09090b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isPhoto
                          ? <ImageIcon size={32} color="rgba(255,255,255,0.5)" />
                          : <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Play size={20} color="#ffffff" fill="#ffffff" style={{ marginLeft: '2px' }} />
                            </div>
                        }
                      </div>
                    )}
                  </div>
                  {/* Right action rail */}
                  <div style={{ position: 'absolute', right: '10px', bottom: '40px', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#ffffff' }}>
                    <div style={{ textAlign: 'center' }}><Heart size={18} fill="#ff3040" color="#ff3040" /><span style={{ fontSize: '8px', display: 'block', fontWeight: '600' }}>14.2K</span></div>
                    <div style={{ textAlign: 'center' }}><MessageCircle size={18} /><span style={{ fontSize: '8px', display: 'block', fontWeight: '600' }}>189</span></div>
                    <Share2 size={16} />
                    <Bookmark size={16} />
                  </div>
                  {/* Caption overlay */}
                  <div style={{ position: 'absolute', left: '10px', right: '44px', bottom: '10px', zIndex: 10, color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fff', color: '#000', fontSize: '9px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{clientName.charAt(0)}</div>
                      <span style={{ fontSize: '10px', fontWeight: '700' }}>@{handleIg}</span>
                      <span style={{ fontSize: '8px', border: '1px solid #fff', padding: '0 4px', borderRadius: '3px', fontWeight: '600' }}>Follow</span>
                    </div>
                    <p style={{ fontSize: '9px', lineHeight: '1.3', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {getPreviewCaption('instagram')}
                    </p>
                  </div>
                </div>
              )}

              {/* Twitter / X Preview */}
              {previewPlatform === 'twitter' && (
                <div style={{ borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid #e4e4e7', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#000', color: '#fff', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{clientName.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#09090b' }}>{clientName}</span>
                        <span style={{ color: '#1d9bf0', fontSize: '12px' }}>✓</span>
                        <span style={{ fontSize: '10px', color: '#71717a' }}>@{handleClean}</span>
                      </div>
                      <span style={{ fontSize: '10px', color: '#a1a1aa' }}>Just now</span>
                    </div>
                    <SocialIcon platform="twitter" size={16} />
                  </div>
                  <p style={{ fontSize: '12px', color: '#0f1419', lineHeight: '1.4', margin: '0 0 10px 0', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {getPreviewCaption('twitter')}
                  </p>
                  {/* Twitter media attachment */}
                  <div style={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: '#000', height: '140px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    {mediaPreviewUrl ? (
                      isPhoto ? (
                        <img src={mediaPreviewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <>
                          <video src={mediaPreviewUrl} muted loop autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Play size={18} color="#ffffff" fill="#ffffff" style={{ marginLeft: '2px' }} />
                            </div>
                          </div>
                        </>
                      )
                    ) : (
                      isPhoto ? <ImageIcon size={28} color="rgba(255,255,255,0.5)" /> : <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play size={18} color="#ffffff" fill="#ffffff" /></div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '10px', color: '#71717a', borderTop: '1px solid #f4f4f5', paddingTop: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MessageCircle size={13} />84</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Repeat2 size={13} />210</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Heart size={13} />1.4K</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Eye size={13} />12.8K</span>
                  </div>
                </div>
              )}

              {/* Facebook Preview */}
              {previewPlatform === 'facebook' && (
                <div style={{ borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid #e4e4e7', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#1877f2', color: '#fff', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{clientName.charAt(0)}</div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#09090b' }}>{clientName}</div>
                      <div style={{ fontSize: '10px', color: '#71717a' }}>📌 Sponsored · Just now</div>
                    </div>
                    <div style={{ marginLeft: 'auto' }}><SocialIcon platform="facebook" size={16} /></div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#1c1e21', lineHeight: '1.4', margin: '0 0 10px 0', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {getPreviewCaption('facebook')}
                  </p>
                  {/* Facebook media */}
                  <div style={{ borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    {mediaPreviewUrl ? (
                      isPhoto ? (
                        <img src={mediaPreviewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <>
                          <video src={mediaPreviewUrl} muted loop autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Play size={18} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} />
                            </div>
                          </div>
                        </>
                      )
                    ) : (
                      isPhoto ? <ImageIcon size={28} color="rgba(255,255,255,0.5)" /> : <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play size={18} color="#fff" fill="#fff" /></div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: '#65676b', borderTop: '1px solid #f4f4f5', paddingTop: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><ThumbsUp size={13} color="#1877f2" />2.1K Like</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MessageCircle size={13} />348 Comments</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Share2 size={13} />91 Shares</span>
                  </div>
                </div>
              )}

              {/* YouTube Preview */}
              {previewPlatform === 'youtube' && (
                <div style={{ borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid #e4e4e7', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  {/* YouTube thumbnail / video */}
                  <div style={{ backgroundColor: '#000', height: '140px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {mediaPreviewUrl ? (
                      isPhoto ? (
                        <img src={mediaPreviewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <>
                          <video src={mediaPreviewUrl} muted loop autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Play size={22} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} />
                            </div>
                          </div>
                        </>
                      )
                    ) : (
                      isPhoto ? <ImageIcon size={28} color="rgba(255,255,255,0.5)" /> : <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play size={22} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} /></div>
                    )}
                    <span style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#fff', fontSize: '9px', padding: '2px 5px', borderRadius: '3px', fontWeight: '700' }}>2:15</span>
                  </div>
                  <div style={{ padding: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f0f0f', lineHeight: '1.3', marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {youtubeTitle || 'YouTube Video Title'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#ff0000', color: '#fff', fontSize: '9px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{clientName.charAt(0)}</div>
                      <span style={{ fontSize: '10px', color: '#606060', fontWeight: '600' }}>{clientName}</span>
                      <span style={{ fontSize: '9px', color: '#606060' }}>• 2.8K views</span>
                    </div>
                    <p style={{ fontSize: '10px', color: '#606060', lineHeight: '1.35', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {getPreviewCaption('youtube')}
                    </p>
                  </div>
                </div>
              )}

              {/* LinkedIn Preview */}
              {previewPlatform === 'linkedin' && (
                <div style={{ borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid #e4e4e7', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#0a66c2', color: '#fff', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{clientName.charAt(0)}</div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#000' }}>{clientName}</div>
                      <div style={{ fontSize: '10px', color: '#666' }}>Healthcare & Medical · 1st</div>
                      <div style={{ fontSize: '9px', color: '#999' }}>Just now · 🌐 Public</div>
                    </div>
                    <div style={{ marginLeft: 'auto' }}><SocialIcon platform="linkedin" size={16} /></div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#000', lineHeight: '1.4', margin: '0 0 10px 0', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {getPreviewCaption('linkedin')}
                  </p>
                  {/* LinkedIn media */}
                  <div style={{ borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', position: 'relative' }}>
                    {mediaPreviewUrl ? (
                      isPhoto ? (
                        <img src={mediaPreviewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <>
                          <video src={mediaPreviewUrl} muted loop autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Play size={18} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} />
                            </div>
                          </div>
                        </>
                      )
                    ) : (
                      isPhoto ? <ImageIcon size={28} color="rgba(255,255,255,0.5)" /> : <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play size={18} color="#fff" fill="#fff" /></div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '10px', color: '#666', borderTop: '1px solid #f4f4f5', paddingTop: '8px' }}>
                    <span>👍 1,234</span>
                    <span>💬 89 Comments</span>
                    <span>🔁 156 Reposts</span>
                  </div>
                </div>
              )}

            </div>

            {/* Preview Footer Note */}
            <div style={{ padding: '8px 14px', backgroundColor: '#f4f4f5', borderTop: '1px solid #e4e4e7', fontSize: '10px', color: '#71717a', textAlign: 'center' }}>
              Preview updates as you type. Switch platforms above.
            </div>
          </div>
        </div>

      </div>

      {/* Footer Navigation */}
      <div className="wizard-nav-footer" style={{ marginTop: '24px' }}>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn btn-outline"
            style={{ padding: '10px 18px', fontSize: '13px', gap: '8px', backgroundColor: '#ffffff', border: '1px solid #e4e4e7' }}
          >
            <ArrowLeft size={15} />
            <span>Back to Media &amp; Preview</span>
          </button>
        )}

        <div style={{ marginLeft: 'auto' }}>
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="btn btn-primary"
              style={{ padding: '11px 22px', fontSize: '13px', gap: '8px' }}
            >
              <span>Proceed to Platforms &amp; Publishing</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
