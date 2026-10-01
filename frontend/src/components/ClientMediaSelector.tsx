'use client';

import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Film,
  Image as ImageIcon,
  X,
  Check,
  Video,
  Play,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  FileCheck,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { CLIENT_MEDIA_LIBRARY, ClientMediaItem } from '../lib/clientMedia';

interface ClientMediaSelectorProps {
  selectedClientId: number;
  clientName: string;
  selectedMedia: ClientMediaItem | null;
  videoFilename: string;
  fileSizeMb: number;
  durationStr: string;
  mediaType?: 'video' | 'photo';
  onSelectMediaItem: (item: ClientMediaItem) => void;
  onFileUploaded: (file: File) => void;
  onClear: () => void;
  isUploading?: boolean;
  onBack?: () => void;
  onNext?: () => void;
}

export const ClientMediaSelector: React.FC<ClientMediaSelectorProps> = ({
  selectedClientId,
  clientName,
  selectedMedia,
  videoFilename,
  fileSizeMb,
  durationStr,
  mediaType = 'video',
  onSelectMediaItem,
  onFileUploaded,
  onClear,
  isUploading,
  onBack,
  onNext
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'video' | 'photo'>('all');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get media for current client
  const clientMediaList = CLIENT_MEDIA_LIBRARY[selectedClientId] || [];

  const filteredMediaList = clientMediaList.filter(item => {
    if (mediaFilter === 'all') return true;
    const isPhoto = item.mediaType === 'photo' || item.filename.match(/\.(jpg|jpeg|png|webp)$/i);
    return mediaFilter === 'photo' ? isPhoto : !isPhoto;
  });

  const isCurrentPhoto = selectedMedia?.mediaType === 'photo' || videoFilename.match(/\.(jpg|jpeg|png|webp)$/i);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragOver(true);
    } else if (e.type === 'dragleave') {
      setDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUploaded(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUploaded(e.target.files[0]);
    }
  };

  return (
    <div className="card" style={{ padding: '28px' }}>
      
      {/* Step 2 Header */}
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <div>
          <div className="card-title" style={{ fontSize: '20px' }}>
            <span className="step-badge">2</span>
            <span>Select Media Asset (Videos &amp; Photos)</span>
          </div>
          <div className="card-subtitle" style={{ fontSize: '13px', marginTop: '4px' }}>
            Choose a pre-rendered production asset for <strong style={{ color: '#2c2520' }}>{clientName}</strong> or upload a custom file.
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Media Picker (Left) + Media Inspector & Details (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '28px'
      }}>

        {/* Left Column: Media Selection / Upload */}
        <div>
          {/* Sub Tabs: Client Library vs Direct Upload */}
          <div style={{
            display: 'flex',
            gap: '6px',
            backgroundColor: 'var(--bg-secondary)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--border-default)',
            marginBottom: '16px'
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              style={{
                flex: 1,
                padding: '9px 14px',
                backgroundColor: activeTab === 'library' ? '#ffffff' : 'transparent',
                color: activeTab === 'library' ? 'var(--accent-secondary)' : 'var(--text-muted)',
                fontSize: '12.5px',
                fontWeight: '700',
                borderRadius: '8px',
                border: activeTab === 'library' ? '1px solid var(--rust-100)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
                boxShadow: activeTab === 'library' ? '0 1px 3px rgba(193, 53, 132, 0.12)' : 'none'
              }}
            >
              <Layers size={15} />
              <span>Media Library ({clientMediaList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              style={{
                flex: 1,
                padding: '9px 14px',
                backgroundColor: activeTab === 'upload' ? '#ffffff' : 'transparent',
                color: activeTab === 'upload' ? 'var(--accent-secondary)' : 'var(--text-muted)',
                fontSize: '12.5px',
                fontWeight: '700',
                borderRadius: '8px',
                border: activeTab === 'upload' ? '1px solid var(--rust-100)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
                boxShadow: activeTab === 'upload' ? '0 1px 3px rgba(193, 53, 132, 0.12)' : 'none'
              }}
            >
              <UploadCloud size={15} />
              <span>Upload Custom Asset</span>
            </button>
          </div>

          {/* Tab 1: Client Media Library */}
          {activeTab === 'library' && (
            <div>
              {/* Type Filter Pills: All / Videos / Photos */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                {[
                  { id: 'all', label: `All Assets (${clientMediaList.length})` },
                  { id: 'video', label: 'Videos 🎥' },
                  { id: 'photo', label: 'Photos 📸' }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setMediaFilter(f.id as any)}
                    style={{
                      padding: '5px 12px',
                      fontSize: '11.5px',
                      fontWeight: mediaFilter === f.id ? '700' : '500',
                      borderRadius: '8px',
                      border: `1px solid ${mediaFilter === f.id ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                      backgroundColor: mediaFilter === f.id ? 'var(--accent-primary)' : '#ffffff',
                      color: mediaFilter === f.id ? '#ffffff' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* List of items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                {filteredMediaList.map(item => {
                  const isSelected = videoFilename === item.filename;
                  const itemIsPhoto = item.mediaType === 'photo' || item.filename.match(/\.(jpg|jpeg|png|webp)$/i);

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectMediaItem(item)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '12px',
                        backgroundColor: isSelected ? 'var(--rust-50)' : '#ffffff',
                        border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 4px 14px rgba(193, 53, 132, 0.18)' : '0 1px 3px rgba(25, 13, 34, 0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            background: isSelected ? 'linear-gradient(135deg, #833ab4 0%, #c13584 100%)' : 'var(--bg-secondary)',
                            color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {itemIsPhoto ? <ImageIcon size={20} /> : <Film size={20} />}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.title}
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {item.filename}
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            background: 'linear-gradient(135deg, #833ab4 0%, #c13584 100%)',
                            color: '#ffffff',
                            fontSize: '11px',
                            fontWeight: '700',
                            flexShrink: 0
                          }}>
                            <Check size={12} strokeWidth={3} /> Selected
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: 'var(--bg-secondary)',
                            flexShrink: 0
                          }}>
                            {item.durationStr}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11.5px', color: '#64748b' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: itemIsPhoto ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: itemIsPhoto ? '#2563eb' : '#dc2626',
                          fontWeight: '700',
                          fontSize: '10.5px'
                        }}>
                          {itemIsPhoto ? 'PHOTO' : 'VIDEO'}
                        </span>
                        <span>Size: <strong style={{ color: '#334155' }}>{item.fileSizeMb} MB</strong></span>
                        <span>•</span>
                        <span>Duration: <strong style={{ color: '#334155' }}>{item.durationStr}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Upload Custom Media */}
          {activeTab === 'upload' && (
            <div>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? '#4f46e5' : '#cbd5e1'}`,
                  borderRadius: '16px',
                  padding: '40px 24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragOver ? 'rgba(99, 102, 241, 0.05)' : '#f8fafc',
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,image/*"
                  style={{ display: 'none' }}
                  onChange={handleChange}
                />
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px auto'
                }}>
                  <UploadCloud size={26} color="#4f46e5" />
                </div>

                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                  Upload Video or Photo for {clientName}
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 16px 0' }}>
                  Drag &amp; drop MP4, MOV, WEBM, JPG, PNG or WEBP here
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '8px 18px', fontSize: '12.5px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Browse Device Storage
                </button>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '14px' }}>
                  Maximum file size: 500 MB • Automatic HD transcoding
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Selected Media Asset Inspector */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b', margin: 0 }}>
              Selected Media Asset
            </label>
            <span style={{ fontSize: '11.5px', color: '#10b981', fontWeight: '600', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '3px 9px', borderRadius: '12px' }}>
              ✓ Asset Ready for Campaign
            </span>
          </div>

          {videoFilename ? (
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)'
            }}>
              {/* Media Display Preview Box */}
              <div style={{
                height: '240px',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {isCurrentPhoto ? (
                  <div style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(6px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px auto'
                    }}>
                      <ImageIcon size={30} color="#ffffff" />
                    </div>
                    <div style={{ fontSize: '14.5px', fontWeight: '700' }}>{selectedMedia?.title || videoFilename}</div>
                    <div style={{ fontSize: '11.5px', opacity: 0.8, marginTop: '3px' }}>High-Resolution Photo Asset (1080x1080)</div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#ffffff' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px auto',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                    }}>
                      <Play size={24} color="#ffffff" fill="#ffffff" style={{ marginLeft: '3px' }} />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>{selectedMedia?.title || videoFilename}</div>
                    <span style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '6px', marginTop: '8px', display: 'inline-block' }}>
                      Duration: {durationStr}
                    </span>
                  </div>
                )}

                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  {isCurrentPhoto ? '📸 Photo' : '🎥 Video Reel'}
                </span>
              </div>

              {/* Asset Metadata & Compatibility Details */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontSize: '15.5px', fontWeight: '800', color: '#0f172a' }}>
                    {selectedMedia?.title || videoFilename}
                  </div>
                  <button
                    type="button"
                    onClick={onClear}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                    title="Deselect media"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                  <span>File: <strong style={{ color: '#0f172a' }}>{videoFilename}</strong></span>
                  <span>•</span>
                  <span>Size: <strong style={{ color: '#0f172a' }}>{fileSizeMb} MB</strong></span>
                  <span>•</span>
                  <span>Type: <strong style={{ color: '#0f172a' }}>{isCurrentPhoto ? 'Photo' : 'Video'}</strong></span>
                </div>

                {/* Multi-Platform Social Compatibility */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="#10b981" />
                    <span>Cross-Platform Readiness:</span>
                  </div>
                  <div style={{ color: '#475569', fontSize: '11.5px', lineHeight: '1.45' }}>
                    {isCurrentPhoto
                      ? '✓ Formatted for Instagram Feed/Carousel, Facebook Posts & LinkedIn Updates.'
                      : '✓ Formatted for Instagram Reels (9:16), YouTube 1080p & Facebook Watch.'}
                  </div>
                </div>

                {/* Workflow Guidance Alert */}
                <div style={{
                  padding: '12px 14px',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '10px',
                  fontSize: '11.5px',
                  color: '#065f46',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600'
                }}>
                  <Sparkles size={15} color="#10b981" style={{ flexShrink: 0 }} />
                  <span>Next Step: Generate tailored AI captions &amp; hashtags, then inspect full device previews!</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              height: '340px',
              border: '2px dashed #cbd5e1',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: '#f8fafc'
            }}>
              <Film size={40} color="#94a3b8" style={{ marginBottom: '14px' }} />
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                No Media Selected Yet
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '6px', maxWidth: '300px', lineHeight: '1.45' }}>
                Select a video or photo from the library on the left or upload a file from your device.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Footer Navigation */}
      <div className="wizard-nav-footer">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary"
            style={{ padding: '10px 18px', fontSize: '13px', gap: '8px' }}
          >
            <ArrowLeft size={15} />
            <span>Back to Client Selection</span>
          </button>
        )}

        <div style={{ marginLeft: 'auto' }}>
          {onNext && (
            <button
              type="button"
              disabled={!videoFilename}
              onClick={onNext}
              className="btn btn-primary"
              style={{ padding: '11px 22px', fontSize: '13.5px', gap: '8px' }}
            >
              <span>Proceed to Captions &amp; Details</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
