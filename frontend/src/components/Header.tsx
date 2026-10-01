'use client';

import React from 'react';
import { DatabaseInfo } from '../lib/types';
import { UserCheck, LogOut, RefreshCw, PenSquare, History } from 'lucide-react';

interface HeaderProps {
  dbInfo: DatabaseInfo | null;
  onOpenLogin?: () => void;
  onLogout?: () => void;
  onSync?: () => void;
  isSyncing?: boolean;
  isLoggedIn: boolean;
  userEmail?: string;
  activeView?: 'create' | 'history';
  onViewChange?: (view: 'create' | 'history') => void;
  postsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLogin,
  onLogout,
  onSync,
  isSyncing = false,
  isLoggedIn,
  userEmail = 'team@digigyapan.com',
  activeView = 'create',
  onViewChange,
  postsCount = 0
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-default)',
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '16px 0',
      boxShadow: '0 1px 4px rgba(131, 58, 180, 0.06)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* Left Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              background: 'linear-gradient(135deg, #833ab4 0%, #c13584 45%, #e1306c 75%, #f77737 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-headings)',
              fontWeight: '700',
              fontSize: '19px',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(193, 53, 132, 0.32)'
            }}>
              D
            </div>
            <div>
              <h1 style={{ fontSize: '21px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)', fontFamily: 'var(--font-headings)', margin: 0, lineHeight: 1.2 }}>
                Digigyapan <span style={{ color: '#e1306c', fontWeight: '700', margin: '0 4px' }}>|</span> <span style={{ fontSize: '14.5px', fontWeight: '500', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>Social Media Automation</span>
              </h1>
            </div>
          </div>

          {/* Center Navigation: Create Post vs Post History */}
          {isLoggedIn && onViewChange && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-secondary)',
              padding: '4px',
              borderRadius: '10px',
              border: '1px solid var(--border-default)'
            }}>
              <button
                type="button"
                onClick={() => onViewChange('create')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: activeView === 'create' ? '700' : '550',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: activeView === 'create' ? 'linear-gradient(135deg, #833ab4 0%, #c13584 100%)' : 'transparent',
                  color: activeView === 'create' ? '#ffffff' : 'var(--text-secondary)',
                  boxShadow: activeView === 'create' ? '0 2px 6px rgba(193, 53, 132, 0.25)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <PenSquare size={15} />
                <span>Create Post</span>
              </button>

              <button
                type="button"
                onClick={() => onViewChange('history')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: activeView === 'history' ? '700' : '550',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: activeView === 'history' ? 'linear-gradient(135deg, #833ab4 0%, #c13584 100%)' : 'transparent',
                  color: activeView === 'history' ? '#ffffff' : 'var(--text-secondary)',
                  boxShadow: activeView === 'history' ? '0 2px 6px rgba(193, 53, 132, 0.25)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <History size={15} />
                <span>Post History</span>
                {postsCount > 0 && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    backgroundColor: activeView === 'history' ? 'rgba(255, 255, 255, 0.25)' : 'var(--sand-200)',
                    color: activeView === 'history' ? '#ffffff' : 'var(--accent-primary)',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    marginLeft: '2px'
                  }}>
                    {postsCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Area: User Profile Pill, Sync & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFFFFF',
                border: '1px solid var(--border-default)',
                padding: '8px 14px',
                borderRadius: '9px',
                fontSize: '13px',
                color: 'var(--text-primary)'
              }}>
                <UserCheck size={16} color="#c13584" />
                <span style={{ fontWeight: '600' }}>{userEmail}</span>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="btn btn-outline"
                  style={{
                    padding: '8px 14px',
                    fontSize: '12px',
                    gap: '6px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)',
                    borderRadius: '9px',
                    fontWeight: '600'
                  }}
                  title="Log out and return to Login Screen"
                >
                  <LogOut size={13} color="var(--text-dim)" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="btn btn-primary"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              <UserCheck size={16} />
              <span>Login</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
