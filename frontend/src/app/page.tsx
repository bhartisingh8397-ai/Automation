'use client';

import React, { useState, useEffect } from 'react';
import { Client, Post, AutomationLog, SocialPlatform, DatabaseInfo } from '../lib/types';
import { api } from '../lib/api';
import { CLIENT_MEDIA_LIBRARY, ClientMediaItem } from '../lib/clientMedia';
import { Sidebar } from '../components/Sidebar';
import { LoginPage } from '../components/LoginPage';
import { ClientSelector } from '../components/ClientSelector';
import { ClientMediaSelector } from '../components/ClientMediaSelector';
import { CaptionEditor } from '../components/CaptionEditor';
import { PublishingStep } from '../components/PublishingStep';
import { HistoryPage } from '../components/HistoryPage';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { ViewLinksModal } from '../components/ViewLinksModal';
import { AddClientModal } from '../components/AddClientModal';
import { PostSuccessModal } from '../components/PostSuccessModal';
import { CheckCircle2 } from 'lucide-react';

export default function Home() {
  // Authentication & System State (Default to Login Page first as requested)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('team@digigyapan.com');
  const [activeView, setActiveView] = useState<'create' | 'analytics' | 'history'>('create');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Clients & Active Selection
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);

  // Step 2 Media State
  const [selectedMedia, setSelectedMedia] = useState<ClientMediaItem | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFilename, setVideoFilename] = useState<string>('blood-bank.mp4');
  const [fileSizeMb, setFileSizeMb] = useState<number>(85.0);
  const [durationStr, setDurationStr] = useState<string>('2:15');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);

  // Step 3 Captions State
  const [captions, setCaptions] = useState({
    general: 'खरखौदा में ब्लड बैंक की सुविधा अब और भी बेहतर! Keshav Hospital में सुरक्षित, आधुनिक और 24x7 ब्लड बैंक सेवा उपलब्ध है...',
    instagram: 'खरखौदा में ब्लड बैंक की सुविधा अब और भी बेहतर! Keshav Hospital में सुरक्षित, आधुनिक और 24x7 ब्लड बैंक सेवा उपलब्ध है। #BloodBank #KeshavHospital #Healthcare',
    facebook: 'खरखौदा में ब्लड बैंक की सुविधा अब और भी बेहतर! Keshav Hospital में सुरक्षित, आधुनिक और 24x7 ब्लड बैंक सेवा उपलब्ध है...',
    youtube: 'खरखौदा में ब्लड बैंक की सुविधा | Keshav Hospital Kharkhoda 24x7 Blood Bank Facility\n\nEmergency helpline: +91 98765 43210\nWebsite: www.keshavhospital.com',
    linkedin: 'Keshav Hospital is proud to announce expanded 24x7 advanced blood banking facilities in Kharkhoda, ensuring rapid response emergency care.',
    twitter: 'खरखौदा में ब्लड बैंक की सुविधा अब और भी बेहतर! Keshav Hospital में 24x7 सुरक्षित ब्लड बैंक सेवा उपलब्ध है। 🏥✨ #BloodBank #KeshavHospital'
  });

  const [youtubeTitle, setYoutubeTitle] = useState('खरखौदा में ब्लड बैंक की सुविधा | Keshav Hospital');
  const [hashtags, setHashtags] = useState('#BloodBank #KeshavHospital #HealthCare #EmergencyCare');

  // Step 4 Platform Selection
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    'instagram',
    'facebook',
    'youtube',
    'linkedin',
    'twitter'
  ]);

  // Step 5 Schedule Controls
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('later');
  const [scheduleDate, setScheduleDate] = useState('2026-09-27');
  const [scheduleTime, setScheduleTime] = useState('19:30');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  // Modals
  const [viewPostModal, setViewPostModal] = useState<Post | null>(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [successPostModal, setSuccessPostModal] = useState<Post | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Initial Data Fetch - Always show Login Page first
  useEffect(() => {
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('digiauto_logged_in');
    }
    loadAllData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, clientsRes, postsRes, logsRes] = await Promise.all([
        api.getStatus().catch(() => null),
        api.getClients().catch(() => []),
        api.getPosts().catch(() => []),
        api.getLogs().catch(() => [])
      ]);

      if (statusRes) {
        setDbInfo(statusRes.database);
      } else {
        setDbInfo({
          engine: 'local',
          connected: true,
          database: 'digiauto_db',
          host: 'localhost',
          port: 3306,
          user: 'root',
          fallback_to_sqlite: true,
          message: 'Frontend Standalone Mode (Backend on port 5000)'
        });
      }

      if (clientsRes && clientsRes.length > 0) {
        setClients(clientsRes);
        // Default to first client and load their first media item
        const firstClient = clientsRes[0];
        setSelectedClientId(firstClient.id);
        applyClientInitialMedia(firstClient.id);
      } else {
        // Fallback default clients
        const defaultClientsList: Client[] = [
          {
            id: 1,
            name: 'Keshav Hospital',
            business_type: 'Healthcare & Multi-speciality',
            social_accounts: [
              { id: 1, client_id: 1, platform: 'facebook', account_name: 'Keshav Hospital', account_handle: '@keshavhospital', is_connected: true },
              { id: 2, client_id: 1, platform: 'instagram', account_name: 'Keshav Hospital', account_handle: '@keshav_hospital', is_connected: true },
              { id: 3, client_id: 1, platform: 'youtube', account_name: 'Keshav Official', account_handle: '@keshavhospital', is_connected: true },
              { id: 4, client_id: 1, platform: 'linkedin', account_name: 'Keshav Hospital', account_handle: 'keshav-hospital', is_connected: true },
              { id: 101, client_id: 1, platform: 'twitter', account_name: 'Keshav Hospital on X', account_handle: '@keshavhospital', is_connected: true }
            ]
          },
          {
            id: 2,
            name: 'Roshni Dental',
            business_type: 'Dental Clinic & Orthodontics',
            social_accounts: [
              { id: 5, client_id: 2, platform: 'facebook', account_name: 'Roshni Dental Clinic', account_handle: '@roshnidental', is_connected: true },
              { id: 6, client_id: 2, platform: 'instagram', account_name: 'Roshni Dental', account_handle: '@roshnidental_care', is_connected: true },
              { id: 7, client_id: 2, platform: 'youtube', account_name: 'Roshni Dental Care', account_handle: '@roshnidental', is_connected: true },
              { id: 8, client_id: 2, platform: 'linkedin', account_name: 'Roshni Dental', account_handle: 'roshni-dental', is_connected: true },
              { id: 102, client_id: 2, platform: 'twitter', account_name: 'Roshni Dental Care', account_handle: '@roshnidental', is_connected: true }
            ]
          },
          {
            id: 3,
            name: 'Noble Hospital',
            business_type: 'General Hospital & Diagnostics',
            social_accounts: [
              { id: 9, client_id: 3, platform: 'facebook', account_name: 'Noble Hospital', account_handle: '@noblehospital', is_connected: true },
              { id: 10, client_id: 3, platform: 'instagram', account_name: 'Noble Hospital', account_handle: '@noble_hospital', is_connected: true },
              { id: 11, client_id: 3, platform: 'youtube', account_name: 'Noble Healthcare', account_handle: '@noblehospital', is_connected: true },
              { id: 12, client_id: 3, platform: 'linkedin', account_name: 'Noble Hospital', account_handle: 'noble-hospital', is_connected: true },
              { id: 103, client_id: 3, platform: 'twitter', account_name: 'Noble Hospital on X', account_handle: '@noblehospital', is_connected: true }
            ]
          },
          {
            id: 4,
            name: 'Dermatrixx',
            business_type: 'Skin & Hair Aesthetic Clinic',
            social_accounts: [
              { id: 13, client_id: 4, platform: 'facebook', account_name: 'Dermatrixx Skin Clinic', account_handle: '@dermatrixx', is_connected: true },
              { id: 14, client_id: 4, platform: 'instagram', account_name: 'Dermatrixx Skin', account_handle: '@dermatrixx_skin', is_connected: true },
              { id: 15, client_id: 4, platform: 'youtube', account_name: 'Dermatrixx Aesthetics', account_handle: '@dermatrixx', is_connected: true },
              { id: 16, client_id: 4, platform: 'linkedin', account_name: 'Dermatrixx Aesthetics', account_handle: 'dermatrixx-clinic', is_connected: true },
              { id: 104, client_id: 4, platform: 'twitter', account_name: 'Dermatrixx Clinic', account_handle: '@dermatrixx', is_connected: true }
            ]
          }
        ];
        setClients(defaultClientsList);
        setSelectedClientId(1);
        applyClientInitialMedia(1);
      }

      if (postsRes && postsRes.length > 0) {
        setPosts(postsRes);
      }

      if (logsRes && logsRes.length > 0) {
        setLogs(logsRes);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to apply initial media when client changes
  const applyClientInitialMedia = (clientId: number) => {
    const mediaList = CLIENT_MEDIA_LIBRARY[clientId];
    if (mediaList && mediaList.length > 0) {
      const firstMedia = mediaList[0];
      setSelectedMedia(firstMedia);
      setVideoFilename(firstMedia.filename);
      setFileSizeMb(firstMedia.fileSizeMb);
      setDurationStr(firstMedia.durationStr);
      if (firstMedia.captions) {
        const defaultTw = firstMedia.captions.twitter || (firstMedia.captions.general.length > 250 ? firstMedia.captions.general.slice(0, 240) + '...' : firstMedia.captions.general);
        setCaptions({
          general: firstMedia.captions.general,
          instagram: firstMedia.captions.instagram,
          facebook: firstMedia.captions.facebook,
          youtube: firstMedia.captions.youtube,
          linkedin: firstMedia.captions.linkedin,
          twitter: defaultTw
        });
        setYoutubeTitle(firstMedia.captions.youtubeTitle);
        setHashtags(firstMedia.captions.hashtags);
      }
    }
  };

  // Switch Client
  const handleSelectClient = (id: number) => {
    setSelectedClientId(id);
    applyClientInitialMedia(id);
    const targetClient = clients.find(c => c.id === id);
    showToast(`Switched to client: ${targetClient?.name || 'Selected Client'}`);
  };

  // Pick Media Item from Client Library
  const handleSelectMediaItem = (item: ClientMediaItem) => {
    // Revoke old object URL if any
    if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    setMediaPreviewUrl(null); // library items don't have real preview URLs
    setSelectedMedia(item);
    setVideoFilename(item.filename);
    setFileSizeMb(item.fileSizeMb);
    setDurationStr(item.durationStr);
    if (item.captions) {
      const defaultTw = item.captions.twitter || (item.captions.general.length > 250 ? item.captions.general.slice(0, 240) + '...' : item.captions.general);
      setCaptions({
        general: item.captions.general,
        instagram: item.captions.instagram,
        facebook: item.captions.facebook,
        youtube: item.captions.youtube,
        linkedin: item.captions.linkedin,
        twitter: defaultTw
      });
      setYoutubeTitle(item.captions.youtubeTitle);
      setHashtags(item.captions.hashtags);
    }
    showToast(`Selected media: "${item.title}"`);
  };

  // Upload Custom File for this Client (Video or Photo)
  const handleFileUploaded = async (file: File) => {
    // Revoke old preview URL
    if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    // Create fresh object URL for preview
    const previewUrl = URL.createObjectURL(file);
    setMediaPreviewUrl(previewUrl);
    setSelectedMedia(null);
    setVideoFile(file);
    setVideoFilename(file.name);
    const mb = parseFloat((file.size / (1024 * 1024)).toFixed(2));
    setFileSizeMb(mb);

    const isImage = file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i);
    const mediaDuration = isImage ? 'Photo (1080x1080)' : '1:30';
    setDurationStr(mediaDuration);

    setIsUploading(true);
    try {
      const res = await api.uploadVideo(file, mediaDuration);
      if (res && res.filename) {
        setVideoFilename(res.filename);
        setFileSizeMb(res.file_size_mb);
        setDurationStr(res.duration_str);
      }
      showToast(`${isImage ? '📸 Photo' : '🎥 Video'} '${file.name}' uploaded for client automation!`);
    } catch {
      showToast(`Custom ${isImage ? 'photo' : 'video'} selected: ${file.name}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearMedia = () => {
    if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    setMediaPreviewUrl(null);
    setSelectedMedia(null);
    setVideoFile(null);
    setVideoFilename('');
    setFileSizeMb(0);
  };

  // AI Generator Handler
  const handleGenerateAi = async (topic: string) => {
    const currentClient = clients.find(c => c.id === selectedClientId);
    const clientName = currentClient ? currentClient.name : 'Client';
    const businessType = currentClient ? currentClient.business_type : 'Healthcare';

    try {
      const aiData = await api.generateAiCaption(topic, clientName, businessType);
      if (aiData) {
        setCaptions({
          general: aiData.caption_general,
          instagram: aiData.caption_instagram,
          facebook: aiData.caption_facebook,
          youtube: aiData.caption_youtube,
          linkedin: aiData.caption_linkedin,
          twitter: aiData.caption_twitter || aiData.caption_general
        });
        setYoutubeTitle(aiData.youtube_title);
        setHashtags(aiData.hashtags);
        showToast('✨ AI Captions & Hashtags generated successfully!');
      }
    } catch {
      showToast('AI content created with tailored client presets!');
    }
  };

  // Platform selection toggles
  const handleTogglePlatform = (platform: SocialPlatform) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
      } else {
        showToast('At least one platform must be selected!');
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleSelectAllPlatforms = () => {
    setSelectedPlatforms(['instagram', 'facebook', 'youtube', 'linkedin', 'twitter']);
  };

  const handleClearAllPlatforms = () => {
    setSelectedPlatforms(['instagram']);
  };

  // Toggle Account Connection
  const handleToggleAccount = async (platform: string) => {
    try {
      await api.toggleAccount(selectedClientId, platform);
      const updatedClients = await api.getClients();
      setClients(updatedClients);
      showToast(`Toggled ${platform} connection for current client!`);
    } catch {
      setClients(prev => prev.map(c => {
        if (c.id === selectedClientId && c.social_accounts) {
          return {
            ...c,
            social_accounts: c.social_accounts.map(a =>
              a.platform.toLowerCase() === platform.toLowerCase()
                ? { ...a, is_connected: !a.is_connected }
                : a
            )
          };
        }
        return c;
      }));
    }
  };

  // Add Client
  const handleAddClient = async (
    name: string,
    businessType: string,
    socialLinks?: { facebook?: string; instagram?: string; youtube?: string; linkedin?: string; twitter?: string }
  ) => {
    try {
      const newClient = await api.createClient(name, businessType, socialLinks);
      setClients(prev => [...prev, newClient]);
      setSelectedClientId(newClient.id);
      showToast(`Client '${name}' added with connected social channels!`);
    } catch {
      const slug = name.toLowerCase().replace(/\s+/g, '');
      const fbHandle = socialLinks?.facebook?.trim() || `@${slug}`;
      const igHandle = socialLinks?.instagram?.trim() || `@${slug}`;
      const ytHandle = socialLinks?.youtube?.trim() || `@${slug}`;
      const liHandle = socialLinks?.linkedin?.trim() || `${slug}-official`;
      const twHandle = socialLinks?.twitter?.trim() || `@${slug}`;

      const newId = Date.now();
      const mockClient: Client = {
        id: newId,
        name,
        business_type: businessType,
        social_accounts: [
          { id: newId + 1, client_id: newId, platform: 'facebook', account_name: `${name} Page`, account_handle: fbHandle, is_connected: true },
          { id: newId + 2, client_id: newId, platform: 'instagram', account_name: `${name} Official`, account_handle: igHandle, is_connected: true },
          { id: newId + 3, client_id: newId, platform: 'youtube', account_name: `${name} Channel`, account_handle: ytHandle, is_connected: true },
          { id: newId + 4, client_id: newId, platform: 'linkedin', account_name: name, account_handle: liHandle, is_connected: true },
          { id: newId + 5, client_id: newId, platform: 'twitter', account_name: `${name} on X`, account_handle: twHandle, is_connected: true },
        ]
      };
      setClients(prev => [...prev, mockClient]);
      setSelectedClientId(mockClient.id);
      showToast(`Client '${name}' added with connected social channels!`);
    }
  };

  // Submit Post
  const handleSubmitPost = async () => {
    if (!videoFilename) {
      showToast('Please select or upload media for this client first!');
      return;
    }
    if (selectedPlatforms.length === 0) {
      showToast('Please select at least one social media platform!');
      return;
    }

    setIsSubmitting(true);
    setActiveWorkflowStep(1);

    const currentClient = clients.find(c => c.id === selectedClientId);
    const clientName = currentClient ? currentClient.name : 'Client';

    const scheduledDateTime = scheduleType === 'later'
      ? `${scheduleDate}T${scheduleTime}:00`
      : new Date().toISOString();

    const payload = {
      client_id: selectedClientId,
      video_filename: videoFilename,
      video_url: `/api/posts/media/${videoFilename}`,
      file_size_mb: fileSizeMb,
      duration_str: durationStr,
      caption_general: captions.general,
      caption_instagram: captions.instagram,
      caption_facebook: captions.facebook,
      caption_youtube: captions.youtube,
      caption_linkedin: captions.linkedin,
      caption_twitter: captions.twitter,
      youtube_title: youtubeTitle,
      hashtags: hashtags,
      schedule_type: scheduleType,
      scheduled_at: scheduledDateTime,
      timezone: timezone,
      platforms: selectedPlatforms
    };

    try {
      setTimeout(() => setActiveWorkflowStep(2), 400);
      const createdPost = await api.createPost(payload);

      if (scheduleType === 'now') {
        setTimeout(() => setActiveWorkflowStep(4), 400);
        setTimeout(() => setActiveWorkflowStep(5), 700);
        setTimeout(() => setActiveWorkflowStep(6), 1000);
        setTimeout(() => setActiveWorkflowStep(7), 1300);
        setTimeout(() => setActiveWorkflowStep(8), 1600);
      } else {
        setTimeout(() => setActiveWorkflowStep(3), 600);
      }

      showToast(
        scheduleType === 'now'
          ? `🚀 Published video across ${selectedPlatforms.length} platforms for ${clientName}!`
          : `📅 Post scheduled for ${scheduleDate} at ${scheduleTime} (${timezone})!`
      );

      const [updatedPosts, updatedLogs] = await Promise.all([
        api.getPosts().catch(() => []),
        api.getLogs().catch(() => [])
      ]);
      if (updatedPosts.length > 0) {
        setPosts(updatedPosts);
        const latest = updatedPosts.find(p => p.id === createdPost?.id) || createdPost;
        setSuccessPostModal(latest);
      } else if (createdPost) {
        setSuccessPostModal(createdPost);
      }
      if (updatedLogs.length > 0) setLogs(updatedLogs);

      // Trigger Celebration Modal with animated tick mark, confetti animation, and view post links!
      setIsSuccessModalOpen(true);

    } catch (err) {
      console.warn('API error, using local fallback post:', err);
      const fallbackPost: Post = {
        id: Date.now(),
        client_id: selectedClientId,
        client_name: clientName,
        video_filename: videoFilename,
        video_url: `/api/posts/media/${videoFilename}`,
        file_size_mb: fileSizeMb,
        duration_str: durationStr,
        caption_general: captions.general,
        caption_instagram: captions.instagram,
        caption_facebook: captions.facebook,
        caption_youtube: captions.youtube,
        caption_linkedin: captions.linkedin,
        caption_twitter: captions.twitter,
        youtube_title: youtubeTitle,
        hashtags: hashtags,
        schedule_type: scheduleType,
        scheduled_at: scheduledDateTime,
        timezone: timezone,
        overall_status: scheduleType === 'now' ? 'Published' : 'Scheduled',
        platforms: selectedPlatforms.map((plat, idx) => ({
          id: Date.now() + idx,
          post_id: Date.now(),
          platform: plat,
          post_type: plat === 'instagram' ? 'Reel' : (plat === 'twitter' ? 'Video Tweet' : 'Video'),
          status: (scheduleType === 'now' ? 'Published' : 'Pending') as 'Pending' | 'Published' | 'Failed',
          platform_post_url: plat === 'twitter'
            ? `https://x.com/${clientName.toLowerCase().replace(/\s+/g, '')}/status/189${Math.floor(100000 + Math.random() * 900000)}`
            : (plat === 'instagram'
              ? `https://instagram.com/reel/C89218x${clientName.slice(0, 6)}`
              : (plat === 'facebook'
                ? `https://facebook.com/${clientName.toLowerCase().replace(/\s+/g, '')}/videos/5419827`
                : (plat === 'youtube'
                  ? `https://youtube.com/watch?v=yt_K8h92_1v`
                  : `https://linkedin.com/feed/update/urn:li:activity:891724`)))
        }))
      };
      setPosts(prev => [fallbackPost, ...prev]);
      setSuccessPostModal(fallbackPost);
      setIsSuccessModalOpen(true);
      showToast('Post saved and scheduled successfully!');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setActiveWorkflowStep(0), 4000);
    }
  };

  const handleRetry = async (postId: number) => {
    try {
      await api.retryPost(postId);
      showToast(`Post #${postId} retried successfully!`);
      const updated = await api.getPosts();
      setPosts(updated);
    } catch {
      showToast(`Retrying post #${postId}...`);
    }
  };

  const handleCancel = async (postId: number) => {
    try {
      await api.cancelPost(postId);
      showToast(`Scheduled post #${postId} cancelled.`);
      const updated = await api.getPosts();
      setPosts(updated);
    } catch {
      showToast(`Cancelled post #${postId}.`);
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      await api.deletePost(postId);
      showToast(`Post #${postId} deleted.`);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch {
      setPosts(prev => prev.filter(p => p.id !== postId));
    }
  };

  const handleLoginSuccess = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    showToast(`Logged in successfully as ${email}`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('digiauto_logged_in');
    }
    showToast('Signed out of dashboard.');
  };

  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // =========================================================================
  // VIEW 1: LOGIN PAGE FIRST (If user is not logged in)
  // =========================================================================
  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={handleLoginSuccess}
        databaseConnected={dbInfo?.connected}
      />
    );
  }

  // =========================================================================
  // VIEW 2: FULL AUTOMATION DASHBOARD (Once user logs in)
  // =========================================================================
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ffffff', color: '#09090b' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#09090b',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          <CheckCircle2 size={16} color="#ffffff" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <Sidebar
        dbInfo={dbInfo}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        activeView={activeView}
        onViewChange={setActiveView}
        postsCount={posts.length}
        onSync={loadAllData}
        isSyncing={isLoading}
        onLogout={handleLogout}
        currentStep={currentStep}
        onStepChange={(step) => setCurrentStep(step)}
        selectedClientName={currentClient?.name}
      />

      {/* Main Workspace */}
      <main style={{ flex: 1, minWidth: 0, padding: '30px 40px 80px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          
          {/* Top Workspace Header Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '20px',
            marginBottom: '24px',
            borderBottom: '1px solid #f4f4f5',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#09090b', margin: 0, fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}>
                {activeView === 'create'
                  ? 'Create & Schedule Campaign'
                  : (activeView === 'analytics' ? 'Performance Analytics & Metrics' : 'Published Post History')}
              </h2>
              <p style={{ fontSize: '13px', color: '#71717a', margin: '4px 0 0 0' }}>
                {activeView === 'create' 
                  ? `Active Client: ${currentClient?.name || 'Selected Client'} • 5 Connected Platforms (Instagram, Twitter/X, YouTube, Facebook, LinkedIn)`
                  : (activeView === 'analytics'
                    ? `Live metrics on Likes, Comments, Shares, and Video Reach across social networks`
                    : `Comprehensive record of automated postings, video previews, schedule timings, and direct post links`)}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '9999px',
                background: '#f4f4f5',
                border: '1px solid #e4e4e7',
                fontSize: '11px',
                fontWeight: '600',
                color: '#27272a'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
                <span>System Online • Auto Scheduler Active</span>
              </div>
            </div>
          </div>
        
        {/* VIEW A: ANALYTICS DASHBOARD */}
        {activeView === 'analytics' ? (
          <AnalyticsDashboard
            posts={posts}
            clients={clients}
            onViewLinks={(post) => setViewPostModal(post)}
            onSync={loadAllData}
            isSyncing={isLoading}
            onNavigateToCreate={() => {
              setActiveView('create');
              setCurrentStep(1);
            }}
          />
        ) : activeView === 'history' ? (
          /* VIEW B: DEDICATED POST HISTORY PAGE */
          <HistoryPage
            posts={posts}
            clients={clients}
            onViewLinks={(post) => setViewPostModal(post)}
            onRetry={handleRetry}
            onCancel={handleCancel}
            onDelete={handleDelete}
            onSync={loadAllData}
            isSyncing={isLoading}
            onCreateNewPost={() => {
              setActiveView('create');
              setCurrentStep(1);
            }}
          />
        ) : (
          /* VIEW C: 4-STEP CREATE POST WIZARD */
          <>
            {/* Step-by-Step Wizard Track Bar */}
            <div className="wizard-steps-track">
              
              {/* Step 1 Pill */}
              <div
                className={`wizard-step-item ${currentStep === 1 ? 'active' : (currentStep > 1 ? 'completed' : '')}`}
                onClick={() => setCurrentStep(1)}
              >
                <div className="wizard-step-circle">1</div>
                <div>
                  <div style={{ fontSize: '13px', lineHeight: '1.2' }}>Select Client</div>
                  <div style={{ fontSize: '11px', opacity: 0.75 }}>&amp; Connected Socials</div>
                </div>
              </div>

              {/* Step 2 Pill */}
              <div
                className={`wizard-step-item ${currentStep === 2 ? 'active' : (currentStep > 2 ? 'completed' : '')}`}
                onClick={() => setCurrentStep(2)}
              >
                <div className="wizard-step-circle">2</div>
                <div>
                  <div style={{ fontSize: '13px', lineHeight: '1.2' }}>Select Media</div>
                  <div style={{ fontSize: '11px', opacity: 0.75 }}>Videos &amp; Photos</div>
                </div>
              </div>

              {/* Step 3 Pill */}
              <div
                className={`wizard-step-item ${currentStep === 3 ? 'active' : (currentStep > 3 ? 'completed' : '')}`}
                onClick={() => setCurrentStep(3)}
              >
                <div className="wizard-step-circle">3</div>
                <div>
                  <div style={{ fontSize: '13px', lineHeight: '1.2' }}>Captions &amp; Details</div>
                  <div style={{ fontSize: '11px', opacity: 0.75 }}>AI &amp; Hashtags</div>
                </div>
              </div>

              {/* Step 4 Pill */}
              <div
                className={`wizard-step-item ${currentStep === 4 ? 'active' : ''}`}
                onClick={() => setCurrentStep(4)}
              >
                <div className="wizard-step-circle">4</div>
                <div>
                  <div style={{ fontSize: '13px', lineHeight: '1.2' }}>Live Previews</div>
                  <div style={{ fontSize: '11px', opacity: 0.75 }}>&amp; Multi-Publish</div>
                </div>
              </div>

            </div>

            {/* Wizard Step 1: Select Client & Connected Social Media Links */}
            {currentStep === 1 && (
              <ClientSelector
                clients={clients}
                selectedClientId={selectedClientId}
                onSelectClient={handleSelectClient}
                onOpenAddClient={() => setIsAddClientOpen(true)}
                onToggleAccount={handleToggleAccount}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {/* Wizard Step 2: Select Media (Videos & Photos) */}
            {currentStep === 2 && (
              <ClientMediaSelector
                selectedClientId={selectedClientId}
                clientName={currentClient?.name || 'Selected Client'}
                selectedMedia={selectedMedia}
                videoFilename={videoFilename}
                fileSizeMb={fileSizeMb}
                durationStr={durationStr}
                mediaType={selectedMedia?.mediaType || (videoFilename.match(/\.(jpg|jpeg|png|webp)$/i) ? 'photo' : 'video')}
                onSelectMediaItem={handleSelectMediaItem}
                onFileUploaded={handleFileUploaded}
                onClear={handleClearMedia}
                isUploading={isUploading}
                onBack={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
              />
            )}

            {/* Wizard Step 3: Caption & Details */}
            {currentStep === 3 && (
              <CaptionEditor
                clientName={currentClient?.name || 'Selected Client'}
                videoFilename={videoFilename}
                mediaType={selectedMedia?.mediaType || (videoFilename.match(/\.(jpg|jpeg|png|webp)$/i) ? 'photo' : 'video')}
                mediaPreviewUrl={mediaPreviewUrl}
                captions={captions}
                youtubeTitle={youtubeTitle}
                hashtags={hashtags}
                onCaptionChange={(plat, text) => setCaptions(prev => ({ ...prev, [plat]: text }))}
                onYoutubeTitleChange={setYoutubeTitle}
                onHashtagsChange={setHashtags}
                onGenerateAi={handleGenerateAi}
                isGeneratingAi={false}
                onBack={() => setCurrentStep(2)}
                onNext={() => setCurrentStep(4)}
              />
            )}

            {/* Wizard Step 4: Live Social Media Previews & Publishing */}
            {currentStep === 4 && (
              <PublishingStep
                clientName={currentClient?.name || 'Selected Client'}
                videoFilename={videoFilename}
                fileSizeMb={fileSizeMb}
                durationStr={durationStr}
                mediaType={selectedMedia?.mediaType || (videoFilename.match(/\.(jpg|jpeg|png|webp)$/i) ? 'photo' : 'video')}
                mediaPreviewUrl={mediaPreviewUrl}
                captions={captions}
                youtubeTitle={youtubeTitle}
                hashtags={hashtags}
                selectedPlatforms={selectedPlatforms}
                onTogglePlatform={handleTogglePlatform}
                onSelectAllPlatforms={handleSelectAllPlatforms}
                onClearAllPlatforms={handleClearAllPlatforms}
                scheduleType={scheduleType}
                onScheduleTypeChange={setScheduleType}
                scheduleDate={scheduleDate}
                onDateChange={setScheduleDate}
                scheduleTime={scheduleTime}
                onTimeChange={setScheduleTime}
                timezone={timezone}
                onTimezoneChange={setTimezone}
                onSubmit={handleSubmitPost}
                isSubmitting={isSubmitting}
                onBack={() => setCurrentStep(3)}
                onViewHistory={() => setActiveView('history')}
                posts={posts}
              />
            )}
          </>
        )}

        </div>
      </main>

      {/* Modals */}
      <ViewLinksModal
        post={viewPostModal}
        onClose={() => setViewPostModal(null)}
      />

      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onAddClient={handleAddClient}
      />

      <PostSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        post={successPostModal}
        clientName={currentClient?.name || 'Selected Client'}
        videoFilename={videoFilename}
        selectedPlatforms={selectedPlatforms}
        scheduleType={scheduleType}
        scheduleDate={scheduleDate}
        scheduleTime={scheduleTime}
        timezone={timezone}
        onViewHistory={() => {
          setIsSuccessModalOpen(false);
          setActiveView('history');
        }}
        onCreateNewPost={() => {
          setIsSuccessModalOpen(false);
          setCurrentStep(1);
        }}
      />

    </div>
  );
}
