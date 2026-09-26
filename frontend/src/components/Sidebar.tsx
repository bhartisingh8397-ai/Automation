'use client';

import React from 'react';
import { DatabaseInfo } from '../lib/types';
import { 
  UserCheck, 
  LogOut, 
  RefreshCw, 
  PenSquare, 
  History, 
  CheckCircle2, 
  Users, 
  Film, 
  FileText, 
  Send,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  dbInfo: DatabaseInfo | null;
  onLogout?: () => void;
  onSync?: () => void;
  isSyncing?: boolean;
  isLoggedIn: boolean;
  userEmail?: string;
  activeView: 'create' | 'analytics' | 'history';
  onViewChange: (view: 'create' | 'analytics' | 'history') => void;
  postsCount?: number;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  selectedClientName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  dbInfo,
  onLogout,
  onSync,
  isSyncing = false,
  userEmail = 'team@digigyapan.com',
  activeView,
  onViewChange,
  postsCount = 0,
  currentStep = 1,
  onStepChange,
  selectedClientName
}) => {
  const steps = [
    { num: 1, title: 'Select Client & Socials', icon: Users },
    { num: 2, title: 'Select Media & Preview', icon: Film },
    { num: 3, title: 'Captions & AI Details', icon: FileText },
    { num: 4, title: 'Choose Platforms & Post', icon: Send },
  ];

  return (
    <aside style={{
      width: '270px',
      minWidth: '270px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      background: '#ffffff',
      borderRight: '1px solid #e4e4e7',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 18px',
      zIndex: 50,
      overflowY: 'auto'
    }}>
      
      {/* Top Block: Brand + Menus */}
      <div>
        
        {/* Brand & Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingBottom: '20px',
          borderBottom: '1px solid #f4f4f5'
        }}>
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
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
            flexShrink: 0
          }}>
            D
          </div>
          <div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              color: '#09090b',
              fontFamily: 'var(--font-serif)',
              margin: 0,
              lineHeight: 1.15
            }}>
              Digigyapan
            </h1>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#71717a',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginTop: '2px'
            }}>
              Automation Studio
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        <div style={{ marginTop: '24px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#a1a1aa',
            marginBottom: '8px',
            paddingLeft: '8px'
          }}>
            Main Navigation
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            
            {/* Create Post */}
            <button
              type="button"
              onClick={() => {
                onViewChange('create');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeView === 'create' ? '#09090b' : 'transparent',
                color: activeView === 'create' ? '#ffffff' : '#3f3f46',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s ease',
                boxShadow: activeView === 'create' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PenSquare size={16} />
                <span>Create Post</span>
              </div>
              {activeView === 'create' && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  color: '#09090b'
                }}>
                  Step {currentStep}/4
                </span>
              )}
            </button>

            {/* Analytics Dashboard */}
            <button
              type="button"
              onClick={() => onViewChange('analytics')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeView === 'analytics' ? '#09090b' : 'transparent',
                color: activeView === 'analytics' ? '#ffffff' : '#3f3f46',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s ease',
                boxShadow: activeView === 'analytics' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BarChart3 size={16} />
                <span>Analytics &amp; Metrics</span>
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '9999px',
                backgroundColor: activeView === 'analytics' ? '#27272a' : '#f0fdf4',
                color: activeView === 'analytics' ? '#ffffff' : '#16a34a'
              }}>
                Live
              </span>
            </button>

            {/* Post History */}
            <button
              type="button"
              onClick={() => onViewChange('history')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeView === 'history' ? '#09090b' : 'transparent',
                color: activeView === 'history' ? '#ffffff' : '#3f3f46',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s ease',
                boxShadow: activeView === 'history' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <History size={16} />
                <span>Post History</span>
              </div>
              {postsCount > 0 && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: activeView === 'history' ? '#27272a' : '#f4f4f5',
                  color: activeView === 'history' ? '#ffffff' : '#09090b'
                }}>
                  {postsCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Workflow Steps (Direct Quick-Jumper in Sidebar) */}
        {activeView === 'create' && onStepChange && (
          <div style={{ marginTop: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
              paddingLeft: '8px'
            }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#a1a1aa'
              }}>
                Workflow Steps
              </span>
              {selectedClientName && (
                <span style={{
                  fontSize: '10px',
                  color: '#71717a',
                  maxWidth: '110px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }} title={selectedClientName}>
                  {selectedClientName}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {steps.map(step => {
                const Icon = step.icon;
                const isActive = currentStep === step.num;
                const isPassed = currentStep > step.num;

                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => onStepChange(step.num)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${isActive ? '#09090b' : 'transparent'}`,
                      background: isActive ? '#f4f4f5' : 'transparent',
                      color: isActive ? '#09090b' : (isPassed ? '#27272a' : '#71717a'),
                      fontSize: '12px',
                      fontWeight: isActive ? '700' : '500',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? '#09090b' : (isPassed ? '#16a34a' : '#e4e4e7'),
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: '800',
                      flexShrink: 0
                    }}>
                      {isPassed ? '✓' : step.num}
                    </div>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Block: System Utilities + User Account + Logout */}
      <div style={{ paddingTop: '20px', borderTop: '1px solid #f4f4f5', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Sync Database Button */}
        {onSync && (
          <button
            type="button"
            onClick={onSync}
            disabled={isSyncing}
            className="btn btn-outline"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              color: '#09090b',
              fontSize: '12px',
              fontWeight: '600'
            }}
            title="Sync posts and client database"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Database'}</span>
          </button>
        )}

        {/* User Profile Card */}
        <div style={{
          padding: '12px',
          background: '#f8f9fa',
          border: '1px solid #e4e4e7',
          borderRadius: '9px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#09090b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <UserCheck size={16} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#09090b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }} title={userEmail}>
                {userEmail}
              </div>
              <div style={{ fontSize: '10px', color: '#71717a' }}>
                Administrator
              </div>
            </div>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                color: '#71717a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>

      </div>

    </aside>
  );
};
