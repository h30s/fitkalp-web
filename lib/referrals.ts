import fs from 'fs';
import path from 'path';
import { getAllLeads } from './leads';

export interface ReferralCode {
  id: string;
  code: string; // e.g. "FK-VIKRAM"
  referrerName: string; // e.g. "Vikram Sharma"
  referrerPhone?: string;
  referrerEmail?: string;
  notes?: string; // e.g. "College friend / Gym trainer at Golds"
  rewardNotes?: string; // e.g. "₹1,000 voucher on closing"
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface ReferralCodeWithStats extends ReferralCode {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  demoLeads: number;
  convertedLeads: number;
  conversionRate: number;
  lastReferralDate: string | null;
  referredGyms: string[];
}

function getReferralsFilePath(): string {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch {
      const tmpDir = '/tmp/fitkalp_data';
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
      return path.join(tmpDir, 'referral_codes.json');
    }
  }
  return path.join(dataDir, 'referral_codes.json');
}

/**
 * Standardize any user-entered or generated code into "FK-SLUG" format.
 * Examples:
 *  "vikram" -> "FK-VIKRAM"
 *  "fk-vikram" -> "FK-VIKRAM"
 *  "FK VIKRAM" -> "FK-VIKRAM"
 *  "Vikram Sharma" -> "FK-VIKRAM"
 */
export function normalizeReferralCode(raw: string): string {
  if (!raw) return '';
  let clean = raw.trim().toUpperCase();

  // Remove leading FK- or FK_ or FK space if present
  clean = clean.replace(/^FK[\s\-_:]+/, '');

  // Keep alphanumeric and replace multiple spaces/underscores with hyphen
  clean = clean.replace(/[^A-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  if (!clean) return '';
  return `FK-${clean}`;
}

/**
 * Generate a clean standard code from a person's name
 */
export function generateStandardCode(referrerName: string): string {
  const firstName = referrerName.trim().split(/\s+/)[0] || 'PARTNER';
  const baseSlug = firstName.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const existing = getAllReferralCodes();

  let candidate = `FK-${baseSlug}`;
  let counter = 1;

  while (existing.some((r) => r.code === candidate)) {
    counter++;
    candidate = `FK-${baseSlug}${counter}`;
  }

  return candidate;
}

export function getAllReferralCodes(): ReferralCode[] {
  try {
    const filePath = getReferralsFilePath();
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content.trim()) return [];
    const list: ReferralCode[] = JSON.parse(content);
    return Array.isArray(list) ? list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
  } catch (error) {
    console.error('[referrals] Failed to read referral codes:', error);
    return [];
  }
}

export function saveAllReferralCodes(codes: ReferralCode[]): boolean {
  try {
    const filePath = getReferralsFilePath();
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(codes, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (error) {
    console.error('[referrals] Failed to save referral codes:', error);
    return false;
  }
}

export function createReferralCode(data: {
  referrerName: string;
  code?: string;
  referrerPhone?: string;
  referrerEmail?: string;
  notes?: string;
  rewardNotes?: string;
}): ReferralCode {
  const all = getAllReferralCodes();
  const now = new Date().toISOString();
  const name = (data.referrerName || 'Partner').trim();

  // Normalize or generate code
  let code = data.code ? normalizeReferralCode(data.code) : generateStandardCode(name);
  if (!code) code = generateStandardCode(name);

  // Ensure unique code
  if (all.some((r) => r.code === code)) {
    code = `${code}${Math.floor(10 + Math.random() * 90)}`;
  }

  const id = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newRef: ReferralCode = {
    id,
    code,
    referrerName: name,
    referrerPhone: data.referrerPhone?.trim() || '',
    referrerEmail: data.referrerEmail?.trim().toLowerCase() || '',
    notes: data.notes?.trim() || '',
    rewardNotes: data.rewardNotes?.trim() || '',
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  };

  all.unshift(newRef);
  saveAllReferralCodes(all);
  return newRef;
}

export function updateReferralCode(id: string, updates: Partial<ReferralCode>): ReferralCode | null {
  const all = getAllReferralCodes();
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = all[index];
  const newCode = updates.code ? normalizeReferralCode(updates.code) : current.code;

  const updated: ReferralCode = {
    ...current,
    ...updates,
    code: newCode,
    updatedAt: new Date().toISOString(),
  };

  all[index] = updated;
  saveAllReferralCodes(all);
  return updated;
}

export function deleteReferralCode(id: string): boolean {
  const all = getAllReferralCodes();
  const filtered = all.filter((r) => r.id !== id);
  if (filtered.length === all.length) return false;
  saveAllReferralCodes(filtered);
  return true;
}

/**
 * Validate a referral code against the active referral database.
 * Matches exact standardized code (e.g. "FK-VIKRAM") or normalized variants.
 */
export function validateReferralCode(rawCode: string): { valid: boolean; code?: string; referrerName?: string; error?: string } {
  if (!rawCode || !rawCode.trim()) {
    return { valid: false, error: 'Empty code' };
  }

  const normalized = normalizeReferralCode(rawCode);
  const all = getAllReferralCodes();

  // Find active matching referral code
  const match = all.find((r) => r.status === 'ACTIVE' && (r.code === normalized || normalizeReferralCode(r.code) === normalized));

  if (!match) {
    return { valid: false, error: 'Invalid or inactive referral code' };
  }

  return {
    valid: true,
    code: match.code,
    referrerName: match.referrerName,
  };
}

/**
 * Compute real-time analytics for all referral codes
 */
export function getReferralCodesWithStats(): ReferralCodeWithStats[] {
  const codes = getAllReferralCodes();
  const leads = getAllLeads();

  return codes.map((ref) => {
    const refNormalized = normalizeReferralCode(ref.code);
    const matchedLeads = leads.filter((l) => {
      if (!l.referralCode) return false;
      return normalizeReferralCode(l.referralCode) === refNormalized;
    });

    const totalLeads = matchedLeads.length;
    let newLeads = 0;
    let contactedLeads = 0;
    let demoLeads = 0;
    let convertedLeads = 0;
    let lastDate: string | null = null;
    const gymNames = new Set<string>();

    for (const lead of matchedLeads) {
      if (lead.status === 'NEW') newLeads++;
      else if (lead.status === 'CONTACTED') contactedLeads++;
      else if (lead.status === 'DEMO_SCHEDULED' || lead.status === 'TRIAL_ACTIVE') demoLeads++;
      else if (lead.status === 'CONVERTED') convertedLeads++;

      if (lead.gymName) gymNames.add(lead.gymName);

      if (!lastDate || new Date(lead.createdAt) > new Date(lastDate)) {
        lastDate = lead.createdAt;
      }
    }

    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    return {
      ...ref,
      totalLeads,
      newLeads,
      contactedLeads,
      demoLeads,
      convertedLeads,
      conversionRate,
      lastReferralDate: lastDate,
      referredGyms: Array.from(gymNames),
    };
  });
}
