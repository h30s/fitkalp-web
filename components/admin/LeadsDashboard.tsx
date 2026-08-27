'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Search,
  Download,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  MessageCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  LogOut,
  Shield,
  ShieldAlert,
  Lock,
  Key,
  ArrowLeft,
  FileSpreadsheet,
  Edit3,
  X,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Gift,
  Award,
  Trophy,
  Copy,
  Check,
  Share2,
  ToggleLeft,
  ToggleRight,
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  ArrowUpRight,
  Tag,
} from 'lucide-react';
import { Lead, LeadStats, LeadType, LeadStatus } from '@/lib/leads';
import { ReferralCodeWithStats } from '@/lib/referrals';

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  NEW: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  CONTACTED: { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  REPLIED: { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
  DEMO_SCHEDULED: { bg: '#FAF5FF', text: '#7E22CE', border: '#E9D5FF' },
  TRIAL_ACTIVE: { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
  CONVERTED: { bg: '#F0FDF4', text: '#15803D', border: '#86EFAC' },
  NOT_INTERESTED: { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
  SPAM_COMPETITOR: { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' },
  ARCHIVED: { bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB' },
};

function getStatusLabel(status: string, type?: LeadType): string {
  if (type === 'CONTACT_QUERY') {
    switch (status) {
      case 'NEW':
        return 'New Message';
      case 'CONTACTED':
      case 'REPLIED':
        return 'Replied / Handled';
      case 'CONVERTED':
        return 'Promoted to Lead 🎯';
      case 'SPAM_COMPETITOR':
        return 'Spam / Competitor';
      case 'NOT_INTERESTED':
        return 'Closed / Not Relevant';
      case 'ARCHIVED':
        return 'Archived';
      default:
        return status;
    }
  }

  // Demo / Gym Leads default
  switch (status) {
    case 'NEW':
      return 'New Lead';
    case 'CONTACTED':
      return 'Contacted';
    case 'DEMO_SCHEDULED':
      return 'Demo Scheduled';
    case 'TRIAL_ACTIVE':
      return 'Trial Active';
    case 'CONVERTED':
      return 'Converted 🏆';
    case 'NOT_INTERESTED':
      return 'Not Interested';
    case 'SPAM_COMPETITOR':
      return 'Competitor / Spam';
    case 'ARCHIVED':
      return 'Archived';
    default:
      return status;
  }
}

export default function LeadsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password1Input, setPassword1Input] = useState('');
  const [password2Input, setPassword2Input] = useState('');
  const [password3Input, setPassword3Input] = useState('');
  const [showP1, setShowP1] = useState(false);
  const [showP2, setShowP2] = useState(false);
  const [showP3, setShowP3] = useState(false);

  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutRemainingMs, setLockoutRemainingMs] = useState(0);

  // Tabs: 'demo_leads' (Gym Demo Inquiries) vs 'contact_queries' (General Contact Us Messages) vs 'all' vs 'referrals'
  const [activeTab, setActiveTab] = useState<'demo_leads' | 'contact_queries' | 'all' | 'referrals'>('demo_leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [referrals, setReferrals] = useState<ReferralCodeWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [referralFilter, setReferralFilter] = useState('ALL');

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddReferralModal, setShowAddReferralModal] = useState(false);
  const [copiedRefCode, setCopiedRefCode] = useState<string | null>(null);

  // Manual entry modal form state
  const [newLeadType, setNewLeadType] = useState<LeadType>('DEMO_LEAD');
  const [newLeadForm, setNewLeadForm] = useState<Partial<Lead>>({
    contactName: '',
    contactRole: 'Owner / Manager',
    phone: '',
    email: '',
    gymName: '',
    city: '',
    serviceInterest: 'CRM',
    planInterest: 'Growth',
    referralCode: '',
    currentMemberRange: '50–150',
    onboardingInformation: '',
  });

  const [newReferralForm, setNewReferralForm] = useState({
    referrerName: '',
    code: '',
    referrerPhone: '',
    referrerEmail: '',
    notes: '',
  });

  const fetchDashboardData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [leadsRes, referralsRes] = await Promise.all([
        fetch('/api/admin/leads'),
        fetch('/api/admin/referrals'),
      ]);

      if (leadsRes.status === 401 || referralsRes.status === 401) {
        setIsAuthenticated(false);
        return;
      }

      const leadsData = await leadsRes.json();
      const referralsData = await referralsRes.json();

      setLeads(leadsData.leads || []);
      setStats(leadsData.stats || null);
      setReferrals(referralsData.referrals || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      setIsAuthenticated(data.authenticated === true);
      if (data.isLocked) {
        setIsLocked(true);
        setLockoutRemainingMs(data.lockoutRemainingMs || 0);
      }
      if (typeof data.remainingAttempts === 'number') {
        setRemainingAttempts(data.remainingAttempts);
      }
      if (data.authenticated) {
        fetchDashboardData();
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [fetchDashboardData]);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Lockout countdown timer
  useEffect(() => {
    if (!isLocked || lockoutRemainingMs <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemainingMs((prev) => {
        if (prev <= 1000) {
          setIsLocked(false);
          setAuthError('');
          clearInterval(interval);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked, lockoutRemainingMs]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (isLocked) return;

    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password1: password1Input,
          password2: password2Input,
          password3: password3Input,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.isLocked) {
          setIsLocked(true);
          setLockoutRemainingMs(data.lockoutRemainingMs || 15 * 60 * 1000);
        }
        if (typeof data.remainingAttempts === 'number') {
          setRemainingAttempts(data.remainingAttempts);
        }
        throw new Error(data.error || 'Authentication failed');
      }
      setIsAuthenticated(true);
      setIsLocked(false);
      setRemainingAttempts(null);
      fetchDashboardData();
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Invalid administrator credentials');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
    setLeads([]);
    setPassword1Input('');
    setPassword2Input('');
    setPassword3Input('');
  }

  async function handleStatusChange(id: string, newStatus: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }

  async function handlePromoteToLead(id: string) {
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'DEMO_LEAD',
          status: 'NEW',
          internalNotes: 'Promoted from general contact query to gym demo lead.',
        }),
      });
      setLeads((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                type: 'DEMO_LEAD',
                status: 'NEW',
                internalNotes: 'Promoted from general contact query to gym demo lead.',
              }
            : l
        )
      );
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead((prev) =>
          prev
            ? {
                ...prev,
                type: 'DEMO_LEAD',
                status: 'NEW',
                internalNotes: 'Promoted from general contact query to gym demo lead.',
              }
            : null
        );
      }
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to promote entry to lead:', error);
    }
  }

  async function handleSaveNotes(id: string, notes: string) {
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalNotes: notes }),
      });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, internalNotes: notes } : l)));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead((prev) => (prev ? { ...prev, internalNotes: notes } : null));
      }
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  }

  async function handleUpdateLeadReferralCode(id: string, code: string) {
    const clean = code.trim().toUpperCase();
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode: clean }),
      });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, referralCode: clean } : l)));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead((prev) => (prev ? { ...prev, referralCode: clean } : null));
      }
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to update lead referral code:', error);
    }
  }

  async function handleDeleteLead(id: string) {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      setLeads((prev) => prev.filter((l) => l.id !== id));
      if (selectedLead?.id === id) setSelectedLead(null);
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  }

  async function handleAddManualLead(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newLeadForm,
          type: newLeadType,
          referralCode: (newLeadForm.referralCode || '').trim().toUpperCase(),
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewLeadForm({
          contactName: '',
          contactRole: newLeadType === 'DEMO_LEAD' ? 'Owner / Manager' : 'General Inquirer',
          phone: '',
          email: '',
          gymName: '',
          city: '',
          serviceInterest: newLeadType === 'DEMO_LEAD' ? 'CRM' : 'General Contact',
          planInterest: 'Growth',
          referralCode: '',
          currentMemberRange: '50–150',
          onboardingInformation: '',
        });
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Failed to add lead:', error);
    }
  }

  async function handleCreateReferralCode(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReferralForm),
      });
      if (res.ok) {
        setShowAddReferralModal(false);
        setNewReferralForm({
          referrerName: '',
          code: '',
          referrerPhone: '',
          referrerEmail: '',
          notes: '',
        });
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Failed to create referral code:', error);
    }
  }

  async function handleToggleReferralStatus(id: string, currentStatus: string) {
    const nextStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      await fetch(`/api/admin/referrals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  }

  async function handleDeleteReferral(id: string) {
    if (!window.confirm('Are you sure you want to delete this referral code?')) return;
    try {
      await fetch(`/api/admin/referrals/${id}`, { method: 'DELETE' });
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to delete referral:', error);
    }
  }

  function handleCopyReferralLink(code: string) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://fitkalp.com';
    const link = `${origin}/register?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedRefCode(code);
    setTimeout(() => setCopiedRefCode(null), 2500);
  }

  function getFriendWhatsAppShareLink(ref: ReferralCodeWithStats) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://fitkalp.com';
    const link = `${origin}/register?ref=${ref.code}`;
    let phoneClean = (ref.referrerPhone || '').replace(/[^0-9]/g, '');
    if (phoneClean.length === 10) phoneClean = `91${phoneClean}`;

    const text = encodeURIComponent(
      `Hi ${ref.referrerName}! Here is your exclusive FitKalp referral link for gym owners: ${link}. Share this link and any gym owner who registers through it will be credited to you on my dashboard!`
    );

    if (phoneClean) {
      return `https://wa.me/${phoneClean}?text=${text}`;
    }
    return `https://wa.me/?text=${text}`;
  }

  function getLeadWhatsAppLink(lead: Lead) {
    let cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;

    if (lead.type === 'CONTACT_QUERY') {
      const msgSnippet = lead.onboardingInformation
        ? ` regarding your note: "${lead.onboardingInformation.slice(0, 50)}..."`
        : '';
      const text = encodeURIComponent(
        `Hi ${lead.contactName || 'there'}! This is Himanshu from FitKalp${msgSnippet}. How can I assist you today?`
      );
      return `https://wa.me/${cleanPhone}?text=${text}`;
    }

    // Demo / Gym lead
    const refMention = lead.referralCode ? ` (via ${lead.referralCode}'s referral)` : '';
    const text = encodeURIComponent(
      `Hi ${lead.contactName || 'there'}! This is Himanshu from FitKalp${refMention}. Thank you for requesting a demo for ${lead.gymName || 'your gym'}. Would you be free for a 10-minute walkthrough today or tomorrow?`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  }

  function handleReferrerNameChange(name: string) {
    const firstName = name.trim().split(/\s+/)[0] || '';
    const slug = firstName.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setNewReferralForm((prev) => ({
      ...prev,
      referrerName: name,
      code: prev.code && !prev.code.startsWith('FK-') ? prev.code : slug ? `FK-${slug}` : '',
    }));
  }

  // Count breakdowns
  const demoLeadsCount = useMemo(() => {
    return leads.filter((l) => l.type === 'DEMO_LEAD' || (!l.type && l.intent !== 'contact')).length;
  }, [leads]);

  const contactQueriesCount = useMemo(() => {
    return leads.filter((l) => l.type === 'CONTACT_QUERY' || (!l.type && l.intent === 'contact')).length;
  }, [leads]);

  // Unique referral codes for dropdown filter
  const uniqueReferralCodes = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => {
      if (l.referralCode) set.add(l.referralCode.toUpperCase());
    });
    referrals.forEach((r) => {
      set.add(r.code.toUpperCase());
    });
    return Array.from(set).sort();
  }, [leads, referrals]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const isDemo = lead.type === 'DEMO_LEAD' || (!lead.type && lead.intent !== 'contact');
      const isContact = lead.type === 'CONTACT_QUERY' || (!lead.type && lead.intent === 'contact');

      // Tab filter
      if (activeTab === 'demo_leads' && !isDemo) return false;
      if (activeTab === 'contact_queries' && !isContact) return false;

      // Status filter
      if (statusFilter !== 'ALL' && lead.status !== statusFilter) return false;

      // Service filter
      if (serviceFilter !== 'ALL' && (lead.serviceInterest || '').toUpperCase() !== serviceFilter.toUpperCase())
        return false;

      // Referral filter
      if (referralFilter !== 'ALL' && (lead.referralCode || '').toUpperCase() !== referralFilter)
        return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (lead.contactName || '').toLowerCase().includes(q) ||
        (lead.gymName || '').toLowerCase().includes(q) ||
        (lead.phone || '').toLowerCase().includes(q) ||
        (lead.email || '').toLowerCase().includes(q) ||
        (lead.city || '').toLowerCase().includes(q) ||
        (lead.referralCode || '').toLowerCase().includes(q) ||
        (lead.planInterest || '').toLowerCase().includes(q) ||
        (lead.onboardingInformation || '').toLowerCase().includes(q)
      );
    });
  }, [leads, activeTab, statusFilter, serviceFilter, referralFilter, searchQuery]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#F8FAF9', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <Image src="/logo.png" alt="FitKalp" width={140} height={48} priority style={{ height: 36, width: 'auto', margin: '0 auto 16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', color: '#6F767E', fontSize: 14 }}>
            <RefreshCw className="animate-spin" size={16} /> Loading Founder Portal…
          </div>
        </div>
      </div>
    );
  }

  // ─── LOGIN SCREEN ───────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px 40px',
          fontFamily: "'DM Sans','Inter',sans-serif",
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Header */}
        <header
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 1140,
            margin: '0 auto',
            width: '100%',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Image
              src="/logo.png"
              alt="FitKalp"
              width={140}
              height={48}
              priority
              style={{ height: 36, width: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </Link>

          <Link
            href="/"
            className="btn-secondary"
            style={{
              fontSize: 13,
              padding: '8px 16px',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} /> Back to Website
          </Link>
        </header>

        {/* Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(43, 147, 97, 0.12) 0%, rgba(43, 147, 97, 0.02) 60%, transparent 80%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Main Login Card */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: 480,
            background: '#FFFFFF',
            borderRadius: 28,
            padding: '40px 32px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(43, 147, 97, 0.04)',
            border: '1px solid #EFEFEF',
            textAlign: 'center',
            marginTop: 40,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 18px',
                borderRadius: 999,
                background: '#FFFFFF',
                border: '1px solid #EFEFEF',
                fontSize: 13,
                fontWeight: 600,
                color: '#6F767E',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#2B9361',
                  display: 'inline-block',
                  boxShadow: '0 0 10px rgba(43, 147, 97, 0.8)',
                }}
              />
              Triple-Key Founder Gate
            </span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 68,
              height: 68,
              borderRadius: 22,
              background: '#FFFFFF',
              marginBottom: 16,
              boxShadow: '0 10px 25px -5px rgba(43, 147, 97, 0.18), 0 2px 8px rgba(0, 0, 0, 0.04)',
              border: '1px solid #EFEFEF',
              overflow: 'hidden',
              padding: 8,
            }}
          >
            <Image
              src="/Icon.png"
              alt="FitKalp Icon"
              width={52}
              height={52}
              priority
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>

          <h1
            style={{
              fontSize: 'clamp(24px, 3.5vw, 28px)',
              fontWeight: 700,
              color: '#1A1D1F',
              marginBottom: 8,
              letterSpacing: '-0.025em',
            }}
          >
            Founder Control Hub
          </h1>
          <p
            style={{
              fontSize: 14,
              color: '#6F767E',
              marginBottom: 26,
              lineHeight: 1.5,
            }}
          >
            Enter your three administrative keys to access leads, manage referral partners, and review queries.
          </p>

          {isLocked ? (
            <div
              style={{
                background: '#FEF2F2',
                border: '1.5px solid #FECACA',
                color: '#991B1B',
                padding: '14px 16px',
                borderRadius: 16,
                fontSize: 13.5,
                marginBottom: 20,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <ShieldAlert size={22} color="#DC2626" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', fontSize: 14, marginBottom: 2 }}>
                  Access Temporarily Locked
                </strong>
                Too many failed attempts. Try again in{' '}
                <span style={{ fontWeight: 700, color: '#B91C1C' }}>
                  {Math.ceil(lockoutRemainingMs / 1000)}s
                </span>
                .
              </div>
            </div>
          ) : authError ? (
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                padding: '12px 16px',
                borderRadius: 14,
                fontSize: 13,
                marginBottom: 20,
                textAlign: 'left',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{authError}</div>
              {remainingAttempts !== null && remainingAttempts > 0 && remainingAttempts < 5 && (
                <div style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>
                  ⚠️ {remainingAttempts} attempt{remainingAttempts === 1 ? '' : 's'} remaining before temporary lockout.
                </div>
              )}
            </div>
          ) : null}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ textAlign: 'left' }}>
              <label style={loginLabelStyle}>
                <Key size={14} color="#2563EB" /> Key 1 • Founder Primary Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showP1 ? 'text' : 'password'}
                  autoFocus
                  required
                  disabled={isLocked || authLoading}
                  placeholder="Enter Key 1"
                  value={password1Input}
                  onChange={(e) => setPassword1Input(e.target.value)}
                  style={loginInputStyle(isLocked)}
                />
                <button
                  type="button"
                  onClick={() => setShowP1(!showP1)}
                  style={eyeButtonStyle}
                >
                  {showP1 ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={loginLabelStyle}>
                <Key size={14} color="#7C3AED" /> Key 2 • Security Passphrase
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showP2 ? 'text' : 'password'}
                  required
                  disabled={isLocked || authLoading}
                  placeholder="Enter Key 2"
                  value={password2Input}
                  onChange={(e) => setPassword2Input(e.target.value)}
                  style={loginInputStyle(isLocked)}
                />
                <button
                  type="button"
                  onClick={() => setShowP2(!showP2)}
                  style={eyeButtonStyle}
                >
                  {showP2 ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={loginLabelStyle}>
                <Key size={14} color="#2B9361" /> Key 3 • Master PIN / Secret Token
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showP3 ? 'text' : 'password'}
                  required
                  disabled={isLocked || authLoading}
                  placeholder="Enter Key 3"
                  value={password3Input}
                  onChange={(e) => setPassword3Input(e.target.value)}
                  style={loginInputStyle(isLocked)}
                />
                <button
                  type="button"
                  onClick={() => setShowP3(!showP3)}
                  style={eyeButtonStyle}
                >
                  {showP3 ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLocked || authLoading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 999,
                marginTop: 6,
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: authLoading || isLocked ? 0.7 : 1,
              }}
            >
              {authLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} /> Verifying 3-Key Signatures…
                </>
              ) : isLocked ? (
                'Access Locked (Rate Limited)'
              ) : (
                'Verify Keys & Enter Hub →'
              )}
            </button>
          </form>

          <div
            style={{
              marginTop: 24,
              paddingTop: 16,
              borderTop: '1px solid #EFEFEF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: 12,
              color: '#6F767E',
            }}
          >
            <span>🔒 Direct Encrypted Session</span>
            <span>•</span>
            <span>Rate-Limited Protection</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN DASHBOARD ─────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F8FAF9',
        color: '#1A1D1F',
        fontFamily: "'DM Sans','Inter',sans-serif",
        paddingBottom: 80,
      }}
    >
      {/* ─── TOP HEADER BAR ─────────────────────────────────────── */}
      <header
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #EFEFEF',
          padding: '16px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Image src="/logo.png" alt="FitKalp" width={130} height={42} style={{ height: 32, width: 'auto' }} priority />
            <div style={{ height: 20, width: 1, background: '#E5E7EB' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  background: '#E9F4EE',
                  color: '#2B9361',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 99,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                }}
              >
                Founder Hub
              </span>
              <span style={{ fontSize: 13, color: '#6F767E', fontWeight: 500 }}>
                Himanshu Soni
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowAddReferralModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                color: '#92400E',
                background: '#FEF3C7',
                border: '1px solid #FCD34D',
                borderRadius: 99,
                cursor: 'pointer',
              }}
            >
              <Gift size={15} /> + Generate Referral Code
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                color: '#2B9361',
                background: '#E9F4EE',
                border: 'none',
                borderRadius: 99,
                cursor: 'pointer',
              }}
            >
              <Plus size={15} /> + Add Offline Entry
            </button>

            <a
              href="/api/admin/leads/export"
              download
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                color: '#1A1D1F',
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 99,
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              <Download size={14} /> Export CSV
            </a>

            <button
              onClick={() => fetchDashboardData()}
              disabled={refreshing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 500,
                color: '#6F767E',
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 99,
                cursor: 'pointer',
              }}
              title="Refresh dashboard data"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Syncing…' : 'Refresh'}
            </button>

            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                fontSize: 13,
                color: '#EF4444',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER ──────────────────────────────── */}
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 24px' }}>
        
        {/* Top Header & Clear Distinction Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1A1D1F', letterSpacing: '-0.02em', marginBottom: 4 }}>
              {activeTab === 'demo_leads' && '🎯 Gym Demo & Onboarding Leads'}
              {activeTab === 'contact_queries' && '✉️ General Contact Us Queries & Messages'}
              {activeTab === 'all' && '📋 All Inbound Submissions'}
              {activeTab === 'referrals' && '🏆 Referral Codes & Partner Leaderboard'}
            </h1>
            <p style={{ fontSize: 14, color: '#6F767E', margin: 0, maxWidth: 720 }}>
              {activeTab === 'demo_leads' &&
                'High-intent gym owners & managers who requested a live walkthrough, trial, or CRM onboarding.'}
              {activeTab === 'contact_queries' &&
                'General inquiries, partner questions, vendor messages, and public notes submitted via the Contact Us form.'}
              {activeTab === 'all' &&
                'Combined chronological feed with explicit distinctions between high-intent Demo Leads and general Contact Messages.'}
              {activeTab === 'referrals' &&
                'Standardized referral codes (FK- format), tracked gym conversions, and partner ranking.'}
            </p>
          </div>

          {/* Dedicated Distinction Switcher Tabs */}
          <div style={{ display: 'flex', background: '#FFFFFF', padding: 4, borderRadius: 14, border: '1px solid #E5E7EB', gap: 4, flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('demo_leads')}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                border: 'none',
                background: activeTab === 'demo_leads' ? '#2B9361' : 'transparent',
                color: activeTab === 'demo_leads' ? '#FFFFFF' : '#4B5563',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
            >
              <Sparkles size={15} /> Demo Leads ({demoLeadsCount})
            </button>

            <button
              onClick={() => setActiveTab('contact_queries')}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                border: 'none',
                background: activeTab === 'contact_queries' ? '#2563EB' : 'transparent',
                color: activeTab === 'contact_queries' ? '#FFFFFF' : '#4B5563',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
            >
              <Mail size={15} /> Contact Queries ({contactQueriesCount})
            </button>

            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                background: activeTab === 'all' ? '#1A1D1F' : 'transparent',
                color: activeTab === 'all' ? '#FFFFFF' : '#6F767E',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
            >
              <Users size={15} /> All ({leads.length})
            </button>

            <button
              onClick={() => setActiveTab('referrals')}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                border: 'none',
                background: activeTab === 'referrals' ? '#D97706' : 'transparent',
                color: activeTab === 'referrals' ? '#FFFFFF' : '#4B5563',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
            >
              <Trophy size={15} /> Referrals ({referrals.length})
            </button>
          </div>
        </div>

        {/* ─── METRIC STAT CARDS ─────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
            marginBottom: 28,
          }}
        >
          {/* Card 1: Demo / Sales Leads */}
          <div
            style={{
              ...statCardStyle,
              borderLeft: activeTab === 'demo_leads' ? '4px solid #2B9361' : '1px solid #EFEFEF',
              cursor: 'pointer',
            }}
            onClick={() => setActiveTab('demo_leads')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#2B9361', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={14} /> 🎯 Gym Demo Leads
              </span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#E9F4EE', color: '#2B9361', display: 'grid', placeItems: 'center' }}>
                <Users size={16} />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#1A1D1F' }}>{demoLeadsCount}</div>
            <div style={{ fontSize: 12, color: '#2B9361', marginTop: 4, fontWeight: 600 }}>
              {stats?.newDemoLeads ?? 0} require demo walkthrough
            </div>
          </div>

          {/* Card 2: Contact Us Messages */}
          <div
            style={{
              ...statCardStyle,
              borderLeft: activeTab === 'contact_queries' ? '4px solid #2563EB' : '1px solid #EFEFEF',
              cursor: 'pointer',
            }}
            onClick={() => setActiveTab('contact_queries')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#2563EB', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Mail size={14} /> ✉️ Contact Us Queries
              </span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EFF6FF', color: '#2563EB', display: 'grid', placeItems: 'center' }}>
                <MessageSquare size={16} />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#2563EB' }}>{contactQueriesCount}</div>
            <div style={{ fontSize: 12, color: '#6F767E', marginTop: 4 }}>
              {stats?.newContactQueries ?? 0} new general messages
            </div>
          </div>

          {/* Card 3: Referral Partners */}
          <div
            style={{
              ...statCardStyle,
              borderLeft: activeTab === 'referrals' ? '4px solid #D97706' : '1px solid #EFEFEF',
              cursor: 'pointer',
            }}
            onClick={() => setActiveTab('referrals')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#D97706', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Gift size={14} /> Referral Partners
              </span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FEF3C7', color: '#D97706', display: 'grid', placeItems: 'center' }}>
                <Award size={16} />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#D97706' }}>
              {referrals.filter((r) => r.status === 'ACTIVE').length}
            </div>
            <div style={{ fontSize: 12, color: '#6F767E', marginTop: 4 }}>
              {stats?.totalReferrals ?? 0} leads from {referrals.length} partners
            </div>
          </div>

          {/* Card 4: Converted Closings */}
          <div style={statCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#15803D', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Trophy size={14} /> Converted Gyms
              </span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F0FDF4', color: '#15803D', display: 'grid', placeItems: 'center' }}>
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#15803D' }}>{stats?.converted ?? 0}</div>
            <div style={{ fontSize: 12, color: '#15803D', marginTop: 4, fontWeight: 600 }}>
              {demoLeadsCount > 0 ? Math.round(((stats?.converted || 0) / demoLeadsCount) * 100) : 0}% closing rate
            </div>
          </div>
        </div>

        {/* ─── INBOUND LEADS & CONTACT MESSAGES VIEWS ─────────────── */}
        {activeTab !== 'referrals' && (
          <>
            {/* ─── FILTERS & SEARCH TOOLBAR ──────────────────────────── */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: 16,
                border: '1px solid #EFEFEF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                marginBottom: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Search Input */}
                <div style={{ position: 'relative', flex: '1 1 320px', minWidth: 260 }}>
                  <Search
                    size={16}
                    color="#9CA3AF"
                    style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    placeholder={
                      activeTab === 'contact_queries'
                        ? 'Search contact messages, sender name, email, phone…'
                        : 'Search gym name, owner, phone, city, referral code, or notes…'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 12,
                      border: '1.5px solid #E5E7EB',
                      fontSize: 14,
                      background: '#FAFAFA',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Dropdown Filters */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  {/* Referral Filter */}
                  {uniqueReferralCodes.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, color: '#6F767E', fontWeight: 500 }}>Referrer:</span>
                      <select
                        value={referralFilter}
                        onChange={(e) => setReferralFilter(e.target.value)}
                        style={{
                          padding: '9px 12px',
                          borderRadius: 10,
                          border: '1.5px solid #E5E7EB',
                          fontSize: 13,
                          background: referralFilter !== 'ALL' ? '#FEF3C7' : '#FAFAFA',
                          color: '#1A1D1F',
                          outline: 'none',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        <option value="ALL">All Referrers</option>
                        {uniqueReferralCodes.map((code) => (
                          <option key={code} value={code}>
                            🎁 {code}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Service Filter */}
                  {activeTab !== 'contact_queries' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, color: '#6F767E', fontWeight: 500 }}>Service:</span>
                      <select
                        value={serviceFilter}
                        onChange={(e) => setServiceFilter(e.target.value)}
                        style={{
                          padding: '9px 12px',
                          borderRadius: 10,
                          border: '1.5px solid #E5E7EB',
                          fontSize: 13,
                          background: '#FAFAFA',
                          color: '#1A1D1F',
                          outline: 'none',
                          cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        <option value="ALL">All Services</option>
                        <option value="CRM">Gym CRM</option>
                        <option value="WEBSITE">Website Building</option>
                        <option value="BOTH">CRM + Website</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                {[
                  { id: 'ALL', label: 'All Statuses' },
                  { id: 'NEW', label: activeTab === 'contact_queries' ? 'New Message' : 'New Lead' },
                  { id: 'CONTACTED', label: 'Contacted' },
                  ...(activeTab === 'contact_queries'
                    ? [
                        { id: 'REPLIED', label: 'Replied' },
                        { id: 'CONVERTED', label: 'Promoted to Lead' },
                        { id: 'SPAM_COMPETITOR', label: 'Spam / Competitor' },
                      ]
                    : [
                        { id: 'DEMO_SCHEDULED', label: 'Demo Scheduled' },
                        { id: 'CONVERTED', label: 'Converted 🏆' },
                      ]),
                  { id: 'ARCHIVED', label: 'Archived' },
                ].map((tab) => {
                  const active = statusFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 99,
                        fontSize: 12.5,
                        fontWeight: 600,
                        border: active ? '1.5px solid #2B9361' : '1px solid #E5E7EB',
                        background: active ? '#E9F4EE' : '#FFFFFF',
                        color: active ? '#2B9361' : '#6F767E',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─── DATA TABLE ─────────────────────────────────────────── */}
            {filteredLeads.length === 0 ? (
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 20,
                  padding: '60px 20px',
                  textAlign: 'center',
                  border: '1px solid #EFEFEF',
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F3F4F6', color: '#9CA3AF', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
                  {activeTab === 'contact_queries' ? <Mail size={24} /> : <Users size={24} />}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1D1F', marginBottom: 6 }}>
                  {activeTab === 'contact_queries' ? 'No contact messages match your filter' : 'No inquiries match your filter'}
                </h3>
                <p style={{ fontSize: 14, color: '#6F767E', maxWidth: 420, margin: '0 auto 18px' }}>
                  {leads.length === 0
                    ? 'Submissions from your website will instantly arrive here.'
                    : 'Try resetting your search query or status filter to see all entries.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                    setServiceFilter('ALL');
                    setReferralFilter('ALL');
                  }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 99,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#2B9361',
                    background: '#E9F4EE',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 20,
                  border: '1px solid #EFEFEF',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                    <thead>
                      <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EFEFEF', color: '#6F767E', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {activeTab === 'all' && (
                          <th style={{ padding: '14px 18px', fontWeight: 700 }}>Category</th>
                        )}
                        <th style={{ padding: '14px 18px', fontWeight: 600 }}>
                          {activeTab === 'contact_queries' ? 'Sender & Inquiry' : 'Gym & Contact'}
                        </th>
                        <th style={{ padding: '14px 18px', fontWeight: 600 }}>Direct Contact</th>
                        <th style={{ padding: '14px 18px', fontWeight: 600 }}>
                          {activeTab === 'contact_queries' ? 'Message Preview' : 'Interest / Plan'}
                        </th>
                        <th style={{ padding: '14px 18px', fontWeight: 600 }}>
                          {activeTab === 'contact_queries' ? 'Source' : 'Referral Code'}
                        </th>
                        {activeTab !== 'contact_queries' && (
                          <th style={{ padding: '14px 18px', fontWeight: 600 }}>Members</th>
                        )}
                        <th style={{ padding: '14px 18px', fontWeight: 600 }}>Date</th>
                        <th style={{ padding: '14px 18px', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead, index) => {
                        const isContact = lead.type === 'CONTACT_QUERY' || (!lead.type && lead.intent === 'contact');
                        const statusColor = STATUS_COLORS[lead.status] || STATUS_COLORS.NEW;
                        const date = new Date(lead.createdAt);
                        const formattedDate = date.toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        return (
                          <tr
                            key={lead.id}
                            style={{
                              borderBottom: index < filteredLeads.length - 1 ? '1px solid #F3F4F6' : 'none',
                              background: isContact ? 'rgba(239, 246, 255, 0.25)' : '#FFFFFF',
                              transition: 'background 0.15s ease',
                            }}
                            className="hover:bg-slate-50"
                          >
                            {/* Category Tag Column for All Inbound View */}
                            {activeTab === 'all' && (
                              <td style={{ padding: '16px 18px' }}>
                                {isContact ? (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4,
                                      background: '#EFF6FF',
                                      color: '#1D4ED8',
                                      border: '1px solid #BFDBFE',
                                      padding: '3px 8px',
                                      borderRadius: 6,
                                      fontSize: 11.5,
                                      fontWeight: 700,
                                    }}
                                    title="General message from Contact Us form"
                                  >
                                    <Mail size={12} /> Contact Query
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4,
                                      background: '#ECFDF5',
                                      color: '#047857',
                                      border: '1px solid #A7F3D0',
                                      padding: '3px 8px',
                                      borderRadius: 6,
                                      fontSize: 11.5,
                                      fontWeight: 700,
                                    }}
                                    title="High-intent gym demo request"
                                  >
                                    <Sparkles size={12} /> Demo Lead
                                  </span>
                                )}
                              </td>
                            )}

                            {/* Name & Gym/Org */}
                            <td style={{ padding: '16px 18px' }}>
                              {isContact ? (
                                <div>
                                  <div style={{ fontWeight: 700, color: '#1A1D1F', fontSize: 15 }}>
                                    {lead.contactName}
                                  </div>
                                  <div style={{ color: '#6F767E', fontSize: 13, marginTop: 2 }}>
                                    {lead.gymName && lead.gymName !== 'General Inquiry'
                                      ? `Org/Gym: ${lead.gymName}`
                                      : 'General Public / Inquirer'}
                                  </div>
                                  {lead.city && (
                                    <div style={{ color: '#9CA3AF', fontSize: 12, display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                                      <MapPin size={11} /> {lead.city}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <div style={{ fontWeight: 700, color: '#1A1D1F', fontSize: 15 }}>
                                    {lead.gymName || 'Fitness Studio'}
                                  </div>
                                  <div style={{ color: '#6F767E', fontSize: 13, marginTop: 2 }}>
                                    {lead.contactName} {lead.contactRole ? `· ${lead.contactRole}` : ''}
                                  </div>
                                  {lead.city && (
                                    <div style={{ color: '#9CA3AF', fontSize: 12, display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                                      <MapPin size={11} /> {lead.city}{lead.state ? `, ${lead.state}` : ''}
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Direct Contact (WhatsApp + Call + Email) */}
                            <td style={{ padding: '16px 18px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {lead.phone && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <a
                                      href={getLeadWhatsAppLink(lead)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        background: '#25D366',
                                        color: '#FFFFFF',
                                        padding: '3px 8px',
                                        borderRadius: 6,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                      }}
                                      title={isContact ? 'Reply on WhatsApp' : 'Open WhatsApp chat'}
                                    >
                                      <MessageCircle size={12} fill="#FFFFFF" /> WhatsApp
                                    </a>
                                    <a
                                      href={`tel:${lead.phone}`}
                                      style={{ color: '#1A1D1F', textDecoration: 'none', fontWeight: 500, fontSize: 13 }}
                                    >
                                      {lead.phone}
                                    </a>
                                  </div>
                                )}

                                {lead.email && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Mail size={12} color="#6F767E" />
                                    <a
                                      href={`mailto:${lead.email}`}
                                      style={{ color: '#6F767E', textDecoration: 'none', fontSize: 12 }}
                                    >
                                      {lead.email}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Message Preview or Plan Interest */}
                            <td style={{ padding: '16px 18px', maxWidth: 300 }}>
                              {isContact ? (
                                <div>
                                  <div
                                    style={{
                                      fontSize: 13,
                                      color: '#1E293B',
                                      background: '#F1F5F9',
                                      padding: '6px 10px',
                                      borderRadius: 8,
                                      border: '1px solid #E2E8F0',
                                      lineHeight: 1.4,
                                      maxHeight: 52,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    &ldquo;{lead.onboardingInformation || 'No message text provided'}&rdquo;
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      background: '#F3F4F6',
                                      color: '#1A1D1F',
                                      padding: '3px 8px',
                                      borderRadius: 6,
                                      fontSize: 12,
                                      fontWeight: 600,
                                    }}
                                  >
                                    {lead.serviceInterest === 'BOTH' ? 'CRM + Website' : lead.serviceInterest || 'CRM'}
                                  </span>
                                  {lead.planInterest && (
                                    <div style={{ fontSize: 12, color: '#2B9361', fontWeight: 600, marginTop: 4 }}>
                                      Plan: {lead.planInterest}
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Referral Code / Source */}
                            <td style={{ padding: '16px 18px' }}>
                              {lead.referralCode ? (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    background: '#FEF3C7',
                                    color: '#92400E',
                                    border: '1px solid #FCD34D',
                                    padding: '3px 8px',
                                    borderRadius: 6,
                                    fontSize: 12,
                                    fontWeight: 700,
                                  }}
                                  title={`Referred by ${lead.referralCode}`}
                                >
                                  <Gift size={12} /> {lead.referralCode}
                                </span>
                              ) : isContact ? (
                                <span style={{ color: '#6F767E', fontSize: 12 }}>Contact Form</span>
                              ) : (
                                <span style={{ color: '#9CA3AF', fontSize: 12 }}>Direct</span>
                              )}
                            </td>

                            {/* Members Count (for Demo Leads) */}
                            {activeTab !== 'contact_queries' && (
                              <td style={{ padding: '16px 18px', color: '#1A1D1F', fontSize: 13, fontWeight: 500 }}>
                                {isContact ? '—' : lead.currentMemberRange || '—'}
                              </td>
                            )}

                            {/* Date */}
                            <td style={{ padding: '16px 18px', color: '#6F767E', fontSize: 12, whiteSpace: 'nowrap' }}>
                              {formattedDate}
                            </td>

                            {/* Status Dropdown */}
                            <td style={{ padding: '16px 18px' }}>
                              <select
                                value={lead.status}
                                onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: 8,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  background: statusColor.bg,
                                  color: statusColor.text,
                                  border: `1px solid ${statusColor.border}`,
                                  cursor: 'pointer',
                                  outline: 'none',
                                }}
                              >
                                <option value="NEW">{isContact ? 'New Message' : 'New Lead'}</option>
                                <option value="CONTACTED">Contacted</option>
                                {isContact ? (
                                  <>
                                    <option value="REPLIED">Replied / Handled</option>
                                    <option value="CONVERTED">Promoted to Lead 🎯</option>
                                    <option value="SPAM_COMPETITOR">Spam / Competitor</option>
                                    <option value="NOT_INTERESTED">Closed</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="DEMO_SCHEDULED">Demo Scheduled</option>
                                    <option value="TRIAL_ACTIVE">Trial Active</option>
                                    <option value="CONVERTED">Converted 🏆</option>
                                    <option value="NOT_INTERESTED">Not Interested</option>
                                    <option value="SPAM_COMPETITOR">Competitor / Spam</option>
                                  </>
                                )}
                                <option value="ARCHIVED">Archived</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                                {isContact && lead.status !== 'CONVERTED' && (
                                  <button
                                    onClick={() => handlePromoteToLead(lead.id)}
                                    style={{
                                      padding: '5px 10px',
                                      borderRadius: 8,
                                      fontSize: 11.5,
                                      fontWeight: 700,
                                      background: '#ECFDF5',
                                      color: '#047857',
                                      border: '1px solid #A7F3D0',
                                      cursor: 'pointer',
                                    }}
                                    title="Convert this general contact message into a qualified gym sales lead"
                                  >
                                    🎯 Make Lead
                                  </button>
                                )}

                                <button
                                  onClick={() => setSelectedLead(lead)}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    background: isContact ? '#EFF6FF' : '#E9F4EE',
                                    color: isContact ? '#1D4ED8' : '#2B9361',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                  }}
                                  title="View full details"
                                >
                                  <Eye size={13} /> View
                                </button>

                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  style={{
                                    padding: '6px',
                                    borderRadius: 8,
                                    color: '#9CA3AF',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                  }}
                                  title="Delete entry"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ─── TAB 4: REFERRAL CODES & PARTNER LEADERBOARD ───────── */}
        {activeTab === 'referrals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                borderRadius: 20,
                padding: '24px 28px',
                border: '1px solid #FCD34D',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#B45309', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', marginBottom: 4 }}>
                  <Award size={18} /> Standardized Referral Code Generator &amp; Partner Hub
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#78350F', margin: '0 0 4px' }}>
                  Managed Partner Referral Codes
                </h2>
                <p style={{ fontSize: 14, color: '#92400E', margin: 0, maxWidth: 600 }}>
                  Generate clean standardized codes (e.g. <code>FK-VIKRAM</code>) for friends, trainers, or influencers. Share their link with 1-click and track every gym closing.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => setShowAddReferralModal(true)}
                  style={{
                    background: '#B45309',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 22px',
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 14,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(180,83,9,0.25)',
                  }}
                >
                  <Plus size={16} /> Generate New Referral Code
                </button>
              </div>
            </div>

            {/* Referral Codes List */}
            {referrals.length === 0 ? (
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 20,
                  padding: '60px 20px',
                  textAlign: 'center',
                  border: '1px solid #EFEFEF',
                }}
              >
                <Gift size={40} color="#D97706" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1D1F', marginBottom: 6 }}>No referral codes generated yet</h3>
                <p style={{ fontSize: 14, color: '#6F767E', maxWidth: 460, margin: '0 auto 20px' }}>
                  Click &ldquo;Generate New Referral Code&rdquo; above to create a standardized link (e.g. <code>FK-VIKRAM</code>) for any friend, gym partner, or trainer.
                </p>
                <button
                  onClick={() => setShowAddReferralModal(true)}
                  className="btn-primary"
                  style={{ padding: '10px 24px', fontSize: 14 }}
                >
                  + Generate First Referral Code
                </button>
              </div>
            ) : (
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 20,
                  border: '1px solid #EFEFEF',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                    <thead>
                      <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EFEFEF', color: '#6F767E', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <th style={{ padding: '14px 18px', fontWeight: 600 }}>Rank & Referrer</th>
                        <th style={{ padding: '14px 18px', fontWeight: 600 }}>Standard Code</th>
                        <th style={{ padding: '14px 18px', fontWeight: 600 }}>Total Leads</th>
                        <th style={{ padding: '14px 18px', fontWeight: 600 }}>Converted 🏆</th>
                        <th style={{ padding: '14px 18px', fontWeight: 600 }}>Conversion Rate</th>
                        <th style={{ padding: '14px 18px', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }}>Share &amp; Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals
                        .sort((a, b) => b.convertedLeads - a.convertedLeads || b.totalLeads - a.totalLeads)
                        .map((ref, i) => {
                          const rankMedal = i === 0 ? '🥇 1st' : i === 1 ? '🥈 2nd' : i === 2 ? '🥉 3rd' : `#${i + 1}`;
                          const isCopied = copiedRefCode === ref.code;

                          return (
                            <tr
                              key={ref.id}
                              style={{
                                borderBottom: i < referrals.length - 1 ? '1px solid #F3F4F6' : 'none',
                                opacity: ref.status === 'ACTIVE' ? 1 : 0.65,
                              }}
                              className="hover:bg-amber-50/40"
                            >
                              <td style={{ padding: '16px 18px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <span style={{ fontWeight: 800, fontSize: 14, color: i < 3 ? '#B45309' : '#6F767E', minWidth: 40 }}>
                                    {rankMedal}
                                  </span>
                                  <div>
                                    <div style={{ fontWeight: 700, fontSize: 15, color: '#1A1D1F' }}>
                                      {ref.referrerName}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#6F767E' }}>
                                      {ref.notes || (ref.referrerPhone ? `Phone: ${ref.referrerPhone}` : 'Partner')}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td style={{ padding: '16px 18px' }}>
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    background: '#FEF3C7',
                                    color: '#92400E',
                                    border: '1px solid #FCD34D',
                                    padding: '4px 10px',
                                    borderRadius: 8,
                                    fontSize: 13,
                                    fontWeight: 800,
                                    letterSpacing: '0.04em',
                                  }}
                                >
                                  <Gift size={13} /> {ref.code}
                                </span>
                              </td>

                              <td style={{ padding: '16px 18px', fontWeight: 700, fontSize: 15, color: '#1A1D1F' }}>
                                {ref.totalLeads}
                              </td>

                              <td style={{ padding: '16px 18px' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    padding: '4px 10px',
                                    borderRadius: 8,
                                    background: ref.convertedLeads > 0 ? '#DCFCE7' : '#F3F4F6',
                                    color: ref.convertedLeads > 0 ? '#15803D' : '#6F767E',
                                    fontWeight: 700,
                                  }}
                                >
                                  {ref.convertedLeads} {ref.convertedLeads > 0 ? '🏆 Closed' : '—'}
                                </span>
                              </td>

                              <td style={{ padding: '16px 18px' }}>
                                <div style={{ fontWeight: 700, color: '#1A1D1F' }}>{ref.conversionRate}%</div>
                                {ref.demoLeads > 0 && (
                                  <div style={{ fontSize: 11, color: '#7E22CE' }}>{ref.demoLeads} demos</div>
                                )}
                              </td>

                              <td style={{ padding: '16px 18px' }}>
                                <button
                                  onClick={() => handleToggleReferralStatus(ref.id, ref.status)}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: 99,
                                    fontSize: 11,
                                    fontWeight: 700,
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: ref.status === 'ACTIVE' ? '#E9F4EE' : '#F3F4F6',
                                    color: ref.status === 'ACTIVE' ? '#2B9361' : '#6F767E',
                                  }}
                                >
                                  {ref.status === 'ACTIVE' ? 'Active' : 'Paused'}
                                </button>
                              </td>

                              <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                                  <button
                                    onClick={() => handleCopyReferralLink(ref.code)}
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: 8,
                                      fontSize: 12,
                                      fontWeight: 600,
                                      background: isCopied ? '#DCFCE7' : '#F3F4F6',
                                      color: isCopied ? '#15803D' : '#1A1D1F',
                                      border: '1px solid #E5E7EB',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4,
                                    }}
                                    title="Copy referral link"
                                  >
                                    {isCopied ? <Check size={13} /> : <Copy size={13} />}
                                    {isCopied ? 'Copied!' : 'Copy Link'}
                                  </button>

                                  <a
                                    href={getFriendWhatsAppShareLink(ref)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: 8,
                                      fontSize: 12,
                                      fontWeight: 600,
                                      background: '#25D366',
                                      color: '#FFFFFF',
                                      textDecoration: 'none',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4,
                                    }}
                                    title="Send link on WhatsApp"
                                  >
                                    <MessageCircle size={13} fill="#FFFFFF" /> WhatsApp
                                  </a>

                                  <button
                                    onClick={() => {
                                      setReferralFilter(ref.code);
                                      setActiveTab('demo_leads');
                                    }}
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: 8,
                                      fontSize: 12,
                                      fontWeight: 600,
                                      background: '#FEF3C7',
                                      color: '#92400E',
                                      border: '1px solid #FCD34D',
                                      cursor: 'pointer',
                                    }}
                                    title="Filter leads for this referral"
                                  >
                                    Leads ({ref.totalLeads})
                                  </button>

                                  <button
                                    onClick={() => handleDeleteReferral(ref.id)}
                                    style={{
                                      padding: '6px',
                                      borderRadius: 8,
                                      color: '#9CA3AF',
                                      background: 'transparent',
                                      border: 'none',
                                      cursor: 'pointer',
                                    }}
                                    title="Delete referral code"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─── LEAD / MESSAGE DETAILS MODAL ──────────────────────────── */}
      {selectedLead && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'grid',
            placeItems: 'center',
            padding: 16,
            zIndex: 300,
          }}
          onClick={() => setSelectedLead(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 660,
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#FFFFFF',
              borderRadius: 24,
              padding: '32px 28px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              border: '1px solid #EFEFEF',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Distinct Context Header Banner */}
            {selectedLead.type === 'CONTACT_QUERY' ? (
              <div
                style={{
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: 14,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                <Mail size={20} color="#2563EB" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#1D4ED8', fontSize: 13, display: 'block' }}>
                    ✉️ General Contact Us Inquiry (Not a demo registration)
                  </strong>
                  <span style={{ fontSize: 12, color: '#3B82F6' }}>
                    Submitted via Contact Us form — could be a general inquiry, competitor, partner, or question.
                  </span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: 14,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                <Sparkles size={20} color="#047857" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#047857', fontSize: 13, display: 'block' }}>
                    🎯 Qualified Gym Walkthrough &amp; Demo Lead
                  </strong>
                  <span style={{ fontSize: 12, color: '#059669' }}>
                    High-intent fitness business looking for gym management software or website setup.
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      background: STATUS_COLORS[selectedLead.status]?.bg || '#F3F4F6',
                      color: STATUS_COLORS[selectedLead.status]?.text || '#1A1D1F',
                    }}
                  >
                    {getStatusLabel(selectedLead.status, selectedLead.type)}
                  </span>
                  {selectedLead.referralCode && (
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        background: '#FEF3C7',
                        color: '#92400E',
                        border: '1px solid #FCD34D',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Gift size={13} /> Ref: {selectedLead.referralCode}
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1A1D1F', margin: 0 }}>
                  {selectedLead.type === 'CONTACT_QUERY'
                    ? selectedLead.contactName
                    : selectedLead.gymName}
                </h2>
                <p style={{ color: '#6F767E', fontSize: 14, margin: '4px 0 0' }}>
                  Submitted on {new Date(selectedLead.createdAt).toLocaleString('en-IN')}
                </p>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'grid', placeItems: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Direct Connect Action Row */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              {selectedLead.phone && (
                <a
                  href={getLeadWhatsAppLink(selectedLead)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    background: '#25D366',
                    padding: '10px 18px',
                    fontSize: 14,
                    textDecoration: 'none',
                  }}
                >
                  <MessageCircle size={16} fill="#FFFFFF" /> Open WhatsApp Chat
                </a>
              )}
              {selectedLead.phone && (
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="btn-secondary"
                  style={{ padding: '10px 18px', fontSize: 14, textDecoration: 'none' }}
                >
                  <Phone size={15} /> Call {selectedLead.phone}
                </a>
              )}
              {selectedLead.email && (
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="btn-secondary"
                  style={{ padding: '10px 18px', fontSize: 14, textDecoration: 'none' }}
                >
                  <Mail size={15} /> Email
                </a>
              )}

              {selectedLead.type === 'CONTACT_QUERY' && selectedLead.status !== 'CONVERTED' && (
                <button
                  onClick={() => handlePromoteToLead(selectedLead.id)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 99,
                    fontSize: 13,
                    fontWeight: 700,
                    background: '#ECFDF5',
                    color: '#047857',
                    border: '1.5px solid #A7F3D0',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                  title="Promote to Qualified Gym Lead"
                >
                  <Sparkles size={14} /> Promote to Gym Lead 🎯
                </button>
              )}
            </div>

            {/* Prominent Message Box for Contact Queries */}
            {selectedLead.type === 'CONTACT_QUERY' && selectedLead.onboardingInformation && (
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: '18px 20px', marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MessageSquare size={14} /> Contact Query Message Content:
                </div>
                <div style={{ fontSize: 15, color: '#0F172A', whiteSpace: 'pre-wrap', lineHeight: 1.65, fontWeight: 500 }}>
                  {selectedLead.onboardingInformation}
                </div>
              </div>
            )}

            {/* Grid Information Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 24 }}>
              <div style={infoBoxStyle}>
                <div style={infoLabelStyle}>Contact Person</div>
                <div style={infoValStyle}>
                  {selectedLead.contactName} ({selectedLead.contactRole || 'Owner'})
                </div>
              </div>

              {selectedLead.type !== 'CONTACT_QUERY' && (
                <div style={infoBoxStyle}>
                  <div style={infoLabelStyle}>Gym Name</div>
                  <div style={infoValStyle}>{selectedLead.gymName || '—'}</div>
                </div>
              )}

              {selectedLead.type === 'CONTACT_QUERY' && selectedLead.gymName && (
                <div style={infoBoxStyle}>
                  <div style={infoLabelStyle}>Sender&apos;s Business / Org</div>
                  <div style={infoValStyle}>{selectedLead.gymName}</div>
                </div>
              )}

              <div style={infoBoxStyle}>
                <div style={infoLabelStyle}>City &amp; State</div>
                <div style={infoValStyle}>{selectedLead.city || '—'}{selectedLead.state ? `, ${selectedLead.state}` : ''}</div>
              </div>

              {selectedLead.type !== 'CONTACT_QUERY' && (
                <>
                  <div style={infoBoxStyle}>
                    <div style={infoLabelStyle}>Business Type</div>
                    <div style={infoValStyle}>{selectedLead.businessType || 'Gym / Fitness Studio'}</div>
                  </div>
                  <div style={infoBoxStyle}>
                    <div style={infoLabelStyle}>Current Members</div>
                    <div style={infoValStyle}>{selectedLead.currentMemberRange || '—'}</div>
                  </div>
                  <div style={infoBoxStyle}>
                    <div style={infoLabelStyle}>Interested Service</div>
                    <div style={infoValStyle}>{selectedLead.serviceInterest}</div>
                  </div>
                  <div style={infoBoxStyle}>
                    <div style={infoLabelStyle}>Interested Plan</div>
                    <div style={infoValStyle}>{selectedLead.planInterest || 'Standard'}</div>
                  </div>
                </>
              )}

              <div style={infoBoxStyle}>
                <div style={infoLabelStyle}>Submission Source</div>
                <div style={infoValStyle}>{selectedLead.source || 'Website Form'}</div>
              </div>

              <div style={infoBoxStyle}>
                <div style={infoLabelStyle}>Referral Code</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
                  <input
                    defaultValue={selectedLead.referralCode || ''}
                    placeholder="e.g. FK-VIKRAM"
                    onBlur={(e) => handleUpdateLeadReferralCode(selectedLead.id, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 6,
                      border: '1px solid #D1D5DB',
                      fontSize: 13,
                      fontWeight: 600,
                      width: 140,
                    }}
                  />
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>Auto-saves</span>
                </div>
              </div>

              {selectedLead.preferredTime && selectedLead.type !== 'CONTACT_QUERY' && (
                <div style={infoBoxStyle}>
                  <div style={infoLabelStyle}>Preferred Call Time</div>
                  <div style={infoValStyle}>{selectedLead.preferredTime}</div>
                </div>
              )}
            </div>

            {/* Onboarding requirements text for Demo Leads */}
            {selectedLead.type !== 'CONTACT_QUERY' && selectedLead.onboardingInformation && (
              <div style={{ background: '#F8FAF9', border: '1px solid #EFEFEF', borderRadius: 14, padding: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#6F767E', textTransform: 'uppercase', marginBottom: 6 }}>
                  Requirements &amp; Notes from Gym Owner:
                </div>
                <div style={{ fontSize: 14, color: '#1A1D1F', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {selectedLead.onboardingInformation}
                </div>
              </div>
            )}

            {/* Internal Founder Notes */}
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#1A1D1F' }}>
                  Founder Private Notes &amp; Activity Log
                </label>
              </div>
              <textarea
                rows={3}
                placeholder="Add notes from your conversation or follow-up status..."
                defaultValue={selectedLead.internalNotes || ''}
                onBlur={(e) => handleSaveNotes(selectedLead.id, e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 12,
                  border: '1.5px solid #E5E7EB',
                  fontSize: 14,
                  background: '#FAFAFA',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>Notes auto-save when clicking outside the box.</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD REFERRAL CODE MODAL ───────────────────────────── */}
      {showAddReferralModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'grid',
            placeItems: 'center',
            padding: 16,
            zIndex: 300,
          }}
          onClick={() => setShowAddReferralModal(false)}
        >
          <div
            className="p-5 sm:p-7"
            style={{
              width: '100%',
              maxWidth: 520,
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#FFFFFF',
              borderRadius: 24,
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              border: '1px solid #EFEFEF',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEF3C7', color: '#D97706', display: 'grid', placeItems: 'center' }}>
                  <Gift size={20} />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#1A1D1F' }}>
                  Generate Referral Code
                </h2>
              </div>
              <button
                onClick={() => setShowAddReferralModal(false)}
                style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'grid', placeItems: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#6F767E', marginBottom: 18, lineHeight: 1.5 }}>
              Standardized referral code will follow the <strong>FK-NAME</strong> format.
            </p>

            <form onSubmit={handleCreateReferralCode} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1D1F', marginBottom: 6 }}>
                  Friend / Partner Name *
                </label>
                <input
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={newReferralForm.referrerName}
                  onChange={(e) => handleReferrerNameChange(e.target.value)}
                  style={formInputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1D1F', marginBottom: 6 }}>
                  Standardized Referral Code * (Auto-formatted)
                </label>
                <input
                  required
                  placeholder="e.g. FK-VIKRAM"
                  value={newReferralForm.code}
                  onChange={(e) => setNewReferralForm({ ...newReferralForm, code: e.target.value.toUpperCase() })}
                  style={{
                    ...formInputStyle,
                    fontWeight: 700,
                    color: '#92400E',
                    background: '#FEF3C7',
                    border: '1.5px solid #FCD34D',
                    letterSpacing: '0.04em',
                  }}
                />
                <span style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4, display: 'block' }}>
                  Example link: <code>fitkalp.com/register?ref={newReferralForm.code || 'FK-NAME'}</code>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1D1F', marginBottom: 6 }}>
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    placeholder="+91 94100 04994"
                    value={newReferralForm.referrerPhone}
                    onChange={(e) => setNewReferralForm({ ...newReferralForm, referrerPhone: e.target.value })}
                    style={formInputStyle}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1D1F', marginBottom: 6 }}>
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="vikram@gym.com"
                    value={newReferralForm.referrerEmail}
                    onChange={(e) => setNewReferralForm({ ...newReferralForm, referrerEmail: e.target.value })}
                    style={formInputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1D1F', marginBottom: 6 }}>
                  Internal Notes / Relation
                </label>
                <input
                  placeholder="e.g. Head Coach at Gold's Gym Bandra / College friend"
                  value={newReferralForm.notes}
                  onChange={(e) => setNewReferralForm({ ...newReferralForm, notes: e.target.value })}
                  style={formInputStyle}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: '13px',
                  marginTop: 6,
                  background: '#B45309',
                  boxShadow: '0 4px 14px rgba(180,83,9,0.3)',
                  fontWeight: 700,
                  fontSize: 15,
                  justifyContent: 'center',
                }}
              >
                Save &amp; Generate Referral Link →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── ADD MANUAL ENTRY MODAL ─────────────────────────────── */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'grid',
            placeItems: 'center',
            padding: 16,
            zIndex: 300,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="p-5 sm:p-7"
            style={{
              width: '100%',
              maxWidth: 560,
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#FFFFFF',
              borderRadius: 24,
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              border: '1px solid #EFEFEF',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Add Offline Entry</h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'grid', placeItems: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Type selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              <button
                type="button"
                onClick={() => setNewLeadType('DEMO_LEAD')}
                style={{
                  padding: '10px',
                  borderRadius: 12,
                  border: newLeadType === 'DEMO_LEAD' ? '2px solid #2B9361' : '1px solid #E5E7EB',
                  background: newLeadType === 'DEMO_LEAD' ? '#E9F4EE' : '#FAFAFA',
                  color: newLeadType === 'DEMO_LEAD' ? '#2B9361' : '#6F767E',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Sparkles size={14} /> 🎯 Gym Demo Lead
              </button>
              <button
                type="button"
                onClick={() => setNewLeadType('CONTACT_QUERY')}
                style={{
                  padding: '10px',
                  borderRadius: 12,
                  border: newLeadType === 'CONTACT_QUERY' ? '2px solid #2563EB' : '1px solid #E5E7EB',
                  background: newLeadType === 'CONTACT_QUERY' ? '#EFF6FF' : '#FAFAFA',
                  color: newLeadType === 'CONTACT_QUERY' ? '#2563EB' : '#6F767E',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Mail size={14} /> ✉️ Contact Query
              </button>
            </div>

            <form onSubmit={handleAddManualLead} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Contact Name *"
                  value={newLeadForm.contactName || ''}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, contactName: e.target.value })}
                  style={formInputStyle}
                />
                <input
                  placeholder={newLeadType === 'DEMO_LEAD' ? 'Gym / Studio Name *' : 'Organization / Gym (Optional)'}
                  required={newLeadType === 'DEMO_LEAD'}
                  value={newLeadForm.gymName || ''}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, gymName: e.target.value })}
                  style={formInputStyle}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Phone / WhatsApp *"
                  value={newLeadForm.phone || ''}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                  style={formInputStyle}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newLeadForm.email || ''}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  style={formInputStyle}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  placeholder="City (e.g. Mumbai)"
                  value={newLeadForm.city || ''}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                  style={formInputStyle}
                />
                <input
                  placeholder="Referral Code (e.g. FK-VIKRAM)"
                  value={newLeadForm.referralCode || ''}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, referralCode: e.target.value.toUpperCase() })}
                  style={formInputStyle}
                />
              </div>

              {newLeadType === 'DEMO_LEAD' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={newLeadForm.serviceInterest || 'CRM'}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, serviceInterest: e.target.value })}
                    style={formInputStyle}
                  >
                    <option value="CRM">FitKalp Gym CRM</option>
                    <option value="WEBSITE">Custom Gym Website</option>
                    <option value="BOTH">Complete Bundle (CRM + Web)</option>
                  </select>
                  <select
                    value={newLeadForm.planInterest || 'Growth'}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, planInterest: e.target.value })}
                    style={formInputStyle}
                  >
                    <option value="Starter">Starter (₹599)</option>
                    <option value="Growth">Growth (₹1,000)</option>
                    <option value="Scale">Scale (₹1,299)</option>
                    <option value="Website Design">Website Design (₹15,000)</option>
                  </select>
                </div>
              )}

              <textarea
                placeholder={
                  newLeadType === 'DEMO_LEAD'
                    ? 'Gym requirements / prospect challenges...'
                    : 'Message / inquiry text...'
                }
                rows={3}
                value={newLeadForm.onboardingInformation || ''}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, onboardingInformation: e.target.value })}
                style={{ ...formInputStyle, resize: 'vertical' }}
              />

              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: '13px',
                  marginTop: 6,
                  background: newLeadType === 'DEMO_LEAD' ? '#2B9361' : '#2563EB',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                Save {newLeadType === 'DEMO_LEAD' ? 'Gym Lead' : 'Contact Query'} →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const loginLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 13,
  fontWeight: 600,
  color: '#1A1D1F',
  marginBottom: 6,
};

function loginInputStyle(isLocked: boolean): React.CSSProperties {
  return {
    width: '100%',
    padding: '13px 44px 13px 14px',
    borderRadius: 14,
    border: '1.5px solid #E5E7EB',
    fontSize: 16,
    background: isLocked ? '#F3F4F6' : '#FAFAFA',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };
}

const eyeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  right: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#6F767E',
  padding: 6,
  display: 'flex',
  alignItems: 'center',
};

const statCardStyle: React.CSSProperties = {
  background: '#FFFFFF',
  borderRadius: 20,
  padding: '20px 22px',
  border: '1px solid #EFEFEF',
  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
};

const infoBoxStyle: React.CSSProperties = {
  background: '#FAFAFA',
  borderRadius: 12,
  padding: '12px 14px',
  border: '1px solid #EFEFEF',
};

const infoLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#6F767E',
  textTransform: 'uppercase',
  marginBottom: 4,
};

const infoValStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#1A1D1F',
};

const formInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 10,
  border: '1.5px solid #E5E7EB',
  fontSize: 14,
  background: '#FAFAFA',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

