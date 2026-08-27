import fs from 'fs';
import path from 'path';

export type LeadType = 'DEMO_LEAD' | 'CONTACT_QUERY';

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'DEMO_SCHEDULED'
  | 'TRIAL_ACTIVE'
  | 'CONVERTED'
  | 'NOT_INTERESTED'
  | 'ARCHIVED'
  | 'REPLIED'
  | 'SPAM_COMPETITOR';

export interface Lead {
  id: string;
  type: LeadType; // 'DEMO_LEAD' (Gym Demo / Registration Lead) vs 'CONTACT_QUERY' (General Contact Us Message)
  createdAt: string;
  updatedAt: string;
  contactName: string;
  contactRole?: string;
  email: string;
  phone: string;
  gymName: string;
  businessType?: string;
  address?: string;
  city: string;
  state?: string;
  postalCode?: string;
  websiteUrl?: string;
  currentMemberRange?: string;
  serviceInterest: string;
  planInterest?: string;
  onboardingInformation?: string;
  preferredTime?: string;
  source?: string;
  referralCode?: string;
  intent?: string;
  status: LeadStatus;
  internalNotes?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface LeadStats {
  total: number;
  demoLeadsCount: number;
  contactQueriesCount: number;
  newLeads: number;
  newDemoLeads: number;
  newContactQueries: number;
  contacted: number;
  demoScheduled: number;
  converted: number;
  todayCount: number;
  todayDemoLeads: number;
  todayContactQueries: number;
  thisWeekCount: number;
  byService: Record<string, number>;
  byPlan: Record<string, number>;
  totalReferrals: number;
}

export interface ReferralLeader {
  referralCode: string;
  totalLeads: number;
  convertedLeads: number;
  demoLeads: number;
  conversionRate: number;
  lastReferralDate: string;
  gymNames: string[];
}

// Storage path: in project data directory with fallback
function getDataFilePath(): string {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch {
      // Fallback for environments with restricted cwd
      const tmpDir = '/tmp/fitkalp_data';
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
      return path.join(tmpDir, 'leads.json');
    }
  }
  return path.join(dataDir, 'leads.json');
}

export function getAllLeads(): Lead[] {
  try {
    const filePath = getDataFilePath();
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content.trim()) return [];
    const leads: Lead[] = JSON.parse(content);
    if (!Array.isArray(leads)) return [];

    // Normalize any legacy leads missing the 'type' field
    const normalized = leads.map((l) => {
      if (!l.type) {
        const isContact =
          l.intent === 'contact' ||
          l.serviceInterest === 'CONTACT' ||
          (l.source && l.source.toLowerCase().includes('contact'));
        return { ...l, type: isContact ? ('CONTACT_QUERY' as LeadType) : ('DEMO_LEAD' as LeadType) };
      }
      return l;
    });

    return normalized.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('[leads] Failed to read leads:', error);
    return [];
  }
}

export function saveAllLeads(leads: Lead[]): boolean {
  try {
    const filePath = getDataFilePath();
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(leads, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (error) {
    console.error('[leads] Failed to write leads:', error);
    return false;
  }
}

export function createLead(data: Partial<Lead>): Lead {
  const all = getAllLeads();
  const now = new Date().toISOString();
  const id = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Determine type: Demo / Registration Lead vs General Contact Us Query
  let inferredType: LeadType = data.type || 'DEMO_LEAD';
  if (!data.type) {
    if (
      data.intent === 'contact' ||
      data.serviceInterest === 'CONTACT' ||
      (data.source && data.source.toLowerCase().includes('contact'))
    ) {
      inferredType = 'CONTACT_QUERY';
    } else {
      inferredType = 'DEMO_LEAD';
    }
  }

  const isContactQuery = inferredType === 'CONTACT_QUERY';

  const newLead: Lead = {
    id,
    type: inferredType,
    createdAt: now,
    updatedAt: now,
    contactName: (data.contactName || (isContactQuery ? 'Anonymous Sender' : 'Gym Owner')).trim(),
    contactRole: isContactQuery
      ? (data.contactRole?.trim() || 'General Inquirer')
      : (data.contactRole?.trim() || 'Owner / Manager'),
    email: (data.email || '').trim().toLowerCase(),
    phone: (data.phone || '').trim(),
    gymName: (data.gymName || (isContactQuery ? 'General Inquiry' : 'Fitness Studio')).trim(),
    businessType: data.businessType?.trim() || (isContactQuery ? 'General Inquiry' : 'Gym / Fitness Studio'),
    address: data.address?.trim() || '',
    city: (data.city || (isContactQuery ? 'India' : 'India')).trim(),
    state: data.state?.trim() || '',
    postalCode: data.postalCode?.trim() || '',
    websiteUrl: data.websiteUrl?.trim() || '',
    currentMemberRange: data.currentMemberRange || (isContactQuery ? '—' : '50–150'),
    serviceInterest: data.serviceInterest || (isContactQuery ? 'General Contact' : 'CRM'),
    planInterest: data.planInterest || '',
    onboardingInformation: data.onboardingInformation?.trim() || '',
    preferredTime: data.preferredTime?.trim() || 'Flexible',
    source: data.source?.trim() || (isContactQuery ? 'Contact Page Form' : 'Website Landing Page'),
    referralCode: (data.referralCode || '').trim().toUpperCase(),
    intent: data.intent?.trim() || (isContactQuery ? 'contact' : 'demo'),
    status: data.status || 'NEW',
    internalNotes: data.internalNotes || '',
    ipAddress: data.ipAddress || '',
    userAgent: data.userAgent || '',
  };

  all.unshift(newLead);
  saveAllLeads(all);
  return newLead;
}

export function updateLead(id: string, updates: Partial<Lead>): Lead | null {
  const all = getAllLeads();
  const index = all.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const current = all[index];
  const updated: Lead = {
    ...current,
    ...updates,
    referralCode: updates.referralCode !== undefined ? updates.referralCode.trim().toUpperCase() : current.referralCode,
    updatedAt: new Date().toISOString(),
  };

  all[index] = updated;
  saveAllLeads(all);
  return updated;
}

export function deleteLead(id: string): boolean {
  const all = getAllLeads();
  const filtered = all.filter((l) => l.id !== id);
  if (filtered.length === all.length) return false;
  saveAllLeads(filtered);
  return true;
}

export function getLeadStats(): LeadStats {
  const leads = getAllLeads();
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const stats: LeadStats = {
    total: leads.length,
    demoLeadsCount: 0,
    contactQueriesCount: 0,
    newLeads: 0,
    newDemoLeads: 0,
    newContactQueries: 0,
    contacted: 0,
    demoScheduled: 0,
    converted: 0,
    todayCount: 0,
    todayDemoLeads: 0,
    todayContactQueries: 0,
    thisWeekCount: 0,
    byService: {},
    byPlan: {},
    totalReferrals: 0,
  };

  for (const lead of leads) {
    const isDemo = lead.type === 'DEMO_LEAD' || (!lead.type && lead.intent !== 'contact');
    const isContact = lead.type === 'CONTACT_QUERY' || (!lead.type && lead.intent === 'contact');

    if (isDemo) stats.demoLeadsCount++;
    if (isContact) stats.contactQueriesCount++;

    if (lead.status === 'NEW') {
      stats.newLeads++;
      if (isDemo) stats.newDemoLeads++;
      if (isContact) stats.newContactQueries++;
    } else if (lead.status === 'CONTACTED' || lead.status === 'REPLIED') {
      stats.contacted++;
    } else if (lead.status === 'DEMO_SCHEDULED') {
      stats.demoScheduled++;
    } else if (lead.status === 'CONVERTED') {
      stats.converted++;
    }

    if (lead.referralCode) {
      stats.totalReferrals++;
    }

    const createdAt = new Date(lead.createdAt);
    if (lead.createdAt.startsWith(todayStr)) {
      stats.todayCount++;
      if (isDemo) stats.todayDemoLeads++;
      if (isContact) stats.todayContactQueries++;
    }
    if (createdAt >= sevenDaysAgo) {
      stats.thisWeekCount++;
    }

    const s = lead.serviceInterest || (isContact ? 'General Contact' : 'CRM');
    stats.byService[s] = (stats.byService[s] || 0) + 1;

    if (lead.planInterest) {
      stats.byPlan[lead.planInterest] = (stats.byPlan[lead.planInterest] || 0) + 1;
    }
  }

  return stats;
}

export function getReferralLeaderboard(): ReferralLeader[] {
  const leads = getAllLeads();
  const map = new Map<string, { total: number; converted: number; demo: number; latestDate: string; gyms: Set<string> }>();

  for (const lead of leads) {
    const code = (lead.referralCode || '').trim().toUpperCase();
    if (!code) continue;

    const existing = map.get(code) || { total: 0, converted: 0, demo: 0, latestDate: lead.createdAt, gyms: new Set() };
    existing.total++;
    if (lead.status === 'CONVERTED') existing.converted++;
    if (lead.status === 'DEMO_SCHEDULED' || lead.status === 'TRIAL_ACTIVE') existing.demo++;
    if (lead.gymName) existing.gyms.add(lead.gymName);
    if (new Date(lead.createdAt) > new Date(existing.latestDate)) {
      existing.latestDate = lead.createdAt;
    }
    map.set(code, existing);
  }

  const result: ReferralLeader[] = [];
  map.forEach((value, code) => {
    result.push({
      referralCode: code,
      totalLeads: value.total,
      convertedLeads: value.converted,
      demoLeads: value.demo,
      conversionRate: value.total > 0 ? Math.round((value.converted / value.total) * 100) : 0,
      lastReferralDate: value.latestDate,
      gymNames: Array.from(value.gyms),
    });
  });

  // Sort by converted desc, then total desc
  return result.sort((a, b) => b.convertedLeads - a.convertedLeads || b.totalLeads - a.totalLeads);
}

export function generateLeadsCsv(leads: Lead[]): string {
  const headers = [
    'ID',
    'Category / Type',
    'Date Submitted',
    'Status',
    'Contact Name',
    'Role',
    'Phone',
    'Email',
    'Gym / Business Name',
    'Business Type',
    'City',
    'State',
    'Current Members',
    'Service Interest',
    'Plan Interest',
    'Referral Code / Friend',
    'Intent',
    'Source',
    'Message / Requirements / Notes',
    'Internal Founder Notes',
  ];

  const rows = leads.map((l) => [
    l.id,
    l.type === 'CONTACT_QUERY' ? '"✉️ Contact Us Query"' : '"🎯 Demo / Gym Lead"',
    new Date(l.createdAt).toLocaleString('en-IN'),
    l.status,
    `"${(l.contactName || '').replace(/"/g, '""')}"`,
    `"${(l.contactRole || '').replace(/"/g, '""')}"`,
    `"${(l.phone || '').replace(/"/g, '""')}"`,
    `"${(l.email || '').replace(/"/g, '""')}"`,
    `"${(l.gymName || '').replace(/"/g, '""')}"`,
    `"${(l.businessType || '').replace(/"/g, '""')}"`,
    `"${(l.city || '').replace(/"/g, '""')}"`,
    `"${(l.state || '').replace(/"/g, '""')}"`,
    `"${(l.currentMemberRange || '').replace(/"/g, '""')}"`,
    `"${(l.serviceInterest || '').replace(/"/g, '""')}"`,
    `"${(l.planInterest || '').replace(/"/g, '""')}"`,
    `"${(l.referralCode || '').replace(/"/g, '""')}"`,
    `"${(l.intent || '').replace(/"/g, '""')}"`,
    `"${(l.source || '').replace(/"/g, '""')}"`,
    `"${(l.onboardingInformation || '').replace(/"/g, '""')}"`,
    `"${(l.internalNotes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
