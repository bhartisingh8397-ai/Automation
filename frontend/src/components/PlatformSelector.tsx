'use client';

import React from 'react';
import { SocialPlatform } from '../lib/types';
import { SocialIcon } from './SocialIcons';
import { Check } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatforms: SocialPlatform[];
  onTogglePlatform: (platform: SocialPlatform) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms,
  onTogglePlatform,
  onSelectAll,
  onClearAll
}) => {
  const platformList: { id: SocialPlatform; label: string; subLabel: string }[] = [
    { id: 'instagram', label: 'Instagram', subLabel: 'Post as Reel' },
    { id: 'facebook', label: 'Facebook', subLabel: 'Post as Video/Reel' },
    { id: 'youtube', label: 'YouTube', subLabel: 'Upload as Video' },
    { id: 'linkedin', label: 'LinkedIn', subLabel: 'Post as Video' }
  ];

  return (
    <div className="card" style={{ height: '100%' }}>
      
      {/* Header matching Step 4 */}
      <div className="card-header">
        <div>
          <div className="card-title">
            <span className="step-badge">4</span>
            <span>Choose Platforms</span>
          </div>
          <div className="card-subtitle">
            Select where you want to publish this video.
          </div>
        </div>
      </div>

      <div style={{ marginTop: '12px' }}>
        
        {/* Select All / Clear All toggles */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '12px' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '3px 8px', fontSize: '10px' }}
            onClick={onSelectAll}
          >
            Select All
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '3px 8px', fontSize: '10px' }}
            onClick={onClearAll}
          >
            Clear All
          </button>
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
                  gap: '12px',
                  padding: '12px',
                  background: isSelected ? 'var(--rust-50)' : '#ffffff',
                  border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                {/* Custom Checkbox */}
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '5px',
                  border: `1.5px solid ${isSelected ? '#c13584' : 'var(--border-strong)'}`,
                  background: isSelected ? 'linear-gradient(135deg, #833ab4, #c13584)' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isSelected && <Check size={13} color="#ffffff" strokeWidth={3} />}
                </div>

                {/* Social Icon in its original brand color! */}
                <SocialIcon platform={item.id} size={26} />

                {/* Platform Name and Publishing Sublabel */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                    {item.subLabel}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '14px', textAlign: 'center' }}>
          {selectedPlatforms.length} of {platformList.length} platforms selected
        </div>

      </div>

    </div>
  );
};
