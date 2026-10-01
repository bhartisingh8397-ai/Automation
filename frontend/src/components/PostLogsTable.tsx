'use client';

import React from 'react';
import { Post } from '../lib/types';
import { SocialIcon } from './SocialIcons';
import { Film, RotateCcw, XCircle, Trash2, ExternalLink, AlertTriangle, RefreshCw } from 'lucide-react';

interface PostLogsTableProps {
  posts: Post[];
  onViewLinks: (post: Post) => void;
  onRetry: (postId: number) => void;
  onCancel: (postId: number) => void;
  onDelete: (postId: number) => void;
  onSync?: () => void;
  isSyncing?: boolean;
  isActionLoading?: boolean;
}

export const PostLogsTable: React.FC<PostLogsTableProps> = ({
  posts,
  onViewLinks,
  onRetry,
  onCancel,
  onDelete,
  onSync,
  isSyncing = false,
  isActionLoading = false
}) => {
  const formatTime = (timeStr: string) => {
    try {
      const d = new Date(timeStr);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeStr;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return <span className="badge badge-published">Published</span>;
      case 'Scheduled':
        return <span className="badge badge-scheduled">Scheduled</span>;
      case 'Partially Failed':
        return <span className="badge badge-partial">Partially Failed</span>;
      case 'Failed':
        return <span className="badge badge-failed">Failed</span>;
      case 'Processing':
        return <span className="badge badge-scheduled">Processing...</span>;
      case 'Cancelled':
        return <span className="badge badge-disconnected">Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      
      {/* Header */}
      <div className="card-header">
        <div>
          <div className="card-title">
            <span>Post Status &amp; Automation Logs</span>
          </div>
          <div className="card-subtitle">
            Track real-time status, post links and execution logs across platforms.
          </div>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div style={{ overflowX: 'auto', marginTop: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 14px' }}>Video</th>
              <th style={{ padding: '12px 14px' }}>Client</th>
              <th style={{ padding: '12px 14px' }}>Scheduled Time</th>
              <th style={{ padding: '12px 14px' }}>Platforms</th>
              <th style={{ padding: '12px 14px' }}>Status</th>
              <th style={{ padding: '12px 14px' }}>Post Links</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts && posts.length > 0 ? (
              posts.map((post) => {
                const isPublished = post.overall_status === 'Published';
                const isPartialOrFailed = post.overall_status === 'Partially Failed' || post.overall_status === 'Failed';
                const isScheduled = post.overall_status === 'Scheduled';

                // Collect platform keys
                const platformKeys = post.platforms && post.platforms.length > 0
                  ? post.platforms.map(p => p.platform)
                  : ['instagram', 'facebook', 'youtube', 'linkedin'];

                return (
                  <tr
                    key={post.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'var(--transition)'
                    }}
                  >
                    {/* Video Column */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '6px',
                          background: '#f4f4f5',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Film size={18} color="var(--text-muted)" />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#09090b' }}>
                            {post.video_filename}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                            {post.duration_str} {post.file_size_mb ? `• ${post.file_size_mb} MB` : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Client Column */}
                    <td style={{ padding: '14px', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      {post.client_name || 'Hospital Client'}
                    </td>

                    {/* Scheduled Time Column */}
                    <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {formatTime(post.scheduled_at)}
                    </td>

                    {/* Platforms Column with genuine original colors! */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {platformKeys.map((plat) => (
                          <SocialIcon key={plat} platform={plat} size={20} />
                        ))}
                      </div>
                    </td>

                    {/* Status Column with Direct Retry Button */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getStatusBadge(post.overall_status)}
                        <button
                          type="button"
                          onClick={() => onRetry(post.id)}
                          title="Retry post execution across social networks"
                          style={{
                            padding: '3px 8px',
                            fontSize: '11px',
                            fontWeight: '600',
                            borderRadius: '6px',
                            border: '1px solid #e4e4e7',
                            backgroundColor: '#ffffff',
                            color: '#09090b',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}
                        >
                          <RotateCcw size={11} />
                          <span>Retry</span>
                        </button>
                      </div>
                    </td>

                    {/* Post Links Column */}
                    <td style={{ padding: '14px' }}>
                      {isPublished || post.overall_status === 'Partially Failed' ? (
                        <button
                          type="button"
                          onClick={() => onViewLinks(post)}
                          className="btn btn-outline"
                          style={{ padding: '4px 10px', fontSize: '11px', color: '#22c55e', borderColor: 'rgba(34,197,94,0.3)' }}
                        >
                          <ExternalLink size={12} />
                          <span>View Links</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>—</span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => onRetry(post.id)}
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '11px', gap: '4px' }}
                          title="Retry Publishing"
                        >
                          <RotateCcw size={12} />
                          <span>Retry</span>
                        </button>

                        {isScheduled && (
                          <button
                            type="button"
                            onClick={() => onCancel(post.id)}
                            className="btn btn-outline"
                            style={{ padding: '4px 10px', fontSize: '11px', gap: '4px', color: '#ef4444' }}
                            title="Cancel Scheduled Post"
                          >
                            <XCircle size={12} />
                            <span>Cancel</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onDelete(post.id)}
                          className="btn btn-outline btn-icon"
                          style={{ width: '28px', height: '28px', padding: 0 }}
                          title="Delete Post"
                        >
                          <Trash2 size={13} color="var(--text-dim)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
                  No posts found. Create your first post using the steps above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
