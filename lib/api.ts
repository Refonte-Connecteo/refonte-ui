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
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

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

  checkPending(email: string) {
    return this.request<{ message: string; user: { id: number; email: string; username: string; user_type_id: number; is_active: boolean; created_at: string } }>(
      "/admin/check-pending",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      }
    );
  }

  setPassword(email: string, password: string) {
    return this.request<{ message: string; user: { id: number; email: string; username: string; user_type_id: number; is_active: boolean; created_at: string } }>(
      "/admin/set-password",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
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

  getProfile() {
    return this.request<{ user: { id: number; email: string; username: string; user_type_id: number; is_active: boolean; created_at: string; user_type: { id: number; type: string } } }>(
      "/admin/me"
    );
  }

  // --- CeoMessage ---
  getAllCeoMessages() {
    return this.request<{ messages: { id: number; title: string; description: string; image_url: string | null; updated_at: string }[] }>("/ceomessage");
  }

  getCeoMessage(id: number) {
    return this.request<{ message: { id: number; title: string; description: string; image_url: string | null; updated_at: string } }>(`/ceomessage/${id}`);
  }

  createCeoMessage(data: { title: string; description: string; image_url?: string }) {
    return this.request<{ message: string; data: { id: number; title: string; description: string; image_url: string | null; updated_at: string } }>("/ceomessage", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateCeoMessage(id: number, data: { title?: string; description?: string; image_url?: string }) {
    return this.request<{ message: string; data: { id: number; title: string; description: string; image_url: string | null; updated_at: string } }>(`/ceomessage/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteCeoMessage(id: number) {
    return this.request<{ message: string }>(`/ceomessage/${id}`, { method: "DELETE" });
  }

  // --- HeroSlide ---
  getAllHeroSlides() {
    return this.request<{ slides: { id: number; image_url: string; title: string | null; description: string | null; cta_label: string | null; cta_url: string | null; position: number; is_active: boolean }[] }>("/hero-slide");
  }

  getHeroSlide(id: number) {
    return this.request<{ slide: { id: number; image_url: string; title: string | null; description: string | null; cta_label: string | null; cta_url: string | null; position: number; is_active: boolean } }>(`/hero-slide/${id}`);
  }

  createHeroSlide(data: { image_url: string; title?: string; description?: string; cta_label?: string; cta_url?: string; position?: number; is_active?: boolean }) {
    return this.request<{ message: string; slide: { id: number; image_url: string; title: string | null; description: string | null; cta_label: string | null; cta_url: string | null; position: number; is_active: boolean } }>("/hero-slide", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateHeroSlide(id: number, data: { image_url?: string; title?: string; description?: string; cta_label?: string; cta_url?: string; position?: number; is_active?: boolean }) {
    return this.request<{ message: string; slide: { id: number; image_url: string; title: string | null; description: string | null; cta_label: string | null; cta_url: string | null; position: number; is_active: boolean } }>(`/hero-slide/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteHeroSlide(id: number) {
    return this.request<{ message: string }>(`/hero-slide/${id}`, { method: "DELETE" });
  }

  // --- KpiStat ---
  getAllKpiStats() {
    return this.request<{ stats: { id: number; label: string; value: string; unit: string | null; position: number; is_active: boolean }[] }>("/kpistat");
  }

  getKpiStat(id: number) {
    return this.request<{ stat: { id: number; label: string; value: string; unit: string | null; position: number; is_active: boolean } }>(`/kpistat/${id}`);
  }

  createKpiStat(data: { label: string; value: string; unit?: string; position?: number; is_active?: boolean }) {
    return this.request<{ message: string; stat: { id: number; label: string; value: string; unit: string | null; position: number; is_active: boolean } }>("/kpistat", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateKpiStat(id: number, data: { label?: string; value?: string; unit?: string; position?: number; is_active?: boolean }) {
    return this.request<{ message: string; stat: { id: number; label: string; value: string; unit: string | null; position: number; is_active: boolean } }>(`/kpistat/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteKpiStat(id: number) {
    return this.request<{ message: string }>(`/kpistat/${id}`, { method: "DELETE" });
  }

  // --- File upload ---
  uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.request<{ url: string; filename: string }>("/upload", {
      method: "POST",
      body: formData,
    });
  }
}

export const api = new ApiClient(API_BASE);
