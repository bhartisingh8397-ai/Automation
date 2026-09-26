'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('team@digigyapan.com');
  const [password, setPassword] = useState('admin@digiauto2026');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(email);
    onClose();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        
        {/* Step 1 Header matching the Diagram */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div className="card-title">
              <span className="step-badge">1</span>
              <span>{showForgot ? 'Reset Password' : 'Login to Dashboard'}</span>
            </div>
            <div className="card-subtitle">
              {showForgot ? 'Enter your email to receive password reset link.' : 'Your team logs in with secure access.'}
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-outline btn-icon"
            style={{ width: '30px', height: '30px' }}
          >
            <X size={16} />
          </button>
        </div>

        {showForgot ? (
          <div>
            {forgotSent ? (
              <div style={{ padding: '16px 0', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#16a34a', marginBottom: '6px' }}>
                  ✓ Password Reset Sent!
                </div>
                <p style={{ fontSize: '12px', color: '#71717a', marginBottom: '18px' }}>
                  Instructions and secure OTP have been sent to <strong>{email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setForgotSent(false);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label">Team Email</label>
                  <input
                    type="email"
                    className="input-text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '10px', fontSize: '12px', backgroundColor: '#fff' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '10px', fontSize: '12px' }}
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', margin: '20px 0 16px 0' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#09090b' }}>Digigyapan</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Welcome Back</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="input-text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: '38px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted, #71717a)'
                    }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 0 20px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#27272a', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    style={{ accentColor: '#09090b' }}
                  />
                  <span>Remember me</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgot(true);
                  }}
                  style={{ fontSize: '11px', color: '#09090b', fontWeight: '600', textDecoration: 'underline' }}
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: '13px' }}
              >
                Login to Dashboard
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
