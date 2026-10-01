'use client';

import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Zap, 
  Eye, 
  EyeOff, 
  Check, 
  KeyRound, 
  X, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle,
  BarChart2,
  Share2,
  Clock,
  Layers
} from 'lucide-react';
import { SocialIcon } from './SocialIcons';

interface LoginPageProps {
  onLogin: (email: string) => void;
  databaseConnected?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, databaseConnected = true }) => {
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
    }, 250);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      setResetSent(true);
    }, 500);
  };

  const handleQuickLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin('team@digigyapan.com');
    }, 150);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#ffffff',
      backgroundImage: `
        radial-gradient(at 0% 0%, rgba(131, 58, 180, 0.08) 0px, transparent 45%),
        radial-gradient(at 100% 0%, rgba(247, 119, 55, 0.08) 0px, transparent 45%),
        radial-gradient(at 50% 100%, rgba(225, 48, 108, 0.06) 0px, transparent 50%)
      `,
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)'
    }}>

      {/* Top Navbar */}
      <header style={{
        width: '100%',
        borderBottom: '1px solid var(--border-default)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '14px 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #833ab4 0%, #c13584 45%, #e1306c 75%, #f77737 100%)',
              borderRadius: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-headings)',
              fontWeight: '800',
              fontSize: '20px',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(193, 53, 132, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}>
              D
            </div>
            <div>
              <div style={{ fontSize: '19px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                Digigyapan <span style={{ color: '#e1306c', margin: '0 3px' }}>•</span> <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent-primary)' }}>Automation Studio</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', marginTop: '1px' }}>
                Multi-Platform Social Publishing Engine
              </div>
            </div>
          </div>

          {/* Right Status Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'var(--rust-50)',
              border: '1px solid var(--rust-100)',
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--accent-secondary)'
            }}>
              <span className="pulse-indicator" />
              <span>Auto Scheduler Active</span>
            </div>

            <button
              type="button"
              onClick={handleQuickLogin}
              className="btn btn-primary"
              style={{
                padding: '7px 16px',
                fontSize: '12.5px',
                gap: '6px',
                borderRadius: '8px'
              }}
            >
              <Zap size={14} color="#ffdc80" fill="#ffdc80" />
              <span>1-Click Demo Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content: Split Showcase + Login Card */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        padding: '40px 0 60px'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>

          {/* LEFT COLUMN: Visual Showcase & Capabilities */}
          <div>
            {/* Tagline Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'var(--rust-50)',
              border: '1px solid var(--rust-100)',
              color: 'var(--accent-secondary)',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.02em',
              marginBottom: '16px'
            }}>
              <Sparkles size={14} color="#e1306c" />
              <span>NEXT-GEN SOCIAL AUTOMATION ENGINE</span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2rem, 3.2vw, 2.85rem)',
              fontWeight: '800',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              margin: '0 0 16px 0'
            }}>
              Publish Once.{' '}
              <span style={{
                background: 'linear-gradient(135deg, #833ab4 0%, #c13584 40%, #e1306c 70%, #f77737 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Distribute Everywhere.
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '15px',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              maxWidth: '540px',
              margin: '0 0 28px 0'
            }}>
              Connect your client organizations once. Seamlessly automate HD video reels, photos, and AI-tailored captions across Instagram, Facebook, YouTube &amp; LinkedIn in seconds.
            </p>

            {/* 4 Connected Platform Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '32px'
            }}>
              {[
                { platform: 'instagram', name: 'Instagram Reels', sub: 'Graph API v21 • 1080p', color: '#c13584' },
                { platform: 'facebook', name: 'Facebook Pages', sub: 'Feed & Watch Videos', color: '#1877f2' },
                { platform: 'youtube', name: 'YouTube Shorts', sub: 'Data API v3 • 4K Ready', color: '#ff0000' },
                { platform: 'linkedin', name: 'LinkedIn Company', sub: 'Articles & Video Post', color: '#0a66c2' }
              ].map(item => (
                <div
                  key={item.platform}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    background: '#ffffff',
                    border: '1px solid var(--border-default)',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(25, 13, 34, 0.04)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <SocialIcon platform={item.platform} size={26} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                      {item.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Metrics Showcase Strip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-default)',
              flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#833ab4', letterSpacing: '-0.02em' }}>100% Live</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '500' }}>Cloud Webhooks</div>
              </div>
              <div style={{ width: '1px', height: '28px', background: 'var(--border-default)' }} />
              <div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#c13584', letterSpacing: '-0.02em' }}>4 Networks</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '500' }}>Single Dashboard</div>
              </div>
              <div style={{ width: '1px', height: '28px', background: 'var(--border-default)' }} />
              <div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#f77737', letterSpacing: '-0.02em' }}>Auto AI</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '500' }}>Platform-Smart Copy</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Modern Glassmorphic Login Card */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-default)',
              borderRadius: '20px',
              padding: '36px 32px',
              boxShadow: '0 16px 40px rgba(131, 58, 180, 0.1)',
              position: 'relative'
            }}>
              
              {/* Card Header */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #833ab4 0%, #c13584 50%, #e1306c 100%)',
                  boxShadow: '0 4px 14px rgba(193, 53, 132, 0.35)',
                  marginBottom: '16px'
                }}>
                  <Lock size={24} color="#ffffff" />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
                  Sign in to Studio
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.45 }}>
                  Access your automated multi-channel campaigns &amp; analytics
                </p>
              </div>

              {/* Instant 1-Click Demo Login Highlight */}
              <button
                type="button"
                onClick={handleQuickLogin}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '13px 18px',
                  marginBottom: '20px',
                  background: 'linear-gradient(135deg, #833ab4 0%, #c13584 35%, #e1306c 70%, #f77737 100%)',
                  color: '#ffffff',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 6px 18px rgba(225, 48, 108, 0.32)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Zap size={17} color="#ffdc80" fill="#ffdc80" />
                <span>1-Click Team Demo Login</span>
              </button>

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
                  backgroundColor: 'var(--border-default)'
                }} />
                <span style={{
                  position: 'relative',
                  backgroundColor: '#ffffff',
                  padding: '0 12px',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Or continue with email
                </span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '6px'
                  }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="team@digigyapan.com"
                      className="input-text"
                      style={{
                        paddingLeft: '38px',
                        fontSize: '13px',
                        border: '1px solid var(--border-default)'
                      }}
                    />
                    <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      Password
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: '600' }}>
                      Pre-filled for Demo
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="input-text"
                      style={{
                        paddingLeft: '38px',
                        paddingRight: '40px',
                        fontSize: '13px',
                        border: '1px solid var(--border-default)'
                      }}
                    />
                    <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-dim)',
                        padding: 0
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '22px'
                }}>
                  <label
                    onClick={() => setRememberMe(!rememberMe)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '5px',
                      border: `1.5px solid ${rememberMe ? '#c13584' : 'var(--border-strong)'}`,
                      backgroundColor: rememberMe ? '#c13584' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}>
                      {rememberMe && <Check size={13} color="#ffffff" strokeWidth={3} />}
                    </div>
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setResetSent(false);
                      setIsForgotPasswordOpen(true);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-primary)',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: '2px 4px'
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px 18px',
                    fontSize: '13.5px',
                    borderRadius: '10px'
                  }}
                >
                  <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Supported Platforms Footer */}
              <div style={{
                marginTop: '24px',
                paddingTop: '18px',
                borderTop: '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>Integrated with:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SocialIcon platform="instagram" size={16} />
                  <SocialIcon platform="facebook" size={16} />
                  <SocialIcon platform="youtube" size={16} />
                  <SocialIcon platform="linkedin" size={16} />
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        textAlign: 'center',
        padding: '18px 0',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        Digigyapan Social Media Automation Studio • Healthcare &amp; Enterprise Growth Engine
      </footer>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="modal-overlay" onClick={() => setIsForgotPasswordOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '420px', border: '1px solid var(--border-default)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--rust-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <KeyRound size={18} color="#c13584" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-headings)', margin: 0 }}>
                  Reset Your Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-dim)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.45', margin: '0 0 20px 0' }}>
              Enter your team email address. We will send you a password reset verification link and secure OTP.
            </p>

            {resetSent ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{
                  padding: '14px 16px',
                  backgroundColor: 'var(--rust-50)',
                  border: '1px solid var(--rust-100)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--accent-secondary)',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  <CheckCircle2 size={18} color="#e1306c" />
                  <span>Password reset link &amp; OTP sent to {forgotEmail}!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="team@digigyapan.com"
                    className="input-text"
                    style={{ fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                  >
                    {isResetting ? 'Sending...' : 'Send Link'}
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
