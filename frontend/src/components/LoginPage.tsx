'use client';

import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Zap, Eye, EyeOff, Check, KeyRound, X, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string) => void;
  databaseConnected?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('team@digigyapan.com');
  const [password, setPassword] = useState('admin@digiauto2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('team@digigyapan.com');
  const [resetSent, setResetSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin(email);
    }, 350);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      setResetSent(true);
    }, 600);
  };

  const handleQuickLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin('team@digigyapan.com');
    }, 250);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#ffffff',
      backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 0, 0, 0.04), rgba(255, 255, 255, 0))',
      color: '#09090b',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '32px 20px',
      position: 'relative',
      fontFamily: 'var(--font-family, sans-serif)'
    }}>

      {/* Top Branding Navigation */}
      <header style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            backgroundColor: '#09090b',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '20px',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            D
          </div>
          <div>
            <div style={{ fontSize: '19px', fontWeight: '700', letterSpacing: '-0.02em', color: '#09090b', fontFamily: 'var(--font-serif)' }}>
              Digigyapan
            </div>
            <div style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Social Media Automation
            </div>
          </div>
        </div>
      </header>

      {/* Central Login Card */}
      <main style={{
        width: '100%',
        maxWidth: '440px',
        margin: 'auto 0',
        padding: '24px 0'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: '16px',
          padding: '36px 32px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04)'
        }}>
          
          {/* Card Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#f4f4f5',
              border: '1px solid #e4e4e7',
              marginBottom: '16px'
            }}>
              <Lock size={22} color="#09090b" />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.02em', color: '#09090b', fontFamily: 'var(--font-serif)' }}>
              Sign in to Dashboard
            </h1>
            <p style={{ fontSize: '13px', color: '#71717a', marginTop: '6px', lineHeight: '1.4' }}>
              Select client, pick media assets &amp; auto-publish across Instagram, Facebook, YouTube, LinkedIn.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#27272a',
                marginBottom: '6px'
              }}>
                Team Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="team@digigyapan.com"
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e4e4e7',
                    borderRadius: '8px',
                    padding: '11px 14px 11px 38px',
                    color: '#09090b',
                    fontSize: '13px',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                />
                <Mail size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#27272a' }}>
                  Password
                </label>
                <span style={{ fontSize: '11px', color: '#71717a', cursor: 'pointer' }}>
                  Demo Access
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e4e4e7',
                    borderRadius: '8px',
                    padding: '11px 40px 11px 38px',
                    color: '#09090b',
                    fontSize: '13px',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                />
                <Lock size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                
                {/* Hide / Show Password Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#71717a',
                    borderRadius: '4px',
                    transition: 'color 0.15s ease'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Tick Button & Forgot Password */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <label
                onClick={() => setRememberMe(!rememberMe)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#27272a',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                {/* Custom Tick Button */}
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: `1.5px solid ${rememberMe ? '#09090b' : '#d4d4d8'}`,
                  backgroundColor: rememberMe ? '#09090b' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}>
                  {rememberMe && <Check size={13} color="#ffffff" strokeWidth={3} />}
                </div>
                <span>Remember me</span>
              </label>

              {/* Forgot Password Button */}
              <button
                type="button"
                onClick={() => {
                  setResetSent(false);
                  setIsForgotPasswordOpen(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#09090b',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '2px 4px',
                  textDecoration: 'underline'
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Primary Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px 18px',
                backgroundColor: '#09090b',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '14px',
                borderRadius: '8px',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                fontFamily: 'var(--font-sans)'
              }}
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div style={{
            position: 'relative',
            margin: '22px 0',
            textAlign: 'center'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              backgroundColor: '#e4e4e7'
            }} />
            <span style={{
              position: 'relative',
              backgroundColor: '#ffffff',
              padding: '0 10px',
              fontSize: '11px',
              color: '#71717a',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Quick Access
            </span>
          </div>

          {/* 1-Click Fast Login Button */}
          <button
            type="button"
            onClick={handleQuickLogin}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '10px 14px',
              backgroundColor: '#f4f4f5',
              color: '#09090b',
              border: '1px solid #e4e4e7',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-sans)'
            }}
          >
            <Zap size={14} color="#09090b" />
            <span>1-Click Enter as Admin (Digigyapan Team)</span>
          </button>

        </div>

      </main>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="modal-overlay" onClick={() => setIsForgotPasswordOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '420px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.18)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#f4f4f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <KeyRound size={16} color="#09090b" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#09090b', margin: 0 }}>
                  Reset Your Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#71717a' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#71717a', lineHeight: '1.45', margin: '0 0 20px 0' }}>
              Enter your team email address. We will send you a password reset verification link and secure OTP.
            </p>

            {resetSent ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{
                  padding: '14px 16px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#16a34a',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  <CheckCircle2 size={18} color="#16a34a" />
                  <span>Password reset link &amp; OTP sent to {forgotEmail}!</span>
                </div>
                <p style={{ fontSize: '12px', color: '#71717a', margin: 0 }}>
                  Please check your inbox (and spam folder). Click the link or use the OTP to set a new password.
                </p>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px', fontSize: '13px', marginTop: '6px' }}
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#27272a', marginBottom: '6px' }}>
                    Registered Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="team@digigyapan.com"
                      style={{
                        width: '100%',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e4e4e7',
                        borderRadius: '8px',
                        padding: '10px 14px 10px 36px',
                        color: '#09090b',
                        fontSize: '13px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <Mail size={15} color="#71717a" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '10px', fontSize: '13px', backgroundColor: '#ffffff', border: '1px solid #e4e4e7' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                  >
                    {isResetting ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
