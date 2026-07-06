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
