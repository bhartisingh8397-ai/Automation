'use client';

import React from 'react';
import { Post } from '../lib/types';
import { SocialIcon } from './SocialIcons';
import { X, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';

interface ViewLinksModalProps {
  post: Post | null;
  onClose: () => void;
}

export const ViewLinksModal: React.FC<ViewLinksModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#09090b' }}>
              Published Post Links
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {post.client_name} • {post.video_filename}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-outline btn-icon"
            style={{ width: '30px', height: '30px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Links List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
          {post.platforms && post.platforms.length > 0 ? (
            post.platforms.map((platform) => {
              const isPublished = platform.status === 'Published';
              const url = platform.platform_post_url || `https://${platform.platform}.com/sample_post`;

              return (
                <div
                  key={platform.id || platform.platform}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: '#f8f9fa',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <SocialIcon platform={platform.platform} size={24} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#09090b', textTransform: 'capitalize' }}>
                        {platform.platform} {platform.post_type}
                      </div>
                      <div style={{ fontSize: '11px', color: isPublished ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        {isPublished ? <CheckCircle size={11} /> : <AlertTriangle size={11} />}
                        <span>{platform.status}</span>
                      </div>
                    </div>
                  </div>

                  {isPublished ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '11px', gap: '4px' }}
                    >
                      <span>Visit Post</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#ef4444' }}>
                      {platform.error_message || 'Delivery error'}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>
              No platform delivery records available.
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
