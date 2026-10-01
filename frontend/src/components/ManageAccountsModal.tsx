'use client';

import React, { useState, useEffect } from 'react';
import { Client } from '../lib/types';
import { SocialIcon } from './SocialIcons';
import { X, Check, Save, Trash2, Sparkles, ExternalLink, Link2 } from 'lucide-react';
import { api } from '../lib/api';

interface ManageAccountsModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onAccountsUpdated: (updatedClient: Client) => void;
}

export const ManageAccountsModal: React.FC<ManageAccountsModalProps> = ({
  client,
  isOpen,
  onClose,
  onAccountsUpdated
}) => {
  const [links, setLinks] = useState({
    instagram: '',
    facebook: '',
    youtube: '',
    linkedin: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [systemYtChannel, setSystemYtChannel] = useState<string | null>(null);
  const [systemFbPage, setSystemFbPage] = useState<string | null>(null);
  const [systemIgAccount, setSystemIgAccount] = useState<string | null>(null);
  const [systemLinkedInAuthor, setSystemLinkedInAuthor] = useState<string | null>(null);

  useEffect(() => {
    if (client) {
      const existing: Record<string, string> = {
        instagram: '',
        facebook: '',
        youtube: '',
        linkedin: ''
      };
      if (client.social_accounts) {
        client.social_accounts.forEach(acc => {
          const plat = acc.platform.toLowerCase();
          if (plat in existing) {
            existing[plat] = acc.account_handle || acc.account_name || '';
          }
        });
      }
      setLinks(existing as any);
    }

    // Check system's connected YouTube channel
    api.getYouTubeStatus()
      .then(res => {
        if (res.channel?.custom_url) {
          setSystemYtChannel(res.channel.custom_url);
        } else if (res.channel?.title) {
          setSystemYtChannel(res.channel.title);
        }
      })
      .catch(() => {});

    // Check system's connected Meta Facebook Pages & Instagram accounts
    api.getMetaStatus(false)
      .then(res => {
        if (res.pages && res.pages.length > 0) {
          setSystemFbPage(res.pages[0].name);
        }
        if (res.instagram_accounts && res.instagram_accounts.length > 0) {
          setSystemIgAccount(res.instagram_accounts[0].username);
        }
      })
      .catch(() => {});

    // Check system's connected LinkedIn author
    api.getLinkedInStatus(false)
      .then(res => {
        if (res.author?.name) {
          setSystemLinkedInAuthor(res.author.name);
        }
      })
      .catch(() => {});
  }, [client, isOpen]);

  if (!isOpen || !client) return null;

  const platforms = [
    {
      key: 'youtube' as const,
      label: 'YouTube Channel',
      placeholder: 'e.g. @bhartisingh-e9h or youtube.com/@channel',
      desc: 'Used for Shorts, long-form videos & Community posts',
      connectedChannel: systemYtChannel
    },
    {
      key: 'instagram' as const,
      label: 'Instagram Profile',
      placeholder: 'e.g. @yourbusiness or instagram.com/handle',
      desc: 'Used for Reels, Feed carousels & Stories'
    },
    {
      key: 'facebook' as const,
      label: 'Facebook Page',
      placeholder: 'e.g. facebook.com/yourpage or @pagename',
      desc: 'Used for Page Videos, Reels & status updates'
    },
    {
      key: 'linkedin' as const,
      label: 'LinkedIn Organization / Profile',
      placeholder: 'e.g. linkedin.com/company/name or @handle',
      desc: 'Used for professional updates & company video posts'
    }
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await api.updateClientAccounts(client.id, links);
      onAccountsUpdated(updated);
      onClose();
    } catch (err: any) {
      alert(`Failed to save accounts: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUseConnectedYouTube = () => {
    if (systemYtChannel) {
      setLinks(prev => ({ ...prev, youtube: systemYtChannel }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1050 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #833ab4 0%, #c13584 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '800'
            }}>
              {client.name.charAt(0)}
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                Manage Social Accounts
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Client: <strong>{client.name}</strong> • {client.business_type}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline btn-icon"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
          Add or edit social media profiles for this client anytime. Accounts added here will instantly be available for multi-platform video publishing.
        </p>

        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
            {platforms.map(p => {
              const currentValue = links[p.key];
              const isConfigured = Boolean(currentValue && currentValue.trim());

              return (
                <div
                  key={p.key}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: `1.5px solid ${isConfigured ? 'var(--rust-100)' : 'var(--border-default)'}`,
                    background: isConfigured ? '#fffdfd' : '#fcfcfc',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <SocialIcon platform={p.key} size={20} />
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {p.label}
                      </span>
                    </div>

                    {isConfigured ? (
                      <span style={{
                        fontSize: '10.5px',
                        fontWeight: '700',
                        color: '#15803d',
                        background: '#dcfce7',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <Check size={11} strokeWidth={3} /> Active
                      </span>
                    ) : (
                      <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', fontWeight: '500' }}>
                        Not configured
                      </span>
                    )}
                  </div>

                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => setLinks(prev => ({ ...prev, [p.key]: e.target.value }))}
                      placeholder={p.placeholder}
                      className="input-text"
                      style={{ fontSize: '12.5px', padding: '9px 12px' }}
                    />
                    {currentValue && (
                      <button
                        type="button"
                        onClick={() => setLinks(prev => ({ ...prev, [p.key]: '' }))}
                        title="Remove this account"
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <Trash2 size={13} color="#ef4444" />
                      </button>
                    )}
                  </div>

                  {/* YouTube Shortcut: Use Connected Google Account */}
                  {p.key === 'youtube' && systemYtChannel && currentValue !== systemYtChannel && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#15803d' }}>
                        ✓ Google OAuth: <strong>{systemYtChannel}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleUseConnectedYouTube}
                        style={{
                          background: '#fef2f2',
                          border: '1px solid #fee2e2',
                          color: '#b91c1c',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '10.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        + Use This Channel
                      </button>
                    </div>
                  )}

                  {/* Facebook Shortcut: Use Connected Meta Facebook Page */}
                  {p.key === 'facebook' && systemFbPage && currentValue !== systemFbPage && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#15803d' }}>
                        ✓ Meta Page: <strong>{systemFbPage}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setLinks(prev => ({ ...prev, facebook: systemFbPage }))}
                        style={{
                          background: '#eff6ff',
                          border: '1px solid #dbeafe',
                          color: '#1d4ed8',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '10.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        + Use This Page
                      </button>
                    </div>
                  )}

                  {/* Instagram Shortcut: Use Connected Instagram Account */}
                  {p.key === 'instagram' && systemIgAccount && currentValue !== `@${systemIgAccount}` && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#15803d' }}>
                        ✓ Meta IG: <strong>@{systemIgAccount}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setLinks(prev => ({ ...prev, instagram: `@${systemIgAccount}` }))}
                        style={{
                          background: '#fdf2f8',
                          border: '1px solid #fce7f3',
                          color: '#be185d',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '10.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        + Use This Profile
                      </button>
                    </div>
                  )}

                  {/* LinkedIn Shortcut: Use Connected LinkedIn Profile */}
                  {p.key === 'linkedin' && systemLinkedInAuthor && currentValue !== systemLinkedInAuthor && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#15803d' }}>
                        ✓ LinkedIn: <strong>{systemLinkedInAuthor}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setLinks(prev => ({ ...prev, linkedin: systemLinkedInAuthor }))}
                        style={{
                          background: '#f0fdf4',
                          border: '1px solid #dcfce7',
                          color: '#15803d',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '10.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        + Use This Profile
                      </button>
                    </div>
                  )}

                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>
                    {p.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary"
              style={{ padding: '8px 20px', fontSize: '13px', gap: '6px' }}
            >
              <Save size={14} />
              <span>{isSaving ? 'Saving...' : 'Save Social Accounts'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
