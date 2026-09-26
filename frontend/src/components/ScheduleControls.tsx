'use client';

import React from 'react';
import { Calendar, Clock, Globe, Send, Loader2 } from 'lucide-react';

interface ScheduleControlsProps {
  scheduleType: 'now' | 'later';
  onScheduleTypeChange: (type: 'now' | 'later') => void;
  scheduleDate: string;
  onDateChange: (date: string) => void;
  scheduleTime: string;
  onTimeChange: (time: string) => void;
  timezone: string;
  onTimezoneChange: (tz: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  disabled: boolean;
}

export const ScheduleControls: React.FC<ScheduleControlsProps> = ({
  scheduleType,
  onScheduleTypeChange,
  scheduleDate,
  onDateChange,
  scheduleTime,
  onTimeChange,
  timezone,
  onTimezoneChange,
  onSubmit,
  isSubmitting,
  disabled
}) => {
  const timezones = [
    'Asia/Kolkata (IST)',
    'UTC',
    'America/New_York (EST)',
    'America/Los_Angeles (PST)',
    'Europe/London (GMT)',
    'Asia/Dubai (GST)',
    'Asia/Singapore (SGT)'
  ];

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header matching Step 5 */}
      <div className="card-header">
        <div>
          <div className="card-title">
            <span className="step-badge">5</span>
            <span>Schedule Post</span>
          </div>
          <div className="card-subtitle">
            Choose to publish now or schedule for a later time.
          </div>
        </div>
      </div>

      <div style={{ marginTop: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        <div>
          {/* Radio Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            
            {/* Publish Now */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: scheduleType === 'now' ? '#f4f4f5' : '#ffffff',
                border: `1px solid ${scheduleType === 'now' ? '#09090b' : 'var(--border-subtle)'}`,
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="schedule_type"
                checked={scheduleType === 'now'}
                onChange={() => onScheduleTypeChange('now')}
                style={{ accentColor: '#09090b' }}
              />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#09090b' }}>
                Publish Now
              </span>
            </label>

            {/* Schedule for Later */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: scheduleType === 'later' ? '#f4f4f5' : '#ffffff',
                border: `1px solid ${scheduleType === 'later' ? '#09090b' : 'var(--border-subtle)'}`,
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="schedule_type"
                checked={scheduleType === 'later'}
                onChange={() => onScheduleTypeChange('later')}
                style={{ accentColor: '#09090b' }}
              />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#09090b' }}>
                Schedule for Later
              </span>
            </label>

          </div>

          {/* Date, Time, and Timezone Controls (Active when 'later' is selected) */}
          {scheduleType === 'later' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              
              {/* Date */}
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Calendar size={13} color="var(--text-dim)" />
                  <label className="form-label" style={{ margin: 0 }}>Date</label>
                </div>
                <input
                  type="date"
                  className="input-text"
                  value={scheduleDate}
                  onChange={(e) => onDateChange(e.target.value)}
                />
              </div>

              {/* Time */}
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Clock size={13} color="var(--text-dim)" />
                  <label className="form-label" style={{ margin: 0 }}>Time</label>
                </div>
                <input
                  type="time"
                  className="input-text"
                  value={scheduleTime}
                  onChange={(e) => onTimeChange(e.target.value)}
                />
              </div>

              {/* Timezone */}
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Globe size={13} color="var(--text-dim)" />
                  <label className="form-label" style={{ margin: 0 }}>Time Zone</label>
                </div>
                <select
                  className="select-input"
                  value={timezone}
                  onChange={(e) => onTimezoneChange(e.target.value)}
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

            </div>
          )}
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: '20px' }}>
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '13px', gap: '8px' }}
            disabled={disabled || isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing Automation...</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>{scheduleType === 'now' ? 'Publish Now' : 'Schedule Post'}</span>
              </>
            )}
          </button>

          <div style={{ fontSize: '10px', color: 'var(--text-dim)', textAlign: 'center', marginTop: '8px' }}>
            Automated via Python Flask &amp; MySQL
          </div>
        </div>

      </div>

    </div>
  );
};
