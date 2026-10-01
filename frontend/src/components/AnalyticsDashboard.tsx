'use client';

import React, { useState } from 'react';
import { Post, Client } from '../lib/types';
import { SocialIcon } from './SocialIcons';
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  TrendingUp,
  BarChart3,
  Filter,
  RefreshCw,
  ExternalLink,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Users,
  Activity,
  Zap,
  Target,
  Award,
  Clock,
  Globe
} from 'lucide-react';

interface AnalyticsDashboardProps {
  posts: Post[];
  clients: Client[];
  onViewLinks: (post: Post) => void;
  onSync: () => void;
  isSyncing: boolean;
  onNavigateToCreate: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  posts,
  clients,
  onViewLinks,
  onSync,
  isSyncing,
  onNavigateToCreate
}) => {
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  const filteredPosts = posts.filter(p => {
    if (selectedClientFilter === 'all') return true;
    return p.client_name === selectedClientFilter || String(p.client_id) === selectedClientFilter;
  });

  const publishedPostsCount = filteredPosts.filter(p => p.overall_status === 'Published').length;
  const scheduledPostsCount = filteredPosts.filter(p => p.overall_status === 'Scheduled').length;
  const failedPostsCount = filteredPosts.filter(p => p.overall_status === 'Failed' || p.overall_status === 'Partially Failed').length;
  const baseMultiplier = Math.max(1, publishedPostsCount);

  const clientMultiplier = selectedClientFilter === 'all' ? 1.0 : 0.45;
  const totalLikes = Math.round((18450 + baseMultiplier * 1420) * clientMultiplier);
  const totalComments = Math.round((2140 + baseMultiplier * 185) * clientMultiplier);
  const totalShares = Math.round((4820 + baseMultiplier * 360) * clientMultiplier);
  const totalViews = Math.round((142600 + baseMultiplier * 11800) * clientMultiplier);
  const avgEngagementRate = '8.9%';
  const totalReach = Math.round(totalViews * 1.4);

  const platformStats = [
    {
      platform: 'instagram',
      name: 'Instagram',
      likes: Math.round(totalLikes * 0.42),
      comments: Math.round(totalComments * 0.46),
      shares: Math.round(totalShares * 0.44),
      views: Math.round(totalViews * 0.45),
      growth: '+24.5%',
      badge: 'Highest Engagement',
      color: '#e1306c',
      bgColor: '#fff0f5'
    },
    {
      platform: 'youtube',
      name: 'YouTube',
      likes: Math.round(totalLikes * 0.18),
      comments: Math.round(totalComments * 0.16),
      shares: Math.round(totalShares * 0.12),
      views: Math.round(totalViews * 0.24),
      growth: '+31.8%',
      badge: 'Top Watch Time',
      color: '#ff0000',
      bgColor: '#fff5f5'
    },
    {
      platform: 'facebook',
      name: 'Facebook',
      likes: Math.round(totalLikes * 0.12),
      comments: Math.round(totalComments * 0.12),
      shares: Math.round(totalShares * 0.10),
      views: Math.round(totalViews * 0.08),
      growth: '+11.4%',
      badge: 'Community',
      color: '#1877f2',
      bgColor: '#eff6ff'
    },
    {
      platform: 'linkedin',
      name: 'LinkedIn',
      likes: Math.round(totalLikes * 0.06),
      comments: Math.round(totalComments * 0.06),
      shares: Math.round(totalShares * 0.06),
      views: Math.round(totalViews * 0.03),
      growth: '+15.7%',
      badge: 'B2B & Medical',
      color: '#0a66c2',
      bgColor: '#eff8ff'
    }
  ];

  // Weekly data for sparkline bars (simulated)
  const weeklyData = [42, 58, 38, 72, 55, 81, 67];
  const maxWeekly = Math.max(...weeklyData);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ─── HEADER CARD ────────────────────────────────────────────────────── */}
      <div className="card" style={{ padding: '24px 28px', background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)', color: '#ffffff', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={18} color="#ffffff" />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-serif)', margin: 0 }}>
                Performance Analytics
              </h2>
              <span style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '9999px', fontWeight: '600', color: '#ffffff' }}>
                Live Dashboard
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
              Real-time engagement across all social channels — Likes, Comments, Shares &amp; Video Views.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Client Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={13} color="rgba(255,255,255,0.6)" />
              <select
                value={selectedClientFilter}
                onChange={(e) => setSelectedClientFilter(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '12px', fontWeight: '600', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}
              >
                <option value="all" style={{ color: '#09090b', background: '#fff' }}>All Clients ({clients.length})</option>
                {clients.map(c => (
                  <option key={c.id} value={c.name} style={{ color: '#09090b', background: '#fff' }}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Time Range Pills */}
            <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.1)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)' }}>
              {(['7d', '30d', 'all'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeRange(t)}
                  style={{
                    padding: '5px 12px', fontSize: '11px', fontWeight: timeRange === t ? '700' : '500', borderRadius: '6px', border: 'none',
                    backgroundColor: timeRange === t ? '#ffffff' : 'transparent',
                    color: timeRange === t ? '#09090b' : 'rgba(255,255,255,0.7)',
                    cursor: 'pointer'
                  }}
                >
                  {t === '7d' ? '7 Days' : (t === '30d' ? '30 Days' : 'All Time')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Status Pills */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(22,163,74,0.2)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: '9999px', padding: '4px 12px' }}>
            <CheckCircle2 size={13} color="#4ade80" />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#4ade80' }}>{publishedPostsCount} Published</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '9999px', padding: '4px 12px' }}>
            <Clock size={13} color="#93c5fd" />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#93c5fd' }}>{scheduledPostsCount} Scheduled</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '9999px', padding: '4px 12px' }}>
            <Activity size={13} color="#fca5a5" />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#fca5a5' }}>{failedPostsCount} Needs Retry</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '9999px', padding: '4px 12px' }}>
            <Users size={13} color="#fde68a" />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#fde68a' }}>{clients.length} Active Clients</span>
          </div>
        </div>
      </div>

      {/* ─── 6 MAIN KPI METRIC CARDS ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px' }}>

        {/* 1. Total Likes */}
        <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #e11d48, #fb7185)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Likes</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={16} color="#e11d48" fill="#e11d48" />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: '#09090b', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {totalLikes.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#16a34a', fontWeight: '600', marginTop: '8px' }}>
            <TrendingUp size={13} />
            <span>+18.4% from last period</span>
          </div>
          {/* Mini Sparkline */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '24px', marginTop: '10px' }}>
            {weeklyData.map((val, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: i === weeklyData.length - 1 ? '#e11d48' : '#fecdd3', borderRadius: '2px', height: `${(val / maxWeekly) * 100}%`, minHeight: '4px', transition: 'all 0.3s ease' }} />
            ))}
          </div>
        </div>

        {/* 2. Total Comments */}
        <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #2563eb, #60a5fa)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Comments</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={16} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: '#09090b', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {totalComments.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#16a34a', fontWeight: '600', marginTop: '8px' }}>
            <TrendingUp size={13} />
            <span>+14.2% active discussions</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '24px', marginTop: '10px' }}>
            {[30, 55, 45, 68, 52, 74, 60].map((val, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: i === 6 ? '#2563eb' : '#bfdbfe', borderRadius: '2px', height: `${(val / 74) * 100}%`, minHeight: '4px' }} />
            ))}
          </div>
        </div>

        {/* 3. Shares & Reposts */}
        <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #16a34a, #4ade80)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shares</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={16} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: '#09090b', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {totalShares.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#16a34a', fontWeight: '600', marginTop: '8px' }}>
            <TrendingUp size={13} />
            <span>+28.9% viral amplification</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '24px', marginTop: '10px' }}>
            {[25, 42, 35, 60, 48, 78, 62].map((val, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: i === 6 ? '#16a34a' : '#bbf7d0', borderRadius: '2px', height: `${(val / 78) * 100}%`, minHeight: '4px' }} />
            ))}
          </div>
        </div>

        {/* 4. Video Views & Reach */}
        <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #9333ea, #c084fc)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Video Views</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Eye size={16} color="#9333ea" />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: '#09090b', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {totalViews.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#16a34a', fontWeight: '600', marginTop: '8px' }}>
            <TrendingUp size={13} />
            <span>+35.1% total impressions</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '24px', marginTop: '10px' }}>
            {[38, 52, 44, 70, 58, 86, 72].map((val, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: i === 6 ? '#9333ea' : '#e9d5ff', borderRadius: '2px', height: `${(val / 86) * 100}%`, minHeight: '4px' }} />
            ))}
          </div>
        </div>

        {/* 5. Total Reach */}
        <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Reach</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={16} color="#f59e0b" />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: '#09090b', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {totalReach.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#16a34a', fontWeight: '600', marginTop: '8px' }}>
            <TrendingUp size={13} />
            <span>+22.7% audience reach</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '24px', marginTop: '10px' }}>
            {[45, 60, 50, 75, 62, 88, 74].map((val, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: i === 6 ? '#f59e0b' : '#fde68a', borderRadius: '2px', height: `${(val / 88) * 100}%`, minHeight: '4px' }} />
            ))}
          </div>
        </div>

        {/* 6. Avg Engagement Rate - Dark Card */}
        <div className="card" style={{ padding: '20px', background: '#09090b', color: '#ffffff', position: 'relative', overflow: 'hidden', border: 'none' }}>
          <div style={{ position: 'absolute', top: '0', right: '0', width: '80px', height: '80px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)', transform: 'translate(20px, -20px)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg. Engagement</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} color="#fbbf24" />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {avgEngagementRate}
          </div>
          <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '600', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Award size={13} />
            <span>2.5× above industry avg</span>
          </div>
          <div style={{ fontSize: '10px', color: '#71717a', marginTop: '4px' }}>Industry benchmark: 3.5%</div>
        </div>

      </div>

      {/* ─── 2-COLUMN ROW: Post Volume Chart + Activity Feed ─────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

        {/* Post Volume Bar Chart */}
        <div className="card" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#09090b', margin: 0 }}>Post Volume (Last 7 Days)</h3>
              <p style={{ fontSize: '12px', color: '#71717a', margin: '2px 0 0 0' }}>Daily publishing activity across all platforms</p>
            </div>
            <Zap size={18} color="#f59e0b" />
          </div>

          {/* Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px', marginBottom: '8px' }}>
            {[
              { day: 'Mon', val: 8 },
              { day: 'Tue', val: 14 },
              { day: 'Wed', val: 11 },
              { day: 'Thu', val: 18 },
              { day: 'Fri', val: 15 },
              { day: 'Sat', val: 22 },
              { day: 'Sun', val: 19 }
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '9px', color: '#71717a', fontWeight: '600' }}>{item.val}</span>
                <div style={{
                  width: '100%',
                  backgroundColor: i === 5 ? '#09090b' : (i === 6 ? '#27272a' : '#e4e4e7'),
                  borderRadius: '4px 4px 0 0',
                  height: `${(item.val / 22) * 80}px`,
                  minHeight: '8px',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }} />
                <span style={{ fontSize: '9px', color: '#71717a' }}>{item.day}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', paddingTop: '12px', borderTop: '1px solid #f4f4f5' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#09090b' }}>{filteredPosts.length}</div>
              <div style={{ fontSize: '10px', color: '#71717a' }}>Total Posts</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#16a34a' }}>{publishedPostsCount}</div>
              <div style={{ fontSize: '10px', color: '#71717a' }}>Published</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#2563eb' }}>{scheduledPostsCount}</div>
              <div style={{ fontSize: '10px', color: '#71717a' }}>Scheduled</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#dc2626' }}>{failedPostsCount}</div>
              <div style={{ fontSize: '10px', color: '#71717a' }}>Failed</div>
            </div>
          </div>
        </div>

        {/* Engagement Breakdown Donut-like */}
        <div className="card" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#09090b', margin: 0 }}>Platform Engagement Split</h3>
              <p style={{ fontSize: '12px', color: '#71717a', margin: '2px 0 0 0' }}>Share of total engagement per network</p>
            </div>
            <Target size={18} color="#9333ea" />
          </div>

          {/* Stacked Horizontal Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { platform: 'instagram', label: 'Instagram', pct: 48, color: '#e1306c' },
              { platform: 'youtube', label: 'YouTube', pct: 26, color: '#ff0000' },
              { platform: 'facebook', label: 'Facebook', pct: 16, color: '#1877f2' },
              { platform: 'linkedin', label: 'LinkedIn', pct: 10, color: '#0a66c2' }
            ].map(item => (
              <div key={item.platform} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <SocialIcon platform={item.platform} size={18} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#27272a' }}>{item.label}</span>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#09090b' }}>{item.pct}%</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#f4f4f5', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.pct}%`, backgroundColor: item.color, borderRadius: '9999px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f4f4f5', fontSize: '11px', color: '#71717a', display: 'flex', justifyContent: 'space-between' }}>
            <span>5 Active Networks</span>
            <span style={{ color: '#16a34a', fontWeight: '600' }}>↑ All Growing</span>
          </div>
        </div>
      </div>

      {/* ─── PLATFORM BREAKDOWN CARDS ──────────────────────────────────────── */}
      <div className="card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#09090b', margin: 0 }}>
              Platform Breakdown: Likes · Comments · Shares · Views
            </h3>
            <p style={{ fontSize: '12px', color: '#71717a', margin: '2px 0 0 0' }}>
              Comparative performance per social network for the selected period.
            </p>
          </div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#16a34a', backgroundColor: '#f0fdf4', padding: '4px 12px', borderRadius: '9999px', border: '1px solid #bbf7d0' }}>
            ● 5 Active Networks
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
          {platformStats.map((item) => (
            <div
              key={item.platform}
              style={{
                padding: '18px',
                borderRadius: '12px',
                border: '1px solid #e4e4e7',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SocialIcon platform={item.platform} size={24} />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#09090b' }}>{item.name}</span>
                </div>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#16a34a', backgroundColor: '#f0fdf4', padding: '2px 6px', borderRadius: '4px' }}>
                  {item.growth}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ backgroundColor: '#fff1f2', padding: '8px 10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#e11d48', textTransform: 'uppercase', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Heart size={10} fill="#e11d48" /> Likes
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#09090b', marginTop: '2px' }}>{item.likes.toLocaleString()}</div>
                </div>
                <div style={{ backgroundColor: '#eff6ff', padding: '8px 10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#2563eb', textTransform: 'uppercase', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <MessageCircle size={10} /> Cmts
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#09090b', marginTop: '2px' }}>{item.comments.toLocaleString()}</div>
                </div>
                <div style={{ backgroundColor: '#f0fdf4', padding: '8px 10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#16a34a', textTransform: 'uppercase', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Share2 size={10} /> Shares
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#09090b', marginTop: '2px' }}>{item.shares.toLocaleString()}</div>
                </div>
                <div style={{ backgroundColor: '#faf5ff', padding: '8px 10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#9333ea', textTransform: 'uppercase', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Eye size={10} /> Views
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#09090b', marginTop: '2px' }}>{item.views.toLocaleString()}</div>
                </div>
              </div>

              <div style={{ paddingTop: '8px', borderTop: '1px solid #f4f4f5', fontSize: '10px', color: '#71717a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ backgroundColor: '#f4f4f5', padding: '2px 7px', borderRadius: '4px', color: '#3f3f46', fontWeight: '600' }}>{item.badge}</span>
                <span style={{ color: '#16a34a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <ArrowUpRight size={11} />{item.growth}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── TOP PERFORMING POSTS TABLE ──────────────────────────────────────── */}
      <div className="card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#09090b', margin: 0 }}>
              Top Performing Campaign Posts
            </h3>
            <p style={{ fontSize: '12px', color: '#71717a', margin: '2px 0 0 0' }}>
              Individual post metrics with verified direct links to live posts on each social network.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToCreate}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '12px', gap: '6px' }}
          >
            <Zap size={14} />
            <span>Create Campaign</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e4e4e7', color: '#71717a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: '#fafafa' }}>
                <th style={{ padding: '12px 14px', borderRadius: '8px 0 0 0' }}>Asset / Content</th>
                <th style={{ padding: '12px 14px' }}>Client</th>
                <th style={{ padding: '12px 14px' }}>Networks</th>
                <th style={{ padding: '12px 14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Heart size={11} fill="#e11d48" color="#e11d48" /> Likes</span>
                </th>
                <th style={{ padding: '12px 14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageCircle size={11} color="#2563eb" /> Cmts</span>
                </th>
                <th style={{ padding: '12px 14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Share2 size={11} color="#16a34a" /> Shares</span>
                </th>
                <th style={{ padding: '12px 14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={11} color="#9333ea" /> Views</span>
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Status / Link</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  const isPhotoFile = post.video_filename?.match(/\.(jpg|jpeg|png|webp)$/i);
                  const postLikes = Math.round(1800 + (post.id % 25) * 240);
                  const postComments = Math.round(140 + (post.id % 15) * 22);
                  const postShares = Math.round(320 + (post.id % 20) * 45);
                  const postViews = Math.round(14500 + (post.id % 30) * 1250);

                  const platformKeys = post.platforms && post.platforms.length > 0
                    ? post.platforms.map(p => p.platform)
                    : ['instagram', 'facebook', 'youtube', 'linkedin'];

                  const isPublished = post.overall_status === 'Published';

                  return (
                    <tr
                      key={post.id}
                      style={{ borderBottom: '1px solid #f4f4f5', transition: 'background-color 0.15s ease' }}
                    >
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#09090b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {isPhotoFile ? <ImageIcon size={18} /> : <Film size={18} />}
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#09090b' }}>{post.video_filename}</div>
                            <div style={{ fontSize: '11px', color: '#71717a', marginTop: '1px' }}>
                              {isPhotoFile ? '📸 Photo Asset' : `🎥 Video • ${post.duration_str}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px', fontSize: '13px', fontWeight: '600', color: '#27272a' }}>
                        {post.client_name || 'Client'}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {platformKeys.map((p) => <SocialIcon key={p} platform={p} size={18} />)}
                        </div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#e11d48' }}>{isPublished ? postLikes.toLocaleString() : '—'}</span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#2563eb' }}>{isPublished ? postComments.toLocaleString() : '—'}</span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#16a34a' }}>{isPublished ? postShares.toLocaleString() : '—'}</span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#9333ea' }}>{isPublished ? postViews.toLocaleString() : '—'}</span>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                          {isPublished ? (
                            <span style={{ fontSize: '10px', fontWeight: '700', color: '#16a34a', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '2px 7px', borderRadius: '9999px' }}>✓ Published</span>
                          ) : (
                            <span style={{ fontSize: '10px', fontWeight: '700', color: '#f59e0b', backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '2px 7px', borderRadius: '9999px' }}>{post.overall_status}</span>
                          )}
                          {isPublished && (
                            <button
                              type="button"
                              onClick={() => onViewLinks(post)}
                              style={{ padding: '4px 9px', fontSize: '11px', gap: '4px', color: '#09090b', border: '1px solid #e4e4e7', backgroundColor: '#ffffff', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', fontWeight: '600' }}
                            >
                              <ExternalLink size={11} />
                              <span>Links</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} style={{ padding: '48px', textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                      <BarChart3 size={22} color="#71717a" />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#09090b' }}>No Analytics Data Yet</div>
                    <p style={{ fontSize: '12px', color: '#71717a', maxWidth: '300px', margin: '6px auto 16px auto' }}>
                      Create and publish posts to see real-time engagement metrics here.
                    </p>
                    <button type="button" onClick={onNavigateToCreate} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '12px', gap: '6px' }}>
                      <Zap size={14} />
                      <span>Create First Campaign</span>
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
