import type {
  AuthSuccessResponse,
  InviteResponse,
  ListAdminsResponse,
  LoginResponse,
  MfaSetupResponse,
  User,
} from "@/app/admin/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("admin_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as { error?: string };
      throw new Error(errorData.error || `Erreur ${response.status}`);
    }

    return data as T;
  }

  login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  inviteAdmin(email: string, username: string): Promise<InviteResponse> {
    return this.request<InviteResponse>(
      "/admin/invite",
      {
        method: "POST",
        body: JSON.stringify({ email, username }),
      }
    );
  }

  checkPending(email: string): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(
      "/admin/check-pending",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      }
    );
  }

  setPassword(email: string, password: string): Promise<MfaSetupResponse> {
    return this.request<MfaSetupResponse>(
      "/admin/set-password",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
  }

  confirmMfaSetup(mfaToken: string, code: string): Promise<AuthSuccessResponse> {
    return this.request<AuthSuccessResponse>("/admin/mfa/confirm-setup", {
      method: "POST",
      body: JSON.stringify({ mfaToken, code }),
    });
  }

  verifyMfa(mfaToken: string, code: string): Promise<AuthSuccessResponse> {
    return this.request<AuthSuccessResponse>("/admin/mfa/verify", {
      method: "POST",
      body: JSON.stringify({ mfaToken, code }),
    });
  }

  getAllAdmins(): Promise<ListAdminsResponse> {
    return this.request<ListAdminsResponse>(
      "/admin"
    );
  }

  deactivateAdmin(id: number): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(
      `/admin/${id}/deactivate`,
      { method: "DELETE" }
    );
  }

  deleteAdmin(id: number) {
    return this.request<{ message: string }>(
      `/admin/${id}`,
      { method: "DELETE" }
    );
  }

  getProfile(): Promise<{ user: User & { user_type: { id: number; type: string } } }> {
    return this.request<{ user: User & { user_type: { id: number; type: string } } }>(
      "/admin/me"
    );
  }
}

export const api = new ApiClient(API_BASE);
