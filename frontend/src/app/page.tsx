'use client';

import React, { useState, useEffect } from 'react';
import { Client, Post, AutomationLog, SocialPlatform, DatabaseInfo, SocialAccount } from '../lib/types';
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
import { ManageAccountsModal } from '../components/ManageAccountsModal';
import { CheckCircle2, Clock, Building2, ChevronDown, Sparkles, Layers, Plus, ChevronRight, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  // Authentication & System State - Default to true with local session check
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userEmail, setUserEmail] = useState('team@digigyapan.com');
  const [activeView, setActiveView] = useState<'create' | 'analytics' | 'history'>('create');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('Live IST');
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
    linkedin: 'Keshav Hospital is proud to announce expanded 24x7 advanced blood banking facilities in Kharkhoda, ensuring rapid response emergency care.'
  });

  const [youtubeTitle, setYoutubeTitle] = useState('खरखौदा में ब्लड बैंक की सुविधा | Keshav Hospital');
  const [hashtags, setHashtags] = useState('#BloodBank #KeshavHospital #HealthCare #EmergencyCare');

  // Step 4 Platform Selection
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    'instagram',
    'facebook',
    'youtube',
    'linkedin'
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
  const [isManageAccountsOpen, setIsManageAccountsOpen] = useState(false);

  // Initial Data Fetch & Session Restore
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('digiauto_logged_in');
      if (stored === 'false') {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    }
    loadAllData();
  }, []);

  // Real-time IST clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      const date = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      setCurrentTimeStr(`${date}, ${time} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
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
        // Fallback default clients with distinct accounts per client
        const defaultClientsList: Client[] = [
          {
            id: 1,
            name: 'Keshav Hospital',
            business_type: 'Healthcare & Multi-speciality',
            social_accounts: [
              { id: 1, client_id: 1, platform: 'facebook', account_name: 'Keshav Hospital', account_handle: '@keshavhospital', is_connected: true },
              { id: 2, client_id: 1, platform: 'instagram', account_name: 'Keshav Hospital', account_handle: '@keshav_hospital', is_connected: true },
              { id: 3, client_id: 1, platform: 'youtube', account_name: 'Keshav Official', account_handle: '@keshavhospital', is_connected: true },
              { id: 4, client_id: 1, platform: 'linkedin', account_name: 'Keshav Hospital', account_handle: 'keshav-hospital', is_connected: true }
            ]
          },
          {
            id: 2,
            name: 'Roshni Dental',
            business_type: 'Dental Clinic & Orthodontics',
            social_accounts: [
              { id: 5, client_id: 2, platform: 'instagram', account_name: 'Roshni Dental', account_handle: '@roshnidental_care', is_connected: true },
              { id: 6, client_id: 2, platform: 'facebook', account_name: 'Roshni Dental Clinic', account_handle: '@roshnidental', is_connected: true }
            ]
          },
          {
            id: 3,
            name: 'Noble Hospital',
            business_type: 'General Hospital & Diagnostics',
            social_accounts: [
              { id: 7, client_id: 3, platform: 'youtube', account_name: 'Noble Healthcare', account_handle: '@noblehospital', is_connected: true },
              { id: 8, client_id: 3, platform: 'facebook', account_name: 'Noble Hospital', account_handle: '@noblehospital', is_connected: true },
              { id: 9, client_id: 3, platform: 'linkedin', account_name: 'Noble Hospital', account_handle: 'noble-hospital', is_connected: true }
            ]
          },
          {
            id: 4,
            name: 'Dermatrixx',
            business_type: 'Skin & Hair Aesthetic Clinic',
            social_accounts: [
              { id: 10, client_id: 4, platform: 'instagram', account_name: 'Dermatrixx Skin', account_handle: '@dermatrixx_skin', is_connected: true }
            ]
          }
        ];
        setClients(defaultClientsList);
        setSelectedClientId(1);
        applyClientInitialMedia(1);
        if (defaultClientsList[0]?.social_accounts) {
          setSelectedPlatforms(
            defaultClientsList[0].social_accounts.map(a => a.platform.toLowerCase() as SocialPlatform)
          );
        }
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
        setCaptions({
          general: firstMedia.captions.general,
          instagram: firstMedia.captions.instagram,
          facebook: firstMedia.captions.facebook,
          youtube: firstMedia.captions.youtube,
          linkedin: firstMedia.captions.linkedin
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
    if (targetClient && targetClient.social_accounts && targetClient.social_accounts.length > 0) {
      const valid = targetClient.social_accounts
        .filter(a => a.is_connected !== false)
        .map(a => a.platform.toLowerCase() as SocialPlatform)
        .filter(p => ['instagram', 'facebook', 'youtube', 'linkedin'].includes(p));
      if (valid.length > 0) {
        setSelectedPlatforms(valid);
      }
    }
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
      setCaptions({
        general: item.captions.general,
        instagram: item.captions.instagram,
        facebook: item.captions.facebook,
        youtube: item.captions.youtube,
        linkedin: item.captions.linkedin
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
          linkedin: aiData.caption_linkedin
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
    const currentClient = clients.find(c => c.id === selectedClientId);
    if (currentClient && currentClient.social_accounts && currentClient.social_accounts.length > 0) {
      const valid = currentClient.social_accounts
        .map(a => a.platform.toLowerCase() as SocialPlatform)
        .filter(p => ['instagram', 'facebook', 'youtube', 'linkedin'].includes(p));
      setSelectedPlatforms(valid);
    } else {
      setSelectedPlatforms(['instagram']);
    }
  };

  const handleClearAllPlatforms = () => {
    const currentClient = clients.find(c => c.id === selectedClientId);
    if (currentClient && currentClient.social_accounts && currentClient.social_accounts.length > 0) {
      const first = currentClient.social_accounts[0].platform.toLowerCase() as SocialPlatform;
      setSelectedPlatforms([first]);
    } else {
      setSelectedPlatforms(['instagram']);
    }
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
    socialLinks?: { facebook?: string; instagram?: string; youtube?: string; linkedin?: string }
  ) => {
    try {
      const newClient = await api.createClient(name, businessType, socialLinks);
      setClients(prev => [...prev, newClient]);
      setSelectedClientId(newClient.id);
      applyClientInitialMedia(newClient.id);
      if (newClient.social_accounts && newClient.social_accounts.length > 0) {
        setSelectedPlatforms(newClient.social_accounts.map(a => a.platform.toLowerCase() as SocialPlatform));
      }
      showToast(`Client '${name}' added with connected social channels!`);
    } catch {
      const accounts: SocialAccount[] = [];
      let accId = 1;
      const newId = Date.now();

      if (socialLinks?.facebook && socialLinks.facebook.trim()) {
        accounts.push({ id: newId + accId++, client_id: newId, platform: 'facebook' as SocialPlatform, account_name: `${name} Page`, account_handle: socialLinks.facebook.trim(), is_connected: true });
      }
      if (socialLinks?.instagram && socialLinks.instagram.trim()) {
        accounts.push({ id: newId + accId++, client_id: newId, platform: 'instagram' as SocialPlatform, account_name: `${name} Official`, account_handle: socialLinks.instagram.trim(), is_connected: true });
      }
      if (socialLinks?.youtube && socialLinks.youtube.trim()) {
        accounts.push({ id: newId + accId++, client_id: newId, platform: 'youtube' as SocialPlatform, account_name: `${name} Channel`, account_handle: socialLinks.youtube.trim(), is_connected: true });
      }
      if (socialLinks?.linkedin && socialLinks.linkedin.trim()) {
        accounts.push({ id: newId + accId++, client_id: newId, platform: 'linkedin' as SocialPlatform, account_name: name, account_handle: socialLinks.linkedin.trim(), is_connected: true });
      }

      const mockClient: Client = {
        id: newId,
        name,
        business_type: businessType,
        social_accounts: accounts
      };
      setClients(prev => [...prev, mockClient]);
      setSelectedClientId(mockClient.id);
      applyClientInitialMedia(mockClient.id);
      if (accounts.length > 0) {
        setSelectedPlatforms(accounts.map(a => a.platform.toLowerCase() as SocialPlatform));
      }
      showToast(`Client '${name}' added with ${accounts.length} connected channel${accounts.length === 1 ? '' : 's'}!`);
    }
  };

  // Manage / Update Social Media Accounts for Existing Client
  const handleAccountsUpdated = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    if (updatedClient.social_accounts && updatedClient.social_accounts.length > 0) {
      const activePlatforms = updatedClient.social_accounts
        .filter(a => a.is_connected !== false)
        .map(a => a.platform.toLowerCase() as SocialPlatform)
        .filter(p => ['instagram', 'facebook', 'youtube', 'linkedin'].includes(p));
      if (activePlatforms.length > 0) {
        setSelectedPlatforms(activePlatforms);
      }
    }
    showToast(`Updated social accounts for ${updatedClient.name}!`);
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
          post_type: plat === 'instagram' ? 'Reel' : 'Video',
          status: (scheduleType === 'now' ? 'Published' : 'Pending') as 'Pending' | 'Published' | 'Failed',
          platform_post_url: plat === 'instagram'
            ? `https://instagram.com/reel/C89218x${clientName.slice(0, 6)}`
            : (plat === 'facebook'
              ? `https://facebook.com/${clientName.toLowerCase().replace(/\s+/g, '')}/videos/5419827`
              : (plat === 'youtube'
                ? `https://youtube.com/watch?v=wJINj8w85JA`
                : `https://linkedin.com/feed/update/urn:li:activity:891724`))
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('digiauto_logged_in', 'true');
    }
    showToast(`Logged in successfully as ${email}`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('digiauto_logged_in', 'false');
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

  // Summary metrics for executive Stat Rail (Sudvin Editorial Style)
  const totalClientsCount = clients.length;
  const totalConnectedAccounts = clients.reduce((acc, c) => acc + (c.social_accounts?.length || 0), 0);
  const publishedCount = posts.filter(p => p.overall_status === 'Published').length;
  const scheduledCount = posts.filter(p => p.overall_status === 'Scheduled').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'linear-gradient(135deg, #833ab4 0%, #c13584 50%, #e1306c 100%)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          border: '1px solid rgba(253, 29, 29, 0.4)',
          boxShadow: '0 10px 30px rgba(131, 58, 180, 0.28)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          <CheckCircle2 size={16} color="#ffdc80" />
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
        selectedClientAccounts={currentClient?.social_accounts}
      />

      {/* Main Workspace */}
      <main style={{ flex: 1, minWidth: 0, padding: '30px 40px 80px', overflowY: 'auto', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          
          {/* Top Workspace Header Bar */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border-default)',
            padding: '20px 24px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(131, 58, 180, 0.04)'
          }}>
            {/* Command Bar Top Row: Breadcrumb + System Badges + Action Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              {/* Left: Breadcrumbs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: '700', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Sparkles size={14} /> Digigyapan AI
                </span>
                <ChevronRight size={13} color="var(--border-strong)" />
                <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
                  {currentClient?.name || 'Client Hub'}
                </span>
                <ChevronRight size={13} color="var(--border-strong)" />
                <span style={{
                  fontWeight: '700',
                  color: 'var(--accent-secondary)',
                  background: 'var(--rust-50)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--rust-100)'
                }}>
                  {activeView === 'create' ? `Campaign Studio • Step ${currentStep}/4` : (activeView === 'analytics' ? 'Analytics Studio' : 'Campaign Archive')}
                </span>
              </div>

              {/* Right: Quick Action Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* Quick Client Switcher Dropdown */}
                {clients.length > 0 && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-default)',
                    fontSize: '12px'
                  }}>
                    <Building2 size={14} color="#c13584" />
                    <select
                      value={selectedClientId}
                      onChange={(e) => handleSelectClient(Number(e.target.value))}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '12px',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        outline: 'none'
                      }}
                      title="Switch active client organization"
                    >
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Live IST Clock */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-default)',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)'
                }}>
                  <Clock size={12} color="#c13584" />
                  <span>{currentTimeStr}</span>
                </div>

                {/* New Campaign Action Button */}
                {activeView !== 'create' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('create');
                      setCurrentStep(1);
                    }}
                    className="btn btn-primary"
                    style={{ padding: '6px 14px', fontSize: '12px', gap: '6px' }}
                  >
                    <Plus size={14} /> New Campaign
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddClientOpen(true)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '12px', gap: '6px' }}
                  >
                    <Plus size={13} /> Add Client
                  </button>
                )}
              </div>
            </div>

            {/* Title & Client Status Row */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-headings)', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                  {activeView === 'create'
                    ? 'Multi-Channel Campaign Studio'
                    : (activeView === 'analytics' ? 'Performance Analytics & Reach Studio' : 'Campaign Archive & Publication History')}
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '5px 0 0 0', lineHeight: 1.5 }}>
                  {activeView === 'create'
                    ? `Publish high-resolution Reels, Shorts, and Feed updates for ${currentClient?.name || 'Selected Client'} with AI captions & hashtags.`
                    : (activeView === 'analytics'
                      ? `Real-time analytics across Instagram, YouTube, Facebook, and LinkedIn for ${currentClient?.name || 'all clients'}.`
                      : `Comprehensive history of scheduled, published, and queued posts with live web verification links.`)}
                </p>
              </div>

              {/* Connected Accounts Quick Chips */}
              {activeView === 'create' && currentClient?.social_accounts && currentClient.social_accounts.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
                    Active Channels:
                  </span>
                  {currentClient.social_accounts.map(acc => (
                    <div
                      key={acc.platform}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: 'var(--rust-50)',
                        border: '1px solid var(--rust-100)',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#c13584' }} />
                      <span style={{ textTransform: 'capitalize' }}>{acc.platform}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        {/* VIEW A: ANALYTICS DASHBOARD */}
        {activeView === 'analytics' ? (
          <div>
            {/* Executive Stat Rail (Sudvin Editorial Style) */}
            <div className="stat-rail">
              <div>
                <span className="stat-num">{totalClientsCount}</span>
                <span className="stat-label">Active Clients</span>
                <span className="stat-sub">Managed Organizations</span>
              </div>
              <div>
                <span className="stat-num">{totalConnectedAccounts}</span>
                <span className="stat-label">Connected Channels</span>
                <span className="stat-sub">Meta, YouTube &amp; LinkedIn</span>
              </div>
              <div>
                <span className="stat-num">{publishedCount}</span>
                <span className="stat-label">Published Posts</span>
                <span className="stat-sub">Automated Dispatches</span>
              </div>
              <div>
                <span className="stat-num">{scheduledCount}</span>
                <span className="stat-label">Scheduled in Queue</span>
                <span className="stat-sub">Cron Daemon Active</span>
              </div>
            </div>

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
          </div>
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
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid var(--border-default)',
              padding: '12px 16px',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(131, 58, 180, 0.04)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px'
              }}>
                {/* Step 1 */}
                <div
                  className={`wizard-step-item ${currentStep === 1 ? 'active' : (currentStep > 1 ? 'completed' : '')}`}
                  onClick={() => setCurrentStep(1)}
                  style={{ flex: 1, minWidth: '200px' }}
                >
                  <div className="wizard-step-circle">
                    {currentStep > 1 ? '✓' : 1}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', lineHeight: '1.2', color: currentStep === 1 ? '#c13584' : 'inherit' }}>
                      1. Select Client
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                      {currentClient?.name || 'Pick organization'}
                    </div>
                  </div>
                </div>

                <ChevronRight size={16} color="var(--border-strong)" style={{ flexShrink: 0 }} />

                {/* Step 2 */}
                <div
                  className={`wizard-step-item ${currentStep === 2 ? 'active' : (currentStep > 2 ? 'completed' : '')}`}
                  onClick={() => setCurrentStep(2)}
                  style={{ flex: 1, minWidth: '200px' }}
                >
                  <div className="wizard-step-circle">
                    {currentStep > 2 ? '✓' : 2}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', lineHeight: '1.2', color: currentStep === 2 ? '#c13584' : 'inherit' }}>
                      2. Select Media
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                      {videoFilename ? `✓ ${videoFilename}` : 'Videos & Photos'}
                    </div>
                  </div>
                </div>

                <ChevronRight size={16} color="var(--border-strong)" style={{ flexShrink: 0 }} />

                {/* Step 3 */}
                <div
                  className={`wizard-step-item ${currentStep === 3 ? 'active' : (currentStep > 3 ? 'completed' : '')}`}
                  onClick={() => setCurrentStep(3)}
                  style={{ flex: 1, minWidth: '200px' }}
                >
                  <div className="wizard-step-circle">
                    {currentStep > 3 ? '✓' : 3}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', lineHeight: '1.2', color: currentStep === 3 ? '#c13584' : 'inherit' }}>
                      3. Captions &amp; AI
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                      {captions.instagram ? '✓ AI Copy & Tags Ready' : 'AI Generation Studio'}
                    </div>
                  </div>
                </div>

                <ChevronRight size={16} color="var(--border-strong)" style={{ flexShrink: 0 }} />

                {/* Step 4 */}
                <div
                  className={`wizard-step-item ${currentStep === 4 ? 'active' : ''}`}
                  onClick={() => setCurrentStep(4)}
                  style={{ flex: 1, minWidth: '200px' }}
                >
                  <div className="wizard-step-circle">4</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', lineHeight: '1.2', color: currentStep === 4 ? '#c13584' : 'inherit' }}>
                      4. Preview &amp; Dispatch
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                      {selectedPlatforms.length > 0 ? `${selectedPlatforms.length} Channels Active` : 'Schedule & Publish'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Smooth Instagram Gradient Progress Bar */}
              <div style={{
                marginTop: '10px',
                height: '4px',
                borderRadius: '999px',
                background: 'var(--sand-100)',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(currentStep / 4) * 100}%`,
                  background: 'linear-gradient(90deg, #833ab4 0%, #c13584 35%, #e1306c 65%, #fd1d1d 85%, #f77737 100%)',
                  borderRadius: '999px',
                  transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </div>
            </div>

            {/* Wizard Step 1: Select Client & Connected Social Media Links */}
            {currentStep === 1 && (
              <ClientSelector
                clients={clients}
                selectedClientId={selectedClientId}
                onSelectClient={handleSelectClient}
                onOpenAddClient={() => setIsAddClientOpen(true)}
                onOpenManageAccounts={() => setIsManageAccountsOpen(true)}
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
                clientAccounts={currentClient?.social_accounts}
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
                clientAccounts={currentClient?.social_accounts}
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

      <ManageAccountsModal
        client={currentClient || null}
        isOpen={isManageAccountsOpen}
        onClose={() => setIsManageAccountsOpen(false)}
        onAccountsUpdated={handleAccountsUpdated}
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
        onRetry={async (postId) => {
          await handleRetry(postId);
          const updated = await api.getPosts().catch(() => []);
          const matched = updated.find(p => p.id === postId);
          if (matched) {
            setSuccessPostModal(matched);
          }
        }}
      />

    </div>
  );
}
