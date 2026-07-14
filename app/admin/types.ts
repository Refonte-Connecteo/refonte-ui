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
