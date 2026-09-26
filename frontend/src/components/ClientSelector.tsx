'use client';

import React, { useState } from 'react';
import { Client } from '../lib/types';
import { SocialIcon } from './SocialIcons';
import { Plus, Check, ArrowRight, Building2, CheckCircle2, Search, X } from 'lucide-react';

interface ClientSelectorProps {
  clients: Client[];
  selectedClientId: number;
  onSelectClient: (id: number) => void;
  onOpenAddClient: () => void;
  onToggleAccount: (platform: string) => void;
  onNext?: () => void;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  onOpenAddClient,
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

  const defaultAccounts = [
    { platform: 'facebook', label: 'Facebook Page', name: currentClient ? `${currentClient.name} Official Page` : 'Facebook Page', handle: '@page' },
    { platform: 'instagram', label: 'Instagram Profile', name: currentClient ? `@${currentClient.name.toLowerCase().replace(/\s+/g, '_')}` : '@instagram', handle: '@instagram' },
    { platform: 'youtube', label: 'YouTube Channel', name: currentClient ? `${currentClient.name} Official` : 'YouTube Channel', handle: '@channel' },
    { platform: 'linkedin', label: 'LinkedIn Company', name: currentClient ? `${currentClient.name}` : 'LinkedIn Page', handle: 'company' },
    { platform: 'twitter', label: 'Twitter / X Profile', name: currentClient ? `@${currentClient.name.toLowerCase().replace(/\s+/g, '')}` : '@twitter', handle: '@twitter' }
  ];

  return (
    <div className="card" style={{ padding: '28px' }}>
      
      {/* Step 1 Header */}
      <div className="card-header" style={{ marginBottom: '22px' }}>
        <div>
          <div className="card-title" style={{ fontSize: '20px' }}>
            <span className="step-badge">1</span>
            <span>Select Client &amp; Connected Social Profiles</span>
          </div>
          <div className="card-subtitle" style={{ fontSize: '13px', marginTop: '4px' }}>
            Choose the client organization and verify their connected social media accounts.
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenAddClient}
          className="btn btn-outline"
          style={{ padding: '8px 14px', fontSize: '12px', gap: '6px', backgroundColor: '#ffffff', border: '1px solid #e4e4e7' }}
        >
          <Plus size={14} />
          <span>Add New Client</span>
        </button>
      </div>

      {/* 2-Column Layout: Available Clients (Left) + Connected Social Accounts (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        
        {/* Column 1: Client Selection */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#71717a', margin: 0 }}>
              Step 1.1: Choose Client
            </label>
            <span style={{ fontSize: '11px', color: '#71717a' }}>
              {searchQuery ? `${filteredClients.length} of ${clients.length}` : `${clients.length} Available`}
            </span>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients by name or type..."
              style={{
                width: '100%',
                padding: '9px 34px 9px 34px',
                borderRadius: '8px',
                border: '1px solid #e4e4e7',
                fontSize: '13px',
                color: '#09090b',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
            <Search size={15} color="#71717a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
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
                  color: '#71717a',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '2px' }}>
            {filteredClients.length === 0 ? (
              <div style={{
                padding: '24px 16px',
                textAlign: 'center',
                backgroundColor: '#fafafa',
                borderRadius: '10px',
                border: '1px dashed #e4e4e7',
                color: '#71717a',
                fontSize: '13px'
              }}>
                <Building2 size={24} color="#a1a1aa" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>No clients found matching &quot;{searchQuery}&quot;</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="btn btn-outline"
                  style={{ padding: '4px 12px', fontSize: '11px', backgroundColor: '#ffffff' }}
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
                    borderRadius: '10px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#09090b' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#09090b',
                    border: `1px solid ${isSelected ? '#09090b' : '#e4e4e7'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 14px rgba(0, 0, 0, 0.12)' : '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#ffffff' : '#f4f4f5',
                      color: isSelected ? '#09090b' : '#27272a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '14px',
                      flexShrink: 0
                    }}>
                      {c.name.charAt(0)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: isSelected ? '#ffffff' : '#09090b'
                      }}>
                        {c.name}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: isSelected ? '#a1a1aa' : '#71717a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '2px'
                      }}>
                        {c.business_type}
                      </div>
                    </div>
                  </div>

                  {isSelected ? (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: '#ffffff',
                      color: '#09090b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Check size={12} strokeWidth={3} /> Selected
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#71717a', padding: '4px 8px' }}>
                      Click to Select
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#71717a', margin: 0 }}>
              Step 1.2: Connected Social Accounts ({currentClient?.name})
            </label>
            <span style={{ fontSize: '11px', color: '#71717a' }}>
              5 Connected Social APIs
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {defaultAccounts.map((item) => {
              const account = currentClient?.social_accounts?.find(
                a => a.platform.toLowerCase() === item.platform.toLowerCase()
              );
              const isConnected = account ? account.is_connected : true;
              const displayName = account ? (account.account_handle || account.account_name) : item.name;

              return (
                <div
                  key={item.platform}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: '#f8f9fa',
                    border: '1px solid #e4e4e7',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                    <SocialIcon platform={item.platform} size={24} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#09090b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '11px', color: '#71717a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>
                        {displayName}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleAccount(item.platform)}
                    style={{
                      cursor: 'pointer',
                      background: isConnected ? '#09090b' : '#ffffff',
                      color: isConnected ? '#ffffff' : '#71717a',
                      border: `1px solid ${isConnected ? '#09090b' : '#e4e4e7'}`,
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      transition: 'all 0.15s ease'
                    }}
                    title="Click to toggle connection"
                  >
                    {isConnected ? '✓ Connected' : 'Disconnected'}
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: '14px',
            padding: '12px',
            background: '#ffffff',
            border: '1px dashed #e4e4e7',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            color: '#71717a'
          }}>
            <CheckCircle2 size={14} color="#16a34a" />
            <span>Posting tokens &amp; API credentials active for {currentClient?.name}.</span>
          </div>
        </div>

      </div>

      {/* Footer Navigation */}
      <div className="wizard-nav-footer">
        <div style={{ fontSize: '12px', color: '#71717a' }}>
          Current Client: <strong style={{ color: '#09090b' }}>{currentClient?.name}</strong>
        </div>

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="btn btn-primary"
            style={{ padding: '11px 22px', fontSize: '13px', gap: '8px' }}
          >
            <span>Proceed to Select Media &amp; Preview</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>

    </div>
  );
};
