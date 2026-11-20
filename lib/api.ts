import type {
  AccessResetResponse,
  RecoveryCodesResponse,
  AuthSuccessResponse,
  AuditLogPage,
  AnalyticsSummaryResponse,
  ChangePasswordResponse,
  DisableMfaResponse,
  ForceChangePasswordResponse,
  HeroPage,
  HeroSlide,
  InviteResponse,
  ListAdminsResponse,
  LoginResponse,
  LogoutResponse,
  MfaSetupResponse,
  RefreshResponse,
  User,
} from "@/app/admin/types";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  redirectToLogin,
  updateTokens,
} from "@/lib/session";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

type HeroSlideInput = Partial<Omit<HeroSlide, "id">>;

export class SessionExpiredError extends Error {
  constructor(message = "Session expirée") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

const AUTH_ENDPOINTS = [
  "/admin/login",
  "/admin/set-password",
  "/admin/check-pending",
  "/admin/mfa/",
  "/auth/refresh",
  "/auth/force-change-password",
];

class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private isAuthEndpoint(endpoint: string): boolean {
    return AUTH_ENDPOINTS.some((prefix) => endpoint.startsWith(prefix));
  }

  private async refreshAccessToken(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const data = (await response.json()) as RefreshResponse;

      if (!data.token || !data.refreshToken) return false;

      updateTokens(data.token, data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  private refreshAccessTokenShared(): Promise<boolean> {
    if (!this.refreshPromise) {
      this.refreshPromise = this.refreshAccessToken().finally(() => {
        this.refreshPromise = null;
      });
    }
    return this.refreshPromise;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retry = true
  ): Promise<T> {
    const token = getAccessToken();
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

    if (response.status === 401 && retry && token && !this.isAuthEndpoint(endpoint)) {
      const refreshed = await this.refreshAccessTokenShared();

      if (refreshed) {
        return this.request<T>(endpoint, options, false);
      }

      clearSession();
      redirectToLogin("expired");
      throw new SessionExpiredError();
    }

    // Le corps ne peut être lu qu'une fois ; une réponse vide ou non JSON donne {}.
    const data: unknown = await response.json().catch(() => ({}));

    if (response.status === 403 && (data as { forcePasswordChange?: boolean }).forcePasswordChange) {
      window.location.href = "/admin/force-change-password";
      throw new Error("Changement de mot de passe obligatoire");
    }

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

  inviteAdmin(email: string, username: string, userTypeId?: number): Promise<InviteResponse> {
    return this.request<InviteResponse>(
      "/admin/invite",
      {
        method: "POST",
        body: JSON.stringify({ email, username, userTypeId }),
      }
    );
  }

  setPassword(email: string, password: string, invitationToken: string): Promise<MfaSetupResponse> {
    return this.request<MfaSetupResponse>(
      "/admin/set-password",
      {
        method: "POST",
        body: JSON.stringify({ email, password, invitationToken }),
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

  /**
   * CV ou pièce jointe d'un visiteur (`/private/<nom>`) : jamais servi publiquement, téléchargé
   * avec le jeton de l'administrateur connecté (session renouvelée une fois si elle a expiré).
   */
  async getPrivateFile(ref: string): Promise<Blob> {
    const name = ref.replace(/^\/private\//, "");
    const download = () => {
      const token = getAccessToken();
      return fetch(`${this.baseUrl}/upload/private/${encodeURIComponent(name)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    };

    let response = await download();
    if (response.status === 401 && (await this.refreshAccessTokenShared())) {
      response = await download();
    }
    if (response.status === 401) {
      clearSession();
      redirectToLogin("expired");
      throw new SessionExpiredError();
    }
    if (!response.ok) {
      throw new Error(response.status === 404 ? "Fichier introuvable" : `Erreur ${response.status}`);
    }
    return response.blob();
  }

  /** Connexion avec un code de secours (téléphone indisponible). */
  verifyMfaRecoveryCode(mfaToken: string, recoveryCode: string): Promise<AuthSuccessResponse> {
    return this.request<AuthSuccessResponse>("/admin/mfa/verify", {
      method: "POST",
      body: JSON.stringify({ mfaToken, recoveryCode }),
    });
  }

  /** Nouveaux codes de secours ; les anciens deviennent inutilisables. */
  regenerateRecoveryCodes(currentPassword: string): Promise<RecoveryCodesResponse> {
    return this.request<RecoveryCodesResponse>("/auth/mfa/recovery-codes", {
      method: "POST",
      body: JSON.stringify({ currentPassword }),
    });
  }

  /** Super administrateur : lien à usage unique (1 h) pour qu'un admin redéfinisse son accès. */
  resetAdminAccess(id: number): Promise<AccessResetResponse> {
    return this.request<AccessResetResponse>(`/admin/${id}/reset-access`, { method: "POST" });
  }

  /** Le refresh token gardé par le navigateur est envoyé pour être révoqué côté API. */
  logout(): Promise<LogoutResponse> {
    return this.request<LogoutResponse>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken: getRefreshToken() ?? undefined }),
    });
  }

  /** Ferme toutes les sessions du compte, sur tous les appareils. */
  logoutAll(): Promise<LogoutResponse> {
    return this.request<LogoutResponse>("/auth/logout-all", {
      method: "POST",
    });
  }

  changePassword(currentPassword: string, newPassword: string): Promise<ChangePasswordResponse> {
    return this.request<ChangePasswordResponse>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  forceChangePassword(newPassword: string): Promise<ForceChangePasswordResponse> {
    return this.request<ForceChangePasswordResponse>("/auth/force-change-password", {
      method: "POST",
      body: JSON.stringify({ newPassword }),
    });
  }

  /** Désactiver la double authentification : mot de passe ET code de l'application. */
  disableMfa(currentPassword: string, code: string): Promise<DisableMfaResponse> {
    return this.request<DisableMfaResponse>("/auth/mfa/disable", {
      method: "POST",
      body: JSON.stringify({ currentPassword, code }),
    });
  }

  getAllAdmins(): Promise<ListAdminsResponse> {
    return this.request<ListAdminsResponse>(
      "/admin"
    );
  }

  getAuditLogs(
    params: {
      page?: number;
      pageSize?: number;
      eventType?: string;
      success?: string;
      email?: string;
      from?: string;
      to?: string;
    } = {}
  ): Promise<AuditLogPage> {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params.eventType) query.set("eventType", params.eventType);
    if (params.success !== undefined) query.set("success", params.success);
    if (params.email) query.set("email", params.email);
    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);

    const qs = query.toString();
    return this.request<AuditLogPage>(`/admin/audit-logs${qs ? `?${qs}` : ""}`);
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

  updateCeoMessage(id: number, data: { title?: string; description?: string; image_url?: string | null }) {
    return this.request<{ message: string; data: { id: number; title: string; description: string; image_url: string | null; updated_at: string } }>(`/ceomessage/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteCeoMessage(id: number) {
    return this.request<{ message: string }>(`/ceomessage/${id}`, { method: "DELETE" });
  }

  // --- HeroSlide ---
  getAllHeroSlides(page?: HeroPage) {
    return this.request<{ slides: HeroSlide[] }>(`/hero-slide${page ? `?page=${page}` : ""}`);
  }

  getHeroSlide(id: number) {
    return this.request<{ slide: HeroSlide }>(`/hero-slide/${id}`);
  }

  createHeroSlide(data: HeroSlideInput & { image_url: string }) {
    return this.request<{ message: string; slide: HeroSlide }>("/hero-slide", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateHeroSlide(id: number, data: HeroSlideInput) {
    return this.request<{ message: string; slide: HeroSlide }>(`/hero-slide/${id}`, {
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

  updateKpiStat(id: number, data: { label?: string; value?: string; unit?: string | null; position?: number; is_active?: boolean }) {
    return this.request<{ message: string; stat: { id: number; label: string; value: string; unit: string | null; position: number; is_active: boolean } }>(`/kpistat/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteKpiStat(id: number) {
    return this.request<{ message: string }>(`/kpistat/${id}`, { method: "DELETE" });
  }

  // --- Reference ---
  getAllReferences() {
    return this.request<{ references: { id: number; label: string; image_url: string; website_url: string | null; position: number; is_active: boolean }[] }>("/reference");
  }

  getReference(id: number) {
    return this.request<{ reference: { id: number; label: string; image_url: string; website_url: string | null; position: number; is_active: boolean } }>(`/reference/${id}`);
  }

  createReference(data: { label: string; image_url: string; website_url?: string; position?: number; is_active?: boolean }) {
    return this.request<{ message: string; reference: { id: number; label: string; image_url: string; website_url: string | null; position: number; is_active: boolean } }>("/reference", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateReference(id: number, data: { label?: string; image_url?: string; website_url?: string | null; position?: number; is_active?: boolean }) {
    return this.request<{ message: string; reference: { id: number; label: string; image_url: string; website_url: string | null; position: number; is_active: boolean } }>(`/reference/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteReference(id: number) {
    return this.request<{ message: string }>(`/reference/${id}`, { method: "DELETE" });
  }

  // --- Catalogue ---
  getAllCatalogues() {
    return this.request<{ catalogues: { id: number; title: string; file_url: string; is_lead_magnet: boolean; year: number | null; is_impact_report: boolean; uploaded_at: string }[] }>("/catalogue");
  }

  getImpactReport() {
    return this.request<{ catalogue: { id: number; title: string; file_url: string; is_lead_magnet: boolean; year: number | null; is_impact_report: boolean; uploaded_at: string } | null }>("/catalogue/impact");
  }

  getCatalogue(id: number) {
    return this.request<{ catalogue: { id: number; title: string; file_url: string; is_lead_magnet: boolean; year: number | null; is_impact_report: boolean; uploaded_at: string } }>(`/catalogue/${id}`);
  }

  createCatalogue(data: { title: string; file_url: string; is_lead_magnet?: boolean; year?: number | null; is_impact_report?: boolean }) {
    return this.request<{ message: string; catalogue: { id: number; title: string; file_url: string; is_lead_magnet: boolean; year: number | null; is_impact_report: boolean; uploaded_at: string } }>("/catalogue", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateCatalogue(id: number, data: { title?: string; file_url?: string; is_lead_magnet?: boolean; year?: number | null; is_impact_report?: boolean }) {
    return this.request<{ message: string; catalogue: { id: number; title: string; file_url: string; is_lead_magnet: boolean; year: number | null; is_impact_report: boolean; uploaded_at: string } }>(`/catalogue/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteCatalogue(id: number) {
    return this.request<{ message: string }>(`/catalogue/${id}`, { method: "DELETE" });
  }

  // --- JobPosting ---
  getAllJobPostings() {
    return this.request<{ jobPostings: { id: number; title: string; contract_type: string; description: string | null; external_url: string | null; fiche_url: string | null; is_active: boolean; created_at: string; applications?: { id: number }[] }[] }>("/job-posting");
  }

  getJobPosting(id: number) {
    return this.request<{ jobPosting: { id: number; title: string; contract_type: string; description: string | null; external_url: string | null; fiche_url: string | null; is_active: boolean; created_at: string; applications: { id: number; first_name: string; last_name: string; email: string }[] } }>(`/job-posting/${id}`);
  }

  createJobPosting(data: { title: string; contract_type: string; description?: string; external_url?: string; fiche_url?: string; is_active?: boolean }) {
    return this.request<{ message: string; jobPosting: { id: number; title: string; contract_type: string; description: string | null; external_url: string | null; fiche_url: string | null; is_active: boolean; created_at: string } }>("/job-posting", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateJobPosting(id: number, data: { title?: string; contract_type?: string; description?: string | null; external_url?: string | null; fiche_url?: string | null; is_active?: boolean }) {
    return this.request<{ message: string; jobPosting: { id: number; title: string; contract_type: string; description: string | null; external_url: string | null; fiche_url: string | null; is_active: boolean; created_at: string } }>(`/job-posting/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteJobPosting(id: number) {
    return this.request<{ message: string }>(`/job-posting/${id}`, { method: "DELETE" });
  }

  // --- Application ---
  createApplication(data: { website?: string; job_id: number; first_name: string; last_name: string; email: string; phone?: string; cv_url: string; cover_letter?: string }) {
    return this.request<{ message: string; application: { id: number } }>("/application", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  getAllApplications() {
    return this.request<{ applications: { id: number; job_id: number; first_name: string; last_name: string; email: string; phone: string | null; cv_url: string; cover_letter: string | null; submitted_at: string; job_posting: { id: number; title: string } }[] }>("/application");
  }

  getApplication(id: number) {
    return this.request<{ application: { id: number; job_id: number; first_name: string; last_name: string; email: string; phone: string | null; cv_url: string; cover_letter: string | null; submitted_at: string; job_posting: { id: number; title: string } } }>(`/application/${id}`);
  }

  getApplicationsByJobId(jobId: number) {
    return this.request<{ applications: { id: number; job_id: number; first_name: string; last_name: string; email: string; phone: string | null; cv_url: string; cover_letter: string | null; submitted_at: string; job_posting: { id: number; title: string } }[] }>(`/application/job/${jobId}`);
  }

  updateApplication(id: number, data: { first_name?: string; last_name?: string; email?: string; phone?: string; cv_url?: string; cover_letter?: string }) {
    return this.request<{ message: string; application: { id: number } }>(`/application/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteApplication(id: number) {
    return this.request<{ message: string }>(`/application/${id}`, { method: "DELETE" });
  }

  // --- SpontaneousApplication ---
  getAllSpontaneousApplications() {
    return this.request<{ spontaneousApplications: { id: number; first_name: string; last_name: string; email: string; phone: string | null; cv_url: string; motivation: string | null; submitted_at: string }[] }>("/spontaneous-application");
  }

  getSpontaneousApplication(id: number) {
    return this.request<{ spontaneousApplication: { id: number; first_name: string; last_name: string; email: string; phone: string | null; cv_url: string; motivation: string | null; submitted_at: string } }>(`/spontaneous-application/${id}`);
  }

  updateSpontaneousApplication(id: number, data: { first_name?: string; last_name?: string; email?: string; phone?: string; cv_url?: string; motivation?: string }) {
    return this.request<{ message: string; spontaneousApplication: { id: number } }>(`/spontaneous-application/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteSpontaneousApplication(id: number) {
    return this.request<{ message: string }>(`/spontaneous-application/${id}`, { method: "DELETE" });
  }

  // --- Article ---
  getAllArticles() {
    return this.request<{ articles: { id: number; title: string; description: string | null; type: string | null; cover_url: string | null; file_url: string | null; is_lead_magnet: boolean; is_published: boolean; published_at: string | null }[] }>("/article");
  }

  getArticle(id: number) {
    return this.request<{ article: { id: number; title: string; description: string | null; type: string | null; cover_url: string | null; file_url: string | null; is_lead_magnet: boolean; is_published: boolean; published_at: string | null } }>(`/article/${id}`);
  }

  createArticle(data: { title: string; description?: string; type?: string; cover_url?: string; file_url?: string; is_lead_magnet?: boolean; is_published?: boolean; published_at?: string }) {
    return this.request<{ message: string; article: { id: number; title: string; description: string | null; type: string | null; cover_url: string | null; file_url: string | null; is_lead_magnet: boolean; is_published: boolean; published_at: string | null } }>("/article", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateArticle(id: number, data: { title?: string; description?: string | null; type?: string; cover_url?: string | null; file_url?: string | null; is_lead_magnet?: boolean; is_published?: boolean; published_at?: string }) {
    return this.request<{ message: string; article: { id: number } }>(`/article/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteArticle(id: number) {
    return this.request<{ message: string }>(`/article/${id}`, { method: "DELETE" });
  }

  // --- Event ---
  getAllEvents() {
    return this.request<{ events: { id: number; title: string; description: string | null; event_date: string; youtube_url: string | null; is_published: boolean; event_images: { id: number; image_url: string; caption: string | null; position: number }[] }[] }>("/event");
  }

  getEvent(id: number) {
    return this.request<{ event: { id: number; title: string; description: string | null; event_date: string; youtube_url: string | null; is_published: boolean; event_images: { id: number; image_url: string; caption: string | null; position: number }[] } }>(`/event/${id}`);
  }

  createEvent(data: { title: string; description?: string; event_date: string; youtube_url?: string; is_published?: boolean }) {
    return this.request<{ message: string; event: { id: number; title: string; description: string | null; event_date: string; youtube_url: string | null; is_published: boolean } }>("/event", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateEvent(id: number, data: { title?: string; description?: string | null; event_date?: string; youtube_url?: string | null; is_published?: boolean }) {
    return this.request<{ message: string; event: { id: number } }>(`/event/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteEvent(id: number) {
    return this.request<{ message: string }>(`/event/${id}`, { method: "DELETE" });
  }

  // --- EventImage ---
  getAllEventImages() {
    return this.request<{ eventImages: { id: number; event_id: number; image_url: string; caption: string | null; position: number; event: { id: number; title: string } }[] }>("/event-image");
  }

  getEventImage(id: number) {
    return this.request<{ eventImage: { id: number; event_id: number; image_url: string; caption: string | null; position: number; event: { id: number; title: string } } }>(`/event-image/${id}`);
  }

  getEventImagesByEventId(eventId: number) {
    return this.request<{ eventImages: { id: number; event_id: number; image_url: string; caption: string | null; position: number }[] }>(`/event-image/event/${eventId}`);
  }

  createEventImage(data: { event_id: number; image_url: string; caption?: string; position?: number }) {
    return this.request<{ message: string; eventImage: { id: number; event_id: number; image_url: string; caption: string | null; position: number } }>("/event-image", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateEventImage(id: number, data: { event_id?: number; image_url?: string; caption?: string | null; position?: number }) {
    return this.request<{ message: string; eventImage: { id: number } }>(`/event-image/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteEventImage(id: number) {
    return this.request<{ message: string }>(`/event-image/${id}`, { method: "DELETE" });
  }

  // --- ContactMessage ---
  getAllContactMessages() {
    return this.request<{ contactMessages: { id: number; first_name: string; last_name: string; email: string; phone: string | null; company: string | null; country: string | null; message: string; attachment_url: string | null; is_read: boolean; submitted_at: string }[] }>("/contact-message");
  }

  getContactMessage(id: number) {
    return this.request<{ contactMessage: { id: number; first_name: string; last_name: string; email: string; phone: string | null; company: string | null; country: string | null; message: string; attachment_url: string | null; is_read: boolean; submitted_at: string } }>(`/contact-message/${id}`);
  }

  markContactMessageAsRead(id: number) {
    return this.request<{ message: string; contactMessage: { id: number; is_read: boolean } }>(`/contact-message/${id}/read`, {
      method: "PUT",
    });
  }

  deleteContactMessage(id: number) {
    return this.request<{ message: string }>(`/contact-message/${id}`, { method: "DELETE" });
  }

  // --- Public endpoints (no auth) ---
  getLatestCeoMessage() {
    return this.request<{ message: { id: number; title: string; description: string; image_url: string | null; updated_at: string } }>("/ceomessage/latest");
  }

  getActiveHeroSlides(page: HeroPage) {
    return this.request<{ slides: HeroSlide[] }>(`/hero-slide?onlyActive=true&page=${page}`);
  }

  getActiveKpiStats() {
    return this.request<{ stats: { id: number; label: string; value: string; unit: string | null; position: number; is_active: boolean }[] }>("/kpistat?active=true");
  }

  getActiveReferences() {
    return this.request<{ references: { id: number; label: string; image_url: string; website_url: string | null; position: number; is_active: boolean }[] }>("/reference?onlyActive=true");
  }

  getActiveJobPostings() {
    return this.request<{ jobPostings: { id: number; title: string; contract_type: string; description: string | null; external_url: string | null; fiche_url: string | null; is_active: boolean; created_at: string }[] }>("/job-posting?onlyActive=true");
  }

  getPublishedArticles() {
    return this.request<{ articles: { id: number; title: string; description: string | null; type: string | null; cover_url: string | null; file_url: string | null; is_lead_magnet: boolean; is_published: boolean; published_at: string | null }[] }>("/article?onlyPublished=true");
  }

  getPublishedEvents() {
    return this.request<{ events: { id: number; title: string; description: string | null; event_date: string; youtube_url: string | null; is_published: boolean; event_images: { id: number; image_url: string; caption: string | null; position: number }[] }[] }>("/event?onlyPublished=true");
  }

  createContactMessage(data: { website?: string; first_name: string; last_name: string; email: string; phone?: string; company?: string; country?: string; message: string; attachment_url?: string }) {
    return this.request<{ message: string; contactMessage: { id: number } }>("/contact-message", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  createSpontaneousApplication(data: { website?: string; first_name: string; last_name: string; email: string; phone?: string; cv_url: string; motivation?: string }) {
    return this.request<{ message: string; spontaneousApplication: { id: number } }>("/spontaneous-application", {
      method: "POST",
      body: JSON.stringify(data),
    });
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

  // Upload de CV public (formulaire carriere) — sans authentification
  uploadCvPublic(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.request<{ url: string; filename: string }>("/upload/cv", {
      method: "POST",
      body: formData,
    });
  }

  // Pièce jointe facultative du formulaire de contact (PDF, DOC, DOCX, 5 Mo) — sans authentification
  uploadContactAttachment(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.request<{ url: string; filename: string }>("/upload/contact", {
      method: "POST",
      body: formData,
    });
  }

  // Remontée de vue du site public — fire-and-forget, jamais bloquant
  async trackPageView(path: string, visitorId: string, referrer?: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/analytics/page-view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({ path, visitorId, referrer: referrer || null }),
      });
    } catch {
      // Le tracking ne doit jamais perturber la navigation.
    }
  }

  getAnalyticsSummary(range: number): Promise<AnalyticsSummaryResponse> {
    return this.request<AnalyticsSummaryResponse>(
      `/analytics/summary?range=${range}`,
    );
  }
}

export const api = new ApiClient(API_BASE);
