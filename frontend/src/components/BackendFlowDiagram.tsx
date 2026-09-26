'use client';

import React from 'react';
import { AutomationLog } from '../lib/types';
import {
  Webhook,
  Database,
  Clock,
  FileText,
  Share2,
  CheckCheck,
  Server,
  LayoutDashboard,
  Terminal
} from 'lucide-react';

interface BackendFlowDiagramProps {
  logs: AutomationLog[];
  activeStep?: number;
}

export const BackendFlowDiagram: React.FC<BackendFlowDiagramProps> = ({ logs, activeStep = 0 }) => {
  const steps = [
    {
      num: 1,
      name: 'Webhook Trigger',
      desc: 'Receives post data from Next.js (client, video, caption, platforms, time).',
      icon: Webhook
    },
    {
      num: 2,
      name: 'Save to Database',
      desc: 'Stores video, captions, schedule time and status in MySQL digiauto_db.',
      icon: Database
    },
    {
      num: 3,
      name: 'Wait Until Scheduled Time',
      desc: 'Python Flask scheduler waits until the selected date and time.',
      icon: Clock
    },
    {
      num: 4,
      name: 'Get Video & Details',
      desc: 'Fetches media file and platform metadata from server storage.',
      icon: FileText
    },
    {
      num: 5,
      name: 'Publish to Selected Platforms',
      desc: 'Posts the video to Instagram, Facebook, YouTube & LinkedIn APIs.',
      icon: Share2
    },
    {
      num: 6,
      name: 'Get Response',
      desc: 'Receives post URLs and HTTP status from each platform.',
      icon: CheckCheck
    },
    {
      num: 7,
      name: 'Update Status in Database',
      desc: 'Updates MySQL post status (published/failed), saves URLs & error logs.',
      icon: Server
    },
    {
      num: 8,
      name: 'Show Result in Dashboard',
      desc: 'Final status and links synchronized to Digigyapan dashboard.',
      icon: LayoutDashboard
    }
  ];

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      
      {/* Header matching Section 7 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div className="card-title">
            <span className="step-badge">7</span>
            <span>What Happens in Backend (Python Flask &amp; MySQL)</span>
          </div>
          <div className="card-subtitle">
            Once you click &quot;Schedule Post&quot;, the following automation happens in the background.
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#f4f4f5',
          border: '1px solid var(--border-subtle)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '11px',
          color: 'var(--text-secondary)'
        }}>
          <span style={{ color: '#09090b', fontWeight: '600' }}>Engine:</span>
          <span>Python Flask Scheduler + PyMySQL Database</span>
        </div>
      </div>

      {/* Horizontal Step Cards matching the diagram */}
      <div className="backend-step-flow">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.num;

          return (
            <div
              key={step.num}
              className={`backend-step-card ${isActive ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="step-num-pill">{step.num}</span>
                <Icon size={15} color={isActive ? '#09090b' : 'var(--text-dim)'} />
              </div>

              <div style={{ fontSize: '12px', fontWeight: '600', color: '#09090b', marginBottom: '4px' }}>
                {step.name}
              </div>

              <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {step.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Automation Logs Terminal / Feed */}
      <div style={{ marginTop: '16px' }}>
        <div style={{
          background: '#f8f9fa',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Terminal size={14} color="#09090b" />
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#09090b' }}>
              Live Backend Event Stream (MySQL Automation Logs)
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-dim)', marginLeft: 'auto' }}>
              Auto-refreshed
            </span>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            maxHeight: '130px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '11px'
          }}>
            {logs && logs.length > 0 ? (
              logs.slice(0, 5).map((log, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-dim)' }}>[{log.created_at || 'LOG'}]</span>
                  <span style={{
                    color: log.status === 'success' ? '#16a34a' : (log.status === 'warning' ? '#d97706' : '#09090b'),
                    fontWeight: '600'
                  }}>
                    Step {log.step_number}: {log.step_name}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>- {log.message}</span>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-dim)' }}>
                Scheduler initialized. Ready for automation triggers...
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
