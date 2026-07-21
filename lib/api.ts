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

  updateReference(id: number, data: { label?: string; image_url?: string; website_url?: string; position?: number; is_active?: boolean }) {
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
    return this.request<{ catalogues: { id: number; title: string; file_url: string; is_lead_magnet: boolean; uploaded_at: string }[] }>("/catalogue");
  }

  getCatalogue(id: number) {
    return this.request<{ catalogue: { id: number; title: string; file_url: string; is_lead_magnet: boolean; uploaded_at: string } }>(`/catalogue/${id}`);
  }

  createCatalogue(data: { title: string; file_url: string; is_lead_magnet?: boolean }) {
    return this.request<{ message: string; catalogue: { id: number; title: string; file_url: string; is_lead_magnet: boolean; uploaded_at: string } }>("/catalogue", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateCatalogue(id: number, data: { title?: string; file_url?: string; is_lead_magnet?: boolean }) {
    return this.request<{ message: string; catalogue: { id: number; title: string; file_url: string; is_lead_magnet: boolean; uploaded_at: string } }>(`/catalogue/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteCatalogue(id: number) {
    return this.request<{ message: string }>(`/catalogue/${id}`, { method: "DELETE" });
  }

  // --- JobPosting ---
  getAllJobPostings() {
    return this.request<{ jobPostings: { id: number; title: string; contract_type: string; description: string | null; external_url: string | null; fiche_url: string | null; is_active: boolean; created_at: string; applications: { id: number }[] }[] }>("/job-posting");
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

  updateJobPosting(id: number, data: { title?: string; contract_type?: string; description?: string; external_url?: string; fiche_url?: string; is_active?: boolean }) {
    return this.request<{ message: string; jobPosting: { id: number; title: string; contract_type: string; description: string | null; external_url: string | null; fiche_url: string | null; is_active: boolean; created_at: string } }>(`/job-posting/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteJobPosting(id: number) {
    return this.request<{ message: string }>(`/job-posting/${id}`, { method: "DELETE" });
  }

  // --- Application ---
  createApplication(data: { job_id: number; first_name: string; last_name: string; email: string; phone?: string; cv_url: string; cover_letter?: string }) {
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

  updateArticle(id: number, data: { title?: string; description?: string; type?: string; cover_url?: string; file_url?: string; is_lead_magnet?: boolean; is_published?: boolean; published_at?: string }) {
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

  updateEvent(id: number, data: { title?: string; description?: string; event_date?: string; youtube_url?: string; is_published?: boolean }) {
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

  updateEventImage(id: number, data: { event_id?: number; image_url?: string; caption?: string; position?: number }) {
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
    return this.request<{ contactMessages: { id: number; first_name: string; last_name: string; email: string; phone: string | null; company: string | null; country: string | null; message: string; is_read: boolean; submitted_at: string }[] }>("/contact-message");
  }

  getContactMessage(id: number) {
    return this.request<{ contactMessage: { id: number; first_name: string; last_name: string; email: string; phone: string | null; company: string | null; country: string | null; message: string; is_read: boolean; submitted_at: string } }>(`/contact-message/${id}`);
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

  getActiveHeroSlides() {
    return this.request<{ slides: { id: number; image_url: string; title: string | null; description: string | null; cta_label: string | null; cta_url: string | null; position: number; is_active: boolean }[] }>("/hero-slide?onlyActive=true");
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

  createContactMessage(data: { first_name: string; last_name: string; email: string; phone?: string; company?: string; country?: string; message: string }) {
    return this.request<{ message: string; contactMessage: { id: number } }>("/contact-message", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  createSpontaneousApplication(data: { first_name: string; last_name: string; email: string; phone?: string; cv_url: string; motivation?: string }) {
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
}

export const api = new ApiClient(API_BASE);
