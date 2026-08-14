export interface User {
  id: number;
  email: string;
  username: string;
  user_type_id: number;
  is_active: boolean;
  mfa_enabled: boolean;
  created_at: string;
  last_login_at?: string | null;
  user_type?: {
    id: number;
    type: string;
  };
}

export interface AuthSuccessResponse {
  message: string;
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshResponse {
  token: string;
  refreshToken: string;
}

export interface LogoutResponse {
  message: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface DisableMfaResponse {
  message: string;
  user: User;
}

export interface MfaSetupResponse {
  message: string;
  requireMfaSetup: true;
  mfaToken: string;
  userId: number;
  email: string;
  otpauthUrl: string;
  qrCodeDataUrl: string;
}

export interface MfaChallengeResponse {
  message: string;
  requireMfa: true;
  mfaToken: string;
  userId: number;
}

export type LoginResponse = MfaChallengeResponse | MfaSetupResponse | AuthSuccessResponse;

export interface InviteResponse {
  message: string;
  user: User;
  invitation_token: string;
  invitation_token_expires: string;
}

export interface SetPasswordResponse {
  message: string;
  user: User;
}

export interface ListAdminsResponse {
  users: User[];
}

// --- Analytics (dashboard) ---
export interface DailyPoint {
  date: string;
  views: number;
  visitors: number;
}

export interface TopPath {
  path: string;
  views: number;
  visitors: number;
}

export interface TopReferrer {
  referrer: string;
  views: number;
}

export interface DeviceStat {
  device: string;
  views: number;
}

export interface AnalyticsSummary {
  rangeDays: number;
  totalViews: number;
  uniqueVisitors: number;
  viewsPerDay: number;
  dailySeries: DailyPoint[];
  topPages: TopPath[];
  topReferrers: TopReferrer[];
  deviceBreakdown: DeviceStat[];
  counts: {
    applications: number;
    spontaneousApplications: number;
    contactMessages: number;
    unreadContactMessages: number;
  };
}

export interface AnalyticsSummaryResponse {
  summary: AnalyticsSummary;
}

// --- AuditLog ---
export interface AuditLog {
  id: number;
  event_type: string;
  action: string;
  actor_user_id: number | null;
  actor_email: string | null;
  resource_type: string | null;
  resource_id: string | null;
  success: boolean;
  status_code: number | null;
  error_code: string | null;
  ip: string | null;
  user_agent: string | null;
  request_id: string | null;
  method: string | null;
  route: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface AuditLogPage {
  logs: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  error: string;
}

// --- CeoMessage ---
export interface CeoMessage {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  updated_at: string;
}

// --- HeroSlide ---
export interface HeroSlide {
  id: number;
  image_url: string;
  title: string | null;
  description: string | null;
  cta_label: string | null;
  cta_url: string | null;
  position: number;
  is_active: boolean;
}

// --- KpiStat ---
export interface KpiStat {
  id: number;
  label: string;
  value: string;
  unit: string | null;
  position: number;
  is_active: boolean;
}

// --- Reference ---
export interface Reference {
  id: number;
  label: string;
  image_url: string;
  website_url: string | null;
  position: number;
  is_active: boolean;
}

// --- Catalogue ---
export interface Catalogue {
  id: number;
  title: string;
  file_url: string;
  is_lead_magnet: boolean;
  uploaded_at: string;
}

// --- JobPosting ---
export interface JobPosting {
  id: number;
  title: string;
  contract_type: string;
  description: string | null;
  external_url: string | null;
  fiche_url: string | null;
  is_active: boolean;
  created_at: string;
  applications?: Application[];
}

// --- Application ---
export interface Application {
  id: number;
  job_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  cv_url: string;
  cover_letter: string | null;
  submitted_at: string;
  job_posting?: JobPosting;
}

// --- SpontaneousApplication ---
export interface SpontaneousApplication {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  cv_url: string;
  motivation: string | null;
  submitted_at: string;
}

// --- Article ---
export interface Article {
  id: number;
  title: string;
  description: string | null;
  type: string | null;
  cover_url: string | null;
  file_url: string | null;
  is_lead_magnet: boolean;
  is_published: boolean;
  published_at: string | null;
}

// --- Event ---
export interface Event {
  id: number;
  title: string;
  description: string | null;
  event_date: string;
  youtube_url: string | null;
  is_published: boolean;
  event_images?: EventImage[];
}

// --- EventImage ---
export interface EventImage {
  id: number;
  event_id: number;
  image_url: string;
  caption: string | null;
  position: number;
  event?: Event;
}

// --- ContactMessage ---
export interface ContactMessage {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string | null;
  message: string;
  is_read: boolean;
  submitted_at: string;
}
