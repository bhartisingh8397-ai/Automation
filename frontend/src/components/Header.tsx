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
      borderBottom: '1px solid #e4e4e7',
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '18px 0',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* Left Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              backgroundColor: '#09090b',
              borderRadius: '9px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '19px',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
            }}>
              D
            </div>
            <div>
              <h1 style={{ fontSize: '21px', fontWeight: '800', letterSpacing: '-0.02em', color: '#09090b', fontFamily: 'var(--font-serif)', margin: 0, lineHeight: 1.2 }}>
                Digigyapan <span style={{ color: '#d4d4d8', fontWeight: '400', margin: '0 4px' }}>|</span> <span style={{ fontSize: '15px', fontWeight: '600', color: '#52525b', fontFamily: 'var(--font-sans)' }}>Social Media Automation</span>
              </h1>
            </div>
          </div>

          {/* Center Navigation: Create Post vs Post History */}
          {isLoggedIn && onViewChange && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f4f4f5',
              padding: '4px',
              borderRadius: '10px',
              border: '1px solid #e4e4e7'
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
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: activeView === 'create' ? '#ffffff' : 'transparent',
                  color: activeView === 'create' ? '#09090b' : '#71717a',
                  boxShadow: activeView === 'create' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
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
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: activeView === 'history' ? '#ffffff' : 'transparent',
                  color: activeView === 'history' ? '#09090b' : '#71717a',
                  boxShadow: activeView === 'history' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <History size={15} />
                <span>Post History</span>
                {postsCount > 0 && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    backgroundColor: activeView === 'history' ? '#09090b' : '#e4e4e7',
                    color: activeView === 'history' ? '#ffffff' : '#09090b',
                    padding: '2px 8px',
                    borderRadius: '9999px',
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
                background: '#f4f4f5',
                border: '1px solid #e4e4e7',
                padding: '8px 14px',
                borderRadius: '9px',
                fontSize: '13px',
                color: '#09090b'
              }}>
                <UserCheck size={16} color="#09090b" />
                <span style={{ fontWeight: '600' }}>{userEmail}</span>
              </div>

              {onSync && (
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
                    color: '#09090b',
                    borderRadius: '9px',
                    fontWeight: '600'
                  }}
                  title="Sync posts and logs from MySQL"
                >
                  <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                  <span>Sync Database</span>
                </button>
              )}

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
                    border: '1px solid #e4e4e7',
                    color: '#52525b',
                    borderRadius: '9px',
                    fontWeight: '600'
                  }}
                  title="Log out and return to Login Screen"
                >
                  <LogOut size={13} color="#52525b" />
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
