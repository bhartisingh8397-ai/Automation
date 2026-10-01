'use client';

import React, { useState } from 'react';
import { Client } from '../lib/types';
import { SocialIcon } from './SocialIcons';
import { Plus, Check, ArrowRight, Building2, CheckCircle2, Search, X, Sparkles, ExternalLink } from 'lucide-react';

interface ClientSelectorProps {
  clients: Client[];
  selectedClientId: number;
  onSelectClient: (id: number) => void;
  onOpenAddClient: () => void;
  onOpenManageAccounts?: () => void;
  onToggleAccount: (platform: string) => void;
  onNext?: () => void;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  onOpenAddClient,
  onOpenManageAccounts,
  onToggleAccount,
  onNext
}) => {

  const [searchQuery, setSearchQuery] = useState('');
  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const filteredClients = clients.filter(c => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      (c.business_type && c.business_type.toLowerCase().includes(q)) ||
      (c.social_accounts && c.social_accounts.some(acc => acc.account_handle?.toLowerCase().includes(q)))
    );
  });

  const platformMeta: Record<string, { label: string; type: string }> = {
    instagram: { label: 'Instagram Profile', type: 'Feed & Reels' },
    youtube: { label: 'YouTube Channel', type: 'Shorts & Videos' },
    facebook: { label: 'Facebook Page', type: 'Posts & Watch' },
    linkedin: { label: 'LinkedIn Company', type: 'Articles & Updates' },
  };

  const clientAccounts = currentClient?.social_accounts || [];

  return (
    <div className="card" style={{ padding: '28px' }}>
      
      {/* Step 1 Header */}
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <div>
          <div className="card-title" style={{ fontSize: '20px' }}>
            <span className="step-badge">1</span>
            <span>Select Client &amp; Connected Social Profiles</span>
          </div>
          <div className="card-subtitle" style={{ fontSize: '13px', marginTop: '4px' }}>
            Choose the target client organization to load tailored media presets and connected official social APIs.
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenAddClient}
          className="btn btn-secondary"
          style={{ padding: '9px 16px', fontSize: '13px', gap: '8px' }}
        >
          <Plus size={15} />
          <span>Add New Client</span>
        </button>
      </div>

      {/* 2-Column Layout: Available Clients (Left) + Connected Social Accounts (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '28px'
      }}>
        
        {/* Column 1: Client Selection */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b', margin: 0 }}>
              Step 1.1: Choose Client Organization
            </label>
            <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '500' }}>
              {searchQuery ? `${filteredClients.length} of ${clients.length}` : `${clients.length} Clients`}
            </span>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients by name or category..."
              className="input-text"
              style={{
                paddingLeft: '38px',
                paddingRight: searchQuery ? '36px' : '14px',
                fontSize: '13px'
              }}
            />
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                title="Clear search"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
            {filteredClients.length === 0 ? (
              <div style={{
                padding: '32px 20px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px dashed #cbd5e1',
                color: '#64748b',
                fontSize: '13px'
              }}>
                <Building2 size={28} color="#94a3b8" style={{ margin: '0 auto 10px auto', display: 'block' }} />
                <p style={{ margin: '0 0 10px 0', fontWeight: '600' }}>No clients found matching &quot;{searchQuery}&quot;</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="btn btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              filteredClients.map(c => {
                const isSelected = c.id === selectedClientId;
                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectClient(c.id)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--rust-50)' : '#ffffff',
                      color: 'var(--text-primary)',
                      border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: isSelected ? '0 2px 10px rgba(193, 53, 132, 0.18)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: isSelected ? 'linear-gradient(135deg, #833ab4 0%, #c13584 100%)' : 'var(--bg-secondary)',
                        color: isSelected ? '#ffffff' : 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '15px',
                        flexShrink: 0,
                        boxShadow: isSelected ? '0 2px 8px rgba(193, 53, 132, 0.25)' : 'none'
                      }}>
                        {c.name.charAt(0)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontSize: '14.5px',
                          fontWeight: '700',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: 'var(--text-primary)'
                        }}>
                          {c.name}
                        </div>
                        <div style={{
                          fontSize: '11.5px',
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginTop: '2px'
                        }}>
                          {c.business_type}
                        </div>
                        {/* Display badges for the accounts actually added for this client */}
                        <div style={{ display: 'flex', gap: '4px', marginTop: '6px', alignItems: 'center' }}>
                          {(c.social_accounts && c.social_accounts.length > 0) ? (
                            c.social_accounts.map(acc => (
                              <div
                                key={acc.platform}
                                style={{
                                  padding: '2px 4px',
                                  borderRadius: '4px',
                                  backgroundColor: isSelected ? 'var(--rust-100)' : 'var(--bg-secondary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <SocialIcon platform={acc.platform} size={12} />
                              </div>
                            ))
                          ) : (
                            <span style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>No accounts</span>
                          )}
                          <span style={{ fontSize: '11px', fontWeight: '600', marginLeft: '2px', color: 'var(--text-muted)' }}>
                            ({c.social_accounts?.length || 0})
                          </span>
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <span style={{
                        fontSize: '11.5px',
                        fontWeight: '700',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: 'linear-gradient(135deg, #833ab4 0%, #c13584 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <Check size={13} strokeWidth={3} /> Selected
                      </span>
                    ) : (
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '500', padding: '4px 8px' }}>
                        Select →
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2: Connected Social Channels for Selected Client */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <label className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', margin: 0 }}>
              Step 1.2: Connected Channels ({clientAccounts.length} Added)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {onOpenManageAccounts && (
                <button
                  type="button"
                  onClick={onOpenManageAccounts}
                  className="btn btn-secondary"
                  style={{
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    gap: '4px',
                    borderRadius: '8px'
                  }}
                  title="Add or update social media accounts for this client"
                >
                  <Plus size={13} />
                  <span>Manage / Add Accounts</span>
                </button>
              )}
              <span style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'linear-gradient(135deg, #e1306c, #f77737)', display: 'inline-block' }} /> Live API
              </span>
            </div>
          </div>


          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {clientAccounts.length === 0 ? (
              <div style={{
                padding: '32px 20px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-secondary)',
                border: '1.5px dashed var(--border-default)',
                borderRadius: '12px',
                color: 'var(--text-muted)'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  No Social Accounts Added
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', maxWidth: '320px', margin: '0 auto 14px auto' }}>
                  This client currently has 0 connected social profiles. Click "Add New Client" or connect accounts to start automating.
                </div>
                <button
                  type="button"
                  onClick={onOpenAddClient}
                  className="btn btn-secondary"
                  style={{ padding: '7px 14px', fontSize: '12px', gap: '6px' }}
                >
                  <Plus size={14} /> Add Social Account
                </button>
              </div>
            ) : (
              clientAccounts.map((account) => {
                const meta = platformMeta[account.platform.toLowerCase()] || {
                  label: `${account.platform.charAt(0).toUpperCase() + account.platform.slice(1)} Profile`,
                  type: 'Social Channel'
                };
                const isConnected = account.is_connected !== false;
                const displayName = account.account_handle || account.account_name || `@${currentClient?.name.toLowerCase().replace(/\s+/g, '')}`;

                return (
                  <div
                    key={account.id || account.platform}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#ffffff',
                      border: '1px solid var(--border-default)',
                      borderRadius: '12px',
                      boxShadow: '0 1px 3px rgba(25, 13, 34, 0.03)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <SocialIcon platform={account.platform} size={22} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {meta.label}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>
                          {displayName} • <span style={{ color: 'var(--text-dim)' }}>{meta.type}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleAccount(account.platform)}
                      style={{
                        cursor: 'pointer',
                        background: isConnected ? 'rgba(225, 48, 108, 0.12)' : 'var(--bg-secondary)',
                        color: isConnected ? 'var(--accent-secondary)' : 'var(--text-muted)',
                        border: `1px solid ${isConnected ? 'rgba(225, 48, 108, 0.35)' : 'var(--border-default)'}`,
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '5px 12px',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.15s ease'
                      }}
                      title="Click to toggle connection"
                    >
                      {isConnected ? (
                        <>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#e1306c' }} />
                          <span>Connected</span>
                        </>
                      ) : (
                        <>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-dim)' }} />
                          <span>Disconnected</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            )}

            {/* Clickable Card to Add/Edit Social Channels for Current Client */}
            {onOpenManageAccounts && (
              <button
                type="button"
                onClick={onOpenManageAccounts}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px dashed var(--rust-100)',
                  background: 'var(--rust-50)',
                  color: 'var(--accent-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  width: '100%',
                  marginTop: '4px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(193, 53, 132, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--rust-100)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Plus size={15} />
                <span>+ Add / Connect More Social Accounts for {currentClient?.name}</span>
              </button>
            )}
          </div>


          {/* Quick Tip Banner */}
          <div style={{
            marginTop: '14px',
            padding: '12px 14px',
            background: 'var(--rust-50)',
            border: '1px solid var(--rust-100)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12px',
            color: 'var(--accent-secondary)'
          }}>
            <Sparkles size={16} color="#e1306c" style={{ flexShrink: 0 }} />
            <span>
              {clientAccounts.length} connected platform{clientAccounts.length === 1 ? '' : 's'} configured with official Webhook pipelines for <strong style={{ color: 'var(--text-primary)' }}>{currentClient?.name}</strong>.
            </span>
          </div>

        </div>

      </div>

      {/* Footer Navigation */}
      <div className="wizard-nav-footer">
        <div style={{ fontSize: '13px', color: '#526759' }}>
          Selected: <strong style={{ color: '#112217' }}>{currentClient?.name}</strong> ({currentClient?.business_type})
        </div>

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="btn btn-primary"
            style={{ padding: '10px 22px', fontSize: '13px', gap: '8px' }}
          >
            <span>Proceed to Step 2: Select Media</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>

    </div>
  );
};
