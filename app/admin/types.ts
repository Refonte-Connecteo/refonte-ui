export interface User {
  id: number;
  email: string;
  username: string;
  user_type_id: number;
  is_active: boolean;
  created_at: string;
  user_type?: {
    id: number;
    type: string;
  };
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface InviteResponse {
  message: string;
  user: User;
}

export interface SetPasswordResponse {
  message: string;
  user: User;
}

export interface ListAdminsResponse {
  users: User[];
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
