'use client';

import React, { useState } from 'react';
import { Post } from '../lib/types';
import { SocialIcon } from './SocialIcons';
import {
  Film,
  Image as ImageIcon,
  RotateCcw,
  XCircle,
  Trash2,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  Filter,
  History
} from 'lucide-react';

interface HistoryPageProps {
  posts: Post[];
  clients: { id: number; name: string }[];
  onViewLinks: (post: Post) => void;
  onRetry: (postId: number) => void;
  onCancel: (postId: number) => void;
  onDelete: (postId: number) => void;
  onSync: () => void;
  isSyncing: boolean;
  onCreateNewPost: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  posts,
  clients,
  onViewLinks,
  onRetry,
  onCancel,
  onDelete,
  onSync,
  isSyncing,
  onCreateNewPost
}) => {
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  // Filter posts based on client, status, and search query
  const filteredPosts = posts.filter(post => {
    // Client filter
    if (selectedClientFilter !== 'all' && post.client_name !== selectedClientFilter) {
      return false;
    }
    // Status filter
    if (selectedStatusFilter !== 'all' && post.overall_status !== selectedStatusFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchVideo = post.video_filename?.toLowerCase().includes(q);
      const matchClient = post.client_name?.toLowerCase().includes(q);
      if (!matchVideo && !matchClient) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* History Page Header Card */}
      <div className="card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#09090b',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <History size={16} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#09090b', fontFamily: 'var(--font-serif)' }}>
                Post History &amp; Delivery Records
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>
              Track all scheduled and published posts, visit live social media URLs, retry failed posts, and delete records.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={onSync}
              className="btn btn-outline"
              style={{
                padding: '8px 14px',
                fontSize: '12px',
                gap: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid #e4e4e7',
                color: '#09090b'
              }}
              title="Sync latest posts from database"
            >
              <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
              <span>Sync Database</span>
            </button>

            <button
              type="button"
              onClick={onCreateNewPost}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '12px', gap: '6px' }}
            >
              <Plus size={14} />
              <span>Create New Post</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginTop: '20px',
          paddingTop: '18px',
          borderTop: '1px solid #e4e4e7',
          flexWrap: 'wrap'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search by video filename or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-text"
              style={{ paddingLeft: '34px', fontSize: '12px' }}
            />
            <Search size={14} color="#71717a" style={{ position: 'absolute', left: '11px', top: '11px' }} />
          </div>

          {/* Client Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#71717a', fontWeight: '600' }}>Client:</span>
            <select
              value={selectedClientFilter}
              onChange={(e) => setSelectedClientFilter(e.target.value)}
              className="select-input"
              style={{ padding: '7px 10px', fontSize: '12px', width: 'auto', minWidth: '150px' }}
            >
              <option value="all">All Clients ({clients.length})</option>
              {clients.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#71717a', fontWeight: '600' }}>Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="select-input"
              style={{ padding: '7px 10px', fontSize: '12px', width: 'auto', minWidth: '140px' }}
            >
              <option value="all">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Partially Failed">Partially Failed</option>
              <option value="Failed">Failed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(selectedClientFilter !== 'all' || selectedStatusFilter !== 'all' || searchQuery.trim()) && (
            <button
              type="button"
              onClick={() => {
                setSelectedClientFilter('all');
                setSelectedStatusFilter('all');
                setSearchQuery('');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#71717a',
                fontSize: '11px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Reset Filters
            </button>
          )}

          <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#71717a' }}>
            Showing <strong>{filteredPosts.length}</strong> of <strong>{posts.length}</strong> posts
          </div>
        </div>
      </div>

      {/* Main History Table Card */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '860px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e4e4e7', color: '#71717a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 14px' }}>Video</th>
                <th style={{ padding: '12px 14px' }}>Client</th>
                <th style={{ padding: '12px 14px' }}>Schedule Time</th>
                <th style={{ padding: '12px 14px' }}>Platforms</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px' }}>Post Links</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts && filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  const isPublished = post.overall_status === 'Published';
                  const isPartialOrFailed = post.overall_status === 'Partially Failed' || post.overall_status === 'Failed';
                  const isScheduled = post.overall_status === 'Scheduled';

                  const platformKeys = post.platforms && post.platforms.length > 0
                    ? post.platforms.map(p => p.platform)
                    : ['instagram', 'facebook', 'youtube', 'linkedin', 'twitter'];

                  return (
                    <tr
                      key={post.id}
                      style={{
                        borderBottom: '1px solid #e4e4e7',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      {/* 1. Video/Photo Column */}
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '8px',
                            background: '#09090b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {post.video_filename?.match(/\.(jpg|jpeg|png|webp)$/i)
                              ? <ImageIcon size={18} color="#ffffff" />
                              : <Film size={18} color="#ffffff" />
                            }
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#09090b' }}>
                              {post.video_filename}
                            </div>
                            <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {post.video_filename?.match(/\.(jpg|jpeg|png|webp)$/i) ? '📸 Photo' : '🎥 Video'}
                              {post.duration_str ? ` • ${post.duration_str}` : ''}
                              {post.file_size_mb ? ` • ${post.file_size_mb} MB` : ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Client Column */}
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#09090b' }}>
                          {post.client_name || 'Client'}
                        </div>
                      </td>

                      {/* 3. Schedule Time Column */}
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '500', color: '#27272a' }}>
                          {formatTime(post.scheduled_at)}
                        </div>
                        <div style={{ fontSize: '10px', color: '#71717a', marginTop: '2px' }}>
                          {isScheduled ? 'Scheduled Run' : 'Published'}
                        </div>
                      </td>

                      {/* 4. Platforms Column with Official Brand Colors */}
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {platformKeys.map((plat) => (
                            <SocialIcon key={plat} platform={plat} size={20} />
                          ))}
                        </div>
                      </td>

                      {/* 5. Status Column with Prominent Retry */}
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {getStatusBadge(post.overall_status)}
                          {(isPartialOrFailed || isScheduled) && (
                            <button
                              type="button"
                              onClick={() => onRetry(post.id)}
                              title="Retry post execution across social networks"
                              style={{
                                padding: '4px 10px',
                                fontSize: '11px',
                                fontWeight: '700',
                                borderRadius: '6px',
                                border: `1px solid ${isPartialOrFailed ? '#fca5a5' : '#e4e4e7'}`,
                                backgroundColor: isPartialOrFailed ? '#fef2f2' : '#f4f4f5',
                                color: isPartialOrFailed ? '#dc2626' : '#09090b',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                animation: isPartialOrFailed ? 'pulse 2s infinite' : 'none'
                              }}
                            >
                              <RotateCcw size={11} />
                              <span>{isPartialOrFailed ? '⚡ Retry Now' : 'Retry'}</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* 6. Post Links Column */}
                      <td style={{ padding: '14px' }}>
                        {isPublished || post.overall_status === 'Partially Failed' ? (
                          <button
                            type="button"
                            onClick={() => onViewLinks(post)}
                            className="btn btn-outline"
                            style={{
                              padding: '5px 10px',
                              fontSize: '11px',
                              color: '#16a34a',
                              borderColor: 'rgba(22, 163, 74, 0.3)',
                              backgroundColor: '#f4fdf7',
                              gap: '4px'
                            }}
                          >
                            <ExternalLink size={12} />
                            <span>View Links</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#a1a1aa' }}>—</span>
                        )}
                      </td>

                      {/* 7 & 8. Actions & Delete Post Column */}
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {/* Retry Button */}
                          <button
                            type="button"
                            onClick={() => onRetry(post.id)}
                            className="btn btn-secondary"
                            style={{ padding: '5px 10px', fontSize: '11px', gap: '4px' }}
                            title="Retry Publishing"
                          >
                            <RotateCcw size={12} />
                            <span>Retry</span>
                          </button>

                          {/* Cancel Button */}
                          {isScheduled && (
                            <button
                              type="button"
                              onClick={() => onCancel(post.id)}
                              className="btn btn-outline"
                              style={{ padding: '5px 10px', fontSize: '11px', gap: '4px', color: '#dc2626', borderColor: '#fca5a5' }}
                              title="Cancel Scheduled Post"
                            >
                              <XCircle size={12} />
                              <span>Cancel</span>
                            </button>
                          )}

                          {/* Delete This Post Button */}
                          <button
                            type="button"
                            onClick={() => onDelete(post.id)}
                            className="btn btn-outline"
                            style={{
                              padding: '5px 10px',
                              fontSize: '11px',
                              gap: '5px',
                              color: '#dc2626',
                              borderColor: '#e4e4e7',
                              backgroundColor: '#ffffff'
                            }}
                            title="Delete this post permanently"
                          >
                            <Trash2 size={13} color="#dc2626" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#71717a' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#f4f4f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px auto'
                    }}>
                      <History size={22} color="#71717a" />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#09090b' }}>
                      No Posts Found in History
                    </div>
                    <p style={{ fontSize: '12px', color: '#71717a', marginTop: '4px', maxWidth: '340px', margin: '4px auto 16px auto' }}>
                      {posts.length === 0
                        ? "You haven't scheduled or published any posts yet. Use the wizard to create your first post!"
                        : "No posts match your current search and filter criteria."}
                    </p>
                    <button
                      type="button"
                      onClick={onCreateNewPost}
                      className="btn btn-primary"
                      style={{ padding: '8px 18px', fontSize: '12px', gap: '6px' }}
                    >
                      <Plus size={14} />
                      <span>Create Your First Post</span>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
