'use client';

import React from 'react';
import { SocialIcon } from './SocialIcons';

export const SocialPlatformsInfo: React.FC = () => {
  const platforms = [
    {
      platform: 'instagram',
      name: 'Instagram (Reels)',
      points: [
        'Posts video as Reel format',
        'Uses connected Instagram Business Account',
        'Adds tailored caption & hashtags'
      ]
    },
    {
      platform: 'facebook',
      name: 'Facebook (Video/Reel)',
      points: [
        'Posts video on your official Page',
        'Uses connected Facebook Page access token',
        'Adds caption, website link and hashtags'
      ]
    },
    {
      platform: 'youtube',
      name: 'YouTube (Video)',
      points: [
        'Uploads video directly to your channel',
        'Adds title, rich description and tags',
        'Sets privacy (Public / Unlisted)',
        'Custom thumbnail generation support'
      ]
    },
    {
      platform: 'linkedin',
      name: 'LinkedIn (Video)',
      points: [
        'Posts high-res video to your Company Page',
        'Adds professional executive caption',
        'Uses connected LinkedIn Organization Page'
      ]
    },
    {
      platform: 'twitter',
      name: 'Twitter / X (Video & Post)',
      points: [
        'Posts video tweet via X API v2',
        'Concise, punchy copy (280 characters limit)',
        'Embeds video player directly in tweet timeline'
      ]
    }
  ];

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <div className="card-header">
        <div>
          <div className="card-title">
            <span className="step-badge">8</span>
            <span>Social Media Platforms (Publishing via Official APIs)</span>
          </div>
          <div className="card-subtitle">
            Direct integration with platform official Graph and Developer APIs.
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '14px',
        marginTop: '12px'
      }}>
        {platforms.map(p => (
          <div
            key={p.platform}
            style={{
              background: '#f8f9fa',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <SocialIcon platform={p.platform} size={24} />
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#09090b' }}>
                {p.name}
              </div>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {p.points.map((pt, i) => (
                <li key={i} style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <span style={{ color: '#09090b', fontSize: '12px' }}>•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
