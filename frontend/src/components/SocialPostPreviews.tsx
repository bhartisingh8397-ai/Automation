'use client';

import React from 'react';
import { SocialIcon } from './SocialIcons';
import { Heart, MessageCircle, Share2, Play, Repeat, Bookmark } from 'lucide-react';

interface SocialPostPreviewsProps {
  clientName: string;
  videoFilename: string;
  captions: {
    general: string;
    instagram: string;
    facebook: string;
    youtube: string;
    linkedin: string;
  };
  youtubeTitle: string;
  hashtags: string;
}

export const SocialPostPreviews: React.FC<SocialPostPreviewsProps> = ({
  clientName,
  captions,
  youtubeTitle,
}) => {
  const displayClient = clientName || 'Keshav Hospital';
  const handle = `@${displayClient.toLowerCase().replace(/\s+/g, '_')}`;

  const igCaption = captions.instagram || captions.general || 'खरखौदा में ब्लड बैंक की सुविधा अब और भी बेहतर! Keshav Hospital में सुरक्षित, आधुनिक और 24x7 ब्लड बैंक सेवा उपलब्ध है...';
  const fbCaption = captions.facebook || captions.general || 'खरखौदा में ब्लड बैंक की सुविधा अब और भी बेहतर! Keshav Hospital में सुरक्षित, आधुनिक और 24x7 ब्लड बैंक सेवा उपलब्ध है...';
  const ytTitle = youtubeTitle || `खरखौदा में ब्लड बैंक की सुविधा | ${displayClient}`;
  const liCaption = captions.linkedin || captions.general || `${displayClient} is proud to announce expanded 24x7 advanced blood banking facilities in Kharkhoda, ensuring rapid response emergency care.`;

  return (
    <div style={{ marginTop: '24px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '14px' }}>
        <div className="card-title">
          <span className="step-badge">8</span>
          <span>Example: Published Posts</span>
        </div>
        <div className="card-subtitle">
          Same video automatically posted on all selected platforms at the scheduled time.
        </div>
      </div>

      {/* 4 Preview Mockups Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>

        {/* 1. Instagram Reel Preview */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          {/* Header */}
          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e4e4e7', background: '#f8f9fa' }}>
            <SocialIcon platform="instagram" size={18} />
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#09090b' }}>Instagram Reel</span>
          </div>

          {/* Reel Frame */}
          <div style={{
            height: '240px',
            background: 'linear-gradient(180deg, #181820 0%, #0a0a0d 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            {/* Center Play Indicator */}
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Play size={20} color="#ffffff" fill="#ffffff" />
            </div>

            {/* Right Reel Action Icons */}
            <div style={{
              position: 'absolute',
              right: '12px',
              bottom: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center'
            }}>
              <div style={{ textAlign: 'center' }}>
                <Heart size={18} color="#ffffff" />
                <span style={{ fontSize: '9px', color: '#ffffff', display: 'block', marginTop: '2px' }}>1.2K</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <MessageCircle size={18} color="#ffffff" />
                <span style={{ fontSize: '9px', color: '#ffffff', display: 'block', marginTop: '2px' }}>85</span>
              </div>
              <Share2 size={18} color="#ffffff" />
            </div>

            {/* Bottom Caption Overlay */}
            <div style={{
              position: 'absolute',
              left: '12px',
              bottom: '12px',
              right: '50px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ffffff', color: '#000', fontSize: '9px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {displayClient.charAt(0)}
                </div>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#ffffff' }}>{handle}</span>
              </div>
              <p style={{
                fontSize: '11px',
                color: '#ffffff',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                lineHeight: '1.3',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {igCaption}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Facebook Video Preview */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          {/* Header */}
          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e4e4e7', background: '#f8f9fa' }}>
            <SocialIcon platform="facebook" size={18} />
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#09090b' }}>Facebook Video</span>
          </div>

          <div style={{ padding: '14px' }}>
            {/* Page Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1877F2', color: '#fff', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {displayClient.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#09090b' }}>{displayClient}</div>
                <div style={{ fontSize: '10px', color: '#71717a' }}>25 Sep at 7:30 PM • 🌐</div>
              </div>
            </div>

            {/* Caption */}
            <p style={{ fontSize: '11px', color: '#27272a', marginBottom: '8px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {fbCaption}
            </p>

            {/* Video player box */}
            <div style={{
              height: '130px',
              background: '#09090b',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Play size={24} color="#ffffff" fill="#ffffff" />
            </div>

            {/* Reactions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #e4e4e7', fontSize: '11px', color: '#71717a' }}>
              <span>👍 ❤️ 256</span>
              <span>32 comments • 18 shares</span>
            </div>
          </div>
        </div>

        {/* 3. YouTube Video Preview */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          {/* Header */}
          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e4e4e7', background: '#f8f9fa' }}>
            <SocialIcon platform="youtube" size={18} />
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#09090b' }}>YouTube Video</span>
          </div>

          <div style={{ padding: '14px' }}>
            {/* 16:9 Player */}
            <div style={{
              height: '130px',
              background: '#09090b',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              marginBottom: '10px'
            }}>
              <div style={{
                width: '40px',
                height: '28px',
                background: '#FF0000',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Play size={16} color="#ffffff" fill="#ffffff" />
              </div>

              <span style={{
                position: 'absolute',
                bottom: '6px',
                right: '6px',
                background: 'rgba(0,0,0,0.85)',
                color: '#ffffff',
                fontSize: '10px',
                padding: '2px 5px',
                borderRadius: '3px'
              }}>
                2:15
              </span>
            </div>

            {/* Video Title */}
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#09090b', lineHeight: '1.3', marginBottom: '4px' }}>
              {ytTitle}
            </div>

            {/* Channel info & views */}
            <div style={{ fontSize: '10px', color: '#71717a' }}>
              1.2K views • 1 day ago
            </div>
          </div>
        </div>

        {/* 4. LinkedIn Video Preview */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          {/* Header */}
          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e4e4e7', background: '#f8f9fa' }}>
            <SocialIcon platform="linkedin" size={18} />
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#09090b' }}>LinkedIn Post</span>
          </div>

          <div style={{ padding: '14px' }}>
            {/* Company Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#0A66C2', color: '#fff', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                in
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#09090b' }}>{displayClient}</div>
                <div style={{ fontSize: '10px', color: '#71717a' }}>12,450 followers • Promoted</div>
              </div>
            </div>

            {/* Text */}
            <p style={{ fontSize: '11px', color: '#27272a', marginBottom: '8px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {liCaption}
            </p>

            {/* Video preview */}
            <div style={{
              height: '130px',
              background: '#09090b',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Play size={24} color="#ffffff" fill="#ffffff" />
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #e4e4e7', fontSize: '11px', color: '#71717a' }}>
              <span>👏 184 • 14 comments</span>
              <span>1,200 impressions</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
