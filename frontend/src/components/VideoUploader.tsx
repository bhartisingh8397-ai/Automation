'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, FileVideo, X, CheckCircle, Film } from 'lucide-react';

interface VideoUploaderProps {
  videoFile: File | null;
  videoFilename: string;
  fileSizeMb: number;
  durationStr: string;
  onFileSelected: (file: File) => void;
  onClear: () => void;
  isUploading?: boolean;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  videoFile,
  videoFilename,
  fileSizeMb,
  durationStr,
  onFileSelected,
  onClear,
  isUploading = false
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div className="card" style={{ height: '100%' }}>
      {/* Card Header matching Step 3 */}
      <div className="card-header">
        <div>
          <div className="card-title">
            <span className="step-badge">3</span>
            <span>Upload Video</span>
          </div>
          <div className="card-subtitle">
            Upload your video directly from your device. (No Google Drive needed!)
          </div>
        </div>
      </div>

      <div style={{ marginTop: '12px' }}>
        
        {/* Dropzone */}
        {!videoFilename ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#09090b' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '30px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? '#f4f4f5' : '#fafafa',
              transition: 'var(--transition)'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              style={{ display: 'none' }}
              onChange={handleChange}
            />
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#f4f4f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto'
            }}>
              <UploadCloud size={20} color="#09090b" />
            </div>

            <div style={{ fontSize: '13px', fontWeight: '600', color: '#09090b' }}>
              Drag &amp; Drop Video Here
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', margin: '4px 0 10px 0' }}>
              or
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontSize: '12px' }}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse File
            </button>

            <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '12px' }}>
              Supports MP4, MOV, MKV, WebM up to 250MB
            </div>
          </div>
        ) : (
          /* Selected File Preview Card matching diagram */
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-active)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
            position: 'relative'
          }}>
            <button
              type="button"
              onClick={onClear}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                color: 'var(--text-dim)',
                padding: '4px',
                borderRadius: '4px'
              }}
              title="Remove video"
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {/* Thumbnail / Video icon container */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '6px',
                background: '#f4f4f5',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Film size={26} color="var(--text-muted)" />
                <span style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '3px',
                  fontSize: '9px',
                  background: 'rgba(0,0,0,0.8)',
                  padding: '1px 3px',
                  borderRadius: '2px',
                  color: '#ffffff'
                }}>
                  {durationStr}
                </span>
              </div>

              {/* File details */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#09090b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {videoFilename}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    {durationStr}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>•</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    {fileSizeMb} MB
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                  <CheckCircle size={12} color="#22c55e" />
                  <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: '500' }}>
                    {isUploading ? 'Uploading to server...' : 'Ready for automation'}
                  </span>
                </div>
              </div>
            </div>

            {/* Replace button */}
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '4px 10px', fontSize: '11px' }}
                onClick={() => fileInputRef.current?.click()}
              >
                Change Video
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                style={{ display: 'none' }}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
