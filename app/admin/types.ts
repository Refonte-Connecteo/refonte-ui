export interface User {
  id: number;
  email: string;
  username: string;
  user_type_id: number;
  is_active: boolean;
  mfa_enabled: boolean;
  created_at: string;
  user_type?: {
    id: number;
    type: string;
  };
}

export interface AuthSuccessResponse {
  message: string;
  user: User;
  token: string;
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
