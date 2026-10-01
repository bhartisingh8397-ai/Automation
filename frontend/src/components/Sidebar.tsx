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
  BarChart3,
  Server,
  Layers,
  ChevronRight
} from 'lucide-react';
import { SocialIcon } from './SocialIcons';

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
  selectedClientAccounts?: { platform: string }[];
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
  selectedClientName,
  selectedClientAccounts = []
}) => {
  const steps = [
    { num: 1, title: 'Client & Socials', icon: Users },
    { num: 2, title: 'Media & Preview', icon: Film },
    { num: 3, title: 'Captions & AI', icon: FileText },
    { num: 4, title: 'Platforms & Post', icon: Send },
  ];

  return (
    <aside style={{
      width: '272px',
      minWidth: '272px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      background: '#ffffff',
      borderRight: '1px solid var(--border-default)',
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
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #833ab4 0%, #c13584 45%, #e1306c 75%, #f77737 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-headings)',
            fontWeight: '700',
            fontSize: '20px',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(193, 53, 132, 0.32)',
            flexShrink: 0
          }}>
            D
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{
              fontSize: '18px',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-headings)',
              margin: 0,
              lineHeight: 1.15
            }}>
              Digigyapan
            </h1>
            <div style={{
              fontSize: '10.5px',
              fontWeight: '700',
              color: 'var(--accent-primary)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginTop: '2px'
            }}>
              Automation Studio
            </div>
          </div>
        </div>

        {/* Selected Client Pill Card */}
        {selectedClientName && (
          <div style={{
            margin: '16px 0 14px',
            padding: '10px 12px',
            borderRadius: '10px',
            background: 'var(--rust-50)',
            border: '1px solid var(--rust-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--accent-primary)', letterSpacing: '0.05em' }}>
                Active Client
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginTop: '1px'
              }}>
                {selectedClientName}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              {selectedClientAccounts && selectedClientAccounts.length > 0 ? (
                selectedClientAccounts.map(acc => (
                  <SocialIcon key={acc.platform} platform={acc.platform} size={13} />
                ))
              ) : (
                <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>None</span>
              )}
            </div>
          </div>
        )}

        {/* SECTION 1: WORKSPACE / CAMPAIGN STUDIO */}
        <div style={{ marginTop: '16px' }}>
          <div style={{
            fontSize: '10.5px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-dim)',
            marginBottom: '6px',
            paddingLeft: '8px'
          }}>
            Campaign Studio
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              type="button"
              onClick={() => onViewChange('create')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '9px',
                border: `1px solid ${activeView === 'create' ? 'var(--rust-100)' : 'transparent'}`,
                background: activeView === 'create' ? 'var(--rust-50)' : 'transparent',
                color: activeView === 'create' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: activeView === 'create' ? '700' : '550',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (activeView !== 'create') {
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeView !== 'create') {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PenSquare size={15} />
                <span>Create Campaign</span>
              </div>
              {activeView === 'create' && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 7px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #833ab4, #c13584)',
                  color: '#ffffff'
                }}>
                  Step {currentStep}/4
                </span>
              )}
            </button>
          </div>
        </div>

        {/* SECTION 2: INTELLIGENCE & ARCHIVE */}
        <div style={{ marginTop: '18px' }}>
          <div style={{
            fontSize: '10.5px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-dim)',
            marginBottom: '6px',
            paddingLeft: '8px'
          }}>
            Intelligence &amp; Archive
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            
            {/* Analytics Dashboard */}
            <button
              type="button"
              onClick={() => onViewChange('analytics')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '9px',
                border: `1px solid ${activeView === 'analytics' ? 'var(--rust-100)' : 'transparent'}`,
                background: activeView === 'analytics' ? 'var(--rust-50)' : 'transparent',
                color: activeView === 'analytics' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: activeView === 'analytics' ? '700' : '550',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (activeView !== 'analytics') {
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeView !== 'analytics') {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BarChart3 size={15} />
                <span>Analytics &amp; Reach</span>
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: '700',
                padding: '2px 7px',
                borderRadius: '999px',
                backgroundColor: activeView === 'analytics' ? '#e1306c' : 'var(--sand-200)',
                color: activeView === 'analytics' ? '#ffffff' : 'var(--text-muted)'
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
                padding: '9px 12px',
                borderRadius: '9px',
                border: `1px solid ${activeView === 'history' ? 'var(--rust-100)' : 'transparent'}`,
                background: activeView === 'history' ? 'var(--rust-50)' : 'transparent',
                color: activeView === 'history' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: activeView === 'history' ? '700' : '550',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (activeView !== 'history') {
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeView !== 'history') {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <History size={15} />
                <span>Post History</span>
              </div>
              {postsCount > 0 && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 7px',
                  borderRadius: '999px',
                  backgroundColor: activeView === 'history' ? '#c13584' : 'var(--sand-200)',
                  color: activeView === 'history' ? '#ffffff' : 'var(--text-muted)'
                }}>
                  {postsCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* SECTION 3: WORKFLOW PIPELINE (When on create campaign view) */}
        {activeView === 'create' && onStepChange && (
          <div style={{ marginTop: '20px' }}>
            <div style={{
              fontSize: '10.5px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-dim)',
              marginBottom: '6px',
              paddingLeft: '8px'
            }}>
              Pipeline Stages
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {steps.map(step => {
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
                      gap: '9px',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: `1px solid ${isActive ? 'var(--rust-100)' : 'transparent'}`,
                      background: isActive ? 'var(--rust-50)' : 'transparent',
                      color: isActive ? 'var(--accent-secondary)' : (isPassed ? 'var(--text-primary)' : 'var(--text-muted)'),
                      fontSize: '12px',
                      fontWeight: isActive ? '700' : '500',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'var(--bg-secondary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? 'var(--accent-primary)' : (isPassed ? 'var(--accent-secondary)' : 'var(--sand-200)'),
                      color: isPassed || isActive ? '#ffffff' : 'var(--text-muted)',
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

      {/* Bottom Block: User Account */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* User Profile Card */}
        <div style={{
          padding: '9px 12px',
          background: '#ffffff',
          border: '1px solid var(--border-default)',
          borderRadius: '9px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #833ab4 0%, #c13584 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-headings)',
              fontWeight: '700',
              fontSize: '12px',
              flexShrink: 0
            }}>
              DG
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }} title={userEmail}>
                {userEmail}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '500' }}>
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
                padding: '5px',
                borderRadius: '6px',
                color: 'var(--text-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#c13584')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>

      </div>

    </aside>
  );
};
