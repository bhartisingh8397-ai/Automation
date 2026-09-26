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
  FileCheck
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
      <div className="card-header" style={{ marginBottom: '22px' }}>
        <div>
          <div className="card-title" style={{ fontSize: '20px' }}>
            <span className="step-badge">2</span>
            <span>Select Media (Videos &amp; Photos)</span>
          </div>
          <div className="card-subtitle" style={{ fontSize: '13px', marginTop: '4px' }}>
            Choose a video or photo asset from the media library for <strong style={{ color: '#09090b' }}>{clientName}</strong> or upload a custom file.
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
            gap: '4px',
            backgroundColor: '#f4f4f5',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid #e4e4e7',
            marginBottom: '16px'
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              style={{
                flex: 1,
                padding: '8px 12px',
                backgroundColor: activeTab === 'library' ? '#ffffff' : 'transparent',
                color: activeTab === 'library' ? '#09090b' : '#71717a',
                fontSize: '12px',
                fontWeight: '700',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
                boxShadow: activeTab === 'library' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
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
                padding: '8px 12px',
                backgroundColor: activeTab === 'upload' ? '#ffffff' : 'transparent',
                color: activeTab === 'upload' ? '#09090b' : '#71717a',
                fontSize: '12px',
                fontWeight: '700',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
                boxShadow: activeTab === 'upload' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <UploadCloud size={15} />
              <span>Upload Video / Photo</span>
            </button>
          </div>

          {/* Tab 1: Client Media Library */}
          {activeTab === 'library' && (
            <div>
              {/* Type Filter Pills: All / Videos / Photos */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {[
                  { id: 'all', label: `All (${clientMediaList.length})` },
                  { id: 'video', label: 'Videos 🎥' },
                  { id: 'photo', label: 'Photos 📸' }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setMediaFilter(f.id as any)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: mediaFilter === f.id ? '700' : '500',
                      borderRadius: '6px',
                      border: `1px solid ${mediaFilter === f.id ? '#09090b' : '#e4e4e7'}`,
                      backgroundColor: mediaFilter === f.id ? '#09090b' : '#ffffff',
                      color: mediaFilter === f.id ? '#ffffff' : '#71717a',
                      cursor: 'pointer'
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
                        padding: '12px 14px',
                        borderRadius: '10px',
                        backgroundColor: isSelected ? '#f8f9fa' : '#ffffff',
                        border: `1.5px solid ${isSelected ? '#09090b' : '#e4e4e7'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 3px 12px rgba(0,0,0,0.06)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: isSelected ? '#09090b' : '#f4f4f5',
                            color: isSelected ? '#ffffff' : '#27272a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {itemIsPhoto ? <ImageIcon size={18} /> : <Film size={18} />}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#09090b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.title}
                            </div>
                            <div style={{ fontSize: '11px', color: '#71717a' }}>
                              {item.filename}
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: '700',
                            color: '#ffffff',
                            backgroundColor: '#09090b',
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            flexShrink: 0
                          }}>
                            <Check size={12} strokeWidth={3} /> Selected
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '11px',
                            color: '#52525b',
                            backgroundColor: '#f4f4f5',
                            border: '1px solid #e4e4e7',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            flexShrink: 0
                          }}>
                            Select
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#71717a', paddingTop: '6px', borderTop: '1px solid #f4f4f5' }}>
                        <span style={{
                          backgroundColor: itemIsPhoto ? '#eff6ff' : '#f4f4f5',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          color: itemIsPhoto ? '#2563eb' : '#27272a',
                          fontWeight: '600'
                        }}>
                          {itemIsPhoto ? '📸 Photo Asset' : `🎥 Video (${item.category})`}
                        </span>
                        <span>{item.durationStr} • {item.fileSizeMb} MB</span>
                      </div>
                    </div>
                  );
                })}

                {filteredMediaList.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '36px 16px', color: '#71717a', fontSize: '13px' }}>
                    No media matching this filter. Switch to &quot;Upload Video / Photo&quot; to add custom media!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Upload File (Video or Photo) */}
          {activeTab === 'upload' && (
            <div>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? '#09090b' : '#d4d4d8'}`,
                  borderRadius: '12px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragOver ? '#f4f4f5' : '#fafafa',
                  transition: 'all 0.15s ease'
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
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#f4f4f5',
                  border: '1px solid #e4e4e7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto'
                }}>
                  <UploadCloud size={24} color="#09090b" />
                </div>

                <div style={{ fontSize: '14px', fontWeight: '700', color: '#09090b' }}>
                  Upload Video or Photo for {clientName}
                </div>
                <div style={{ fontSize: '12px', color: '#71717a', margin: '4px 0 14px 0' }}>
                  Drag &amp; drop video (MP4, MOV) or photo (JPG, PNG, WEBP) here
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '6px 16px', fontSize: '12px', backgroundColor: '#ffffff', border: '1px solid #e4e4e7' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Browse Device Storage
                </button>
                <div style={{ fontSize: '11px', color: '#71717a', marginTop: '12px' }}>
                  Supports MP4, MOV, MKV, JPG, PNG, WEBP up to 250MB
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Selected Media Asset Inspector */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#71717a', margin: 0 }}>
              Selected Media Asset
            </label>
            <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '12px' }}>
              ✓ Asset Ready for Captioning
            </span>
          </div>

          {videoFilename ? (
            <div style={{
              background: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 4px 18px rgba(0,0,0,0.05)'
            }}>
              {/* Media Display Preview Box */}
              <div style={{
                height: '240px',
                backgroundColor: '#09090b',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {isCurrentPhoto ? (
                  <div style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px auto'
                    }}>
                      <ImageIcon size={28} color="#ffffff" />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>{selectedMedia?.title || videoFilename}</div>
                    <div style={{ fontSize: '11px', opacity: 0.75, marginTop: '2px' }}>High-Resolution Photo Asset</div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#ffffff' }}>
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(6px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px auto',
                      cursor: 'pointer'
                    }}>
                      <Play size={22} color="#ffffff" fill="#ffffff" style={{ marginLeft: '2px' }} />
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700' }}>{selectedMedia?.title || videoFilename}</div>
                    <span style={{ fontSize: '10px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', marginTop: '6px', display: 'inline-block' }}>
                      {durationStr}
                    </span>
                  </div>
                )}

                <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0,0,0,0.75)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  {isCurrentPhoto ? '📸 Photo' : '🎥 Video'}
                </span>
              </div>

              {/* Asset Metadata & Compatibility Details */}
              <div style={{ padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#09090b' }}>
                    {selectedMedia?.title || videoFilename}
                  </div>
                  <button
                    type="button"
                    onClick={onClear}
                    style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', padding: '4px' }}
                    title="Deselect media"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: '#71717a', marginBottom: '14px' }}>
                  <span>File: <strong style={{ color: '#27272a' }}>{videoFilename}</strong></span>
                  <span>•</span>
                  <span>Size: <strong style={{ color: '#27272a' }}>{fileSizeMb} MB</strong></span>
                  <span>•</span>
                  <span>Type: <strong style={{ color: '#27272a' }}>{isCurrentPhoto ? 'Photo' : 'Video'}</strong></span>
                </div>

                {/* Multi-Platform Social Compatibility */}
                <div style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e4e4e7',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '12px',
                  marginBottom: '14px'
                }}>
                  <div style={{ fontWeight: '700', color: '#09090b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color="#16a34a" />
                    <span>Cross-Platform Ready:</span>
                  </div>
                  <div style={{ color: '#52525b', fontSize: '11px', lineHeight: '1.4' }}>
                    {isCurrentPhoto
                      ? '✓ Optimized for Instagram Carousel/Feed, Twitter Photos, Facebook Posts & LinkedIn Updates.'
                      : '✓ Optimized for Instagram Reels (9:16), Twitter Video Tweets, YouTube 1080p & Facebook Watch.'}
                  </div>
                </div>

                {/* Workflow Guidance Alert */}
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600'
                }}>
                  <Sparkles size={14} color="#16a34a" />
                  <span>Next Step: Generate tailored AI captions &amp; hashtags, then view full interactive previews!</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              height: '340px',
              border: '2px dashed #e4e4e7',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#71717a',
              padding: '20px',
              textAlign: 'center'
            }}>
              <Film size={38} color="#d4d4d8" style={{ marginBottom: '12px' }} />
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#27272a' }}>
                No Media Selected Yet
              </div>
              <p style={{ fontSize: '12px', color: '#71717a', marginTop: '4px', maxWidth: '280px', lineHeight: '1.4' }}>
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
            className="btn btn-outline"
            style={{ padding: '10px 18px', fontSize: '13px', gap: '8px', backgroundColor: '#ffffff', border: '1px solid #e4e4e7' }}
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
              style={{ padding: '11px 22px', fontSize: '13px', gap: '8px' }}
            >
              <span>Proceed to Captions &amp; Details</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
