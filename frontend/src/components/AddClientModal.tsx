'use client';

import React, { useState } from 'react';
import { X, Building2, Globe } from 'lucide-react';
import { SocialIcon } from './SocialIcons';

export interface ClientSocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  twitter?: string;
}

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (name: string, businessType: string, socialLinks?: ClientSocialLinks) => Promise<void>;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  onClose,
  onAddClient
}) => {
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('Healthcare & Multi-speciality Hospital');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onAddClient(name.trim(), businessType, {
        facebook: facebook.trim(),
        instagram: instagram.trim(),
        youtube: youtube.trim(),
        linkedin: linkedin.trim(),
        twitter: twitter.trim()
      });
      setName('');
      setFacebook('');
      setInstagram('');
      setYoutube('');
      setLinkedin('');
      setTwitter('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const nameSlug = name.trim().toLowerCase().replace(/\s+/g, '') || 'client';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', width: '100%', padding: '28px' }}
      >
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: '#09090b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#09090b', margin: 0, fontFamily: 'var(--font-serif)' }}>
                Add New Client Organization
              </h3>
              <p style={{ fontSize: '12px', color: '#71717a', margin: '2px 0 0 0' }}>
                Register client details and their social media channels
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-outline btn-icon"
            style={{ width: '32px', height: '32px', borderRadius: '8px' }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Client Details Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px',
            marginBottom: '18px'
          }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: '600' }}>
                Client / Hospital Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className="input-text"
                placeholder="e.g. Apex Heart Care Hospital"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: '600' }}>
                Business / Industry Category
              </label>
              <select
                className="select-input"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              >
                <option value="Healthcare & Multi-speciality Hospital">Healthcare &amp; Multi-speciality Hospital</option>
                <option value="Dental Clinic & Orthodontics">Dental Clinic &amp; Orthodontics</option>
                <option value="General Hospital & Diagnostics">General Hospital &amp; Diagnostics</option>
                <option value="Skin & Hair Aesthetic Clinic">Skin &amp; Hair Aesthetic Clinic</option>
                <option value="Eye Care & Optical Center">Eye Care &amp; Optical Center</option>
                <option value="Corporate / Enterprise Business">Corporate / Enterprise Business</option>
              </select>
            </div>
          </div>

          {/* Social Media Links Section */}
          <div style={{
            background: '#fafafa',
            border: '1px solid #e4e4e7',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Globe size={15} color="#09090b" />
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#09090b' }}>
                  Connected Social Media Links &amp; Profiles
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#71717a' }}>
                Auto-assigned if left blank
              </span>
            </div>

            {/* 2-Column Grid for the 4 Social Links */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px'
            }}>
              {/* Facebook */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#27272a', marginBottom: '5px' }}>
                  <SocialIcon platform="facebook" size={16} />
                  <span>Facebook Page Link / Handle</span>
                </label>
                <input
                  type="text"
                  className="input-text"
                  style={{ fontSize: '12px', padding: '8px 10px', background: '#ffffff' }}
                  placeholder={`e.g. facebook.com/${nameSlug} or @${nameSlug}`}
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>

              {/* Instagram */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#27272a', marginBottom: '5px' }}>
                  <SocialIcon platform="instagram" size={16} />
                  <span>Instagram Profile / Handle</span>
                </label>
                <input
                  type="text"
                  className="input-text"
                  style={{ fontSize: '12px', padding: '8px 10px', background: '#ffffff' }}
                  placeholder={`e.g. @${nameSlug} or instagram.com/${nameSlug}`}
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>

              {/* YouTube */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#27272a', marginBottom: '5px' }}>
                  <SocialIcon platform="youtube" size={16} />
                  <span>YouTube Channel Link / Handle</span>
                </label>
                <input
                  type="text"
                  className="input-text"
                  style={{ fontSize: '12px', padding: '8px 10px', background: '#ffffff' }}
                  placeholder={`e.g. youtube.com/@${nameSlug} or @${nameSlug}`}
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#27272a', marginBottom: '5px' }}>
                  <SocialIcon platform="linkedin" size={16} />
                  <span>LinkedIn Page / Company Link</span>
                </label>
                <input
                  type="text"
                  className="input-text"
                  style={{ fontSize: '12px', padding: '8px 10px', background: '#ffffff' }}
                  placeholder={`e.g. linkedin.com/company/${nameSlug}`}
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>

              {/* Twitter / X */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#27272a', marginBottom: '5px' }}>
                  <SocialIcon platform="twitter" size={16} />
                  <span>Twitter / X Profile / Handle</span>
                </label>
                <input
                  type="text"
                  className="input-text"
                  style={{ fontSize: '12px', padding: '8px 10px', background: '#ffffff' }}
                  placeholder={`e.g. @${nameSlug} or x.com/${nameSlug}`}
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '9px 18px', fontSize: '13px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="btn btn-primary"
              style={{ padding: '9px 22px', fontSize: '13px', fontWeight: '600' }}
            >
              {loading ? 'Creating Client...' : 'Create & Connect Client'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

