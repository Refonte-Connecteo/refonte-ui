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

  login(email: string, password: string) {
    return this.request<{
      message: string;
      user: { id: number; email: string; username: string; user_type_id: number; is_active: boolean; created_at: string };
      token: string;
    }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  inviteAdmin(email: string, username: string) {
    return this.request<{ message: string; user: { id: number; email: string; username: string; user_type_id: number; is_active: boolean; created_at: string } }>(
      "/admin/invite",
      {
        method: "POST",
        body: JSON.stringify({ email, username }),
      }
    );
  }

  setPassword(token: string, password: string) {
    return this.request<{ message: string; user: { id: number; email: string; username: string; user_type_id: number; is_active: boolean; created_at: string } }>(
      "/admin/set-password",
      {
        method: "POST",
        body: JSON.stringify({ token, password }),
      }
    );
  }

  getAllAdmins() {
    return this.request<{ users: { id: number; email: string; username: string; user_type_id: number; is_active: boolean; created_at: string }[] }>(
      "/admin"
    );
  }

  deactivateAdmin(id: number) {
    return this.request<{ message: string; user: { id: number; email: string; username: string; user_type_id: number; is_active: boolean; created_at: string } }>(
      `/admin/${id}`,
      { method: "DELETE" }
    );
  }

  getProfile() {
    return this.request<{ user: { id: number; email: string; username: string; user_type_id: number; is_active: boolean; created_at: string; user_type: { id: number; type: string } } }>(
      "/admin/me"
    );
  }
}

export const api = new ApiClient(API_BASE);
