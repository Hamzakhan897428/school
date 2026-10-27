import { storage } from "./storage";
import {
  LoginRequest,
  LoginResponse,
  MeResponse,
  ChangePasswordRequest,
  DeviceSession,
  ChildSummary,
  AttendanceResponse,
  DiaryResponse,
  FeesResponse,
  ResultItem,
  TimetableResponse,
  CalendarItem,
  NoticeItem,
} from "../types/api";

export const API_URL = "https://api.wellrunsystem.com";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly retryAfter?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Callback hook for 401 token invalidation
let onUnauthorizedCallback: (() => Promise<void>) | null = null;

export function setOnUnauthorized(callback: () => Promise<void>) {
  onUnauthorizedCallback = callback;
}

export async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = await storage.getToken();
  const headers = new Headers(init.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
    });
  } catch (err) {
    throw new ApiError(
      "Unable to connect to server. Please check your internet connection.",
      0
    );
  }

  if (!res.ok) {
    let message = "An unexpected error occurred";
    let retryAfter: number | undefined;

    try {
      const body = await res.json();
      if (Array.isArray(body.message)) {
        message = body.message.join(", ");
      } else if (body.message) {
        message = body.message;
      }
      retryAfter = body.retryAfter;
    } catch {
      message = `Server returned error (${res.status})`;
    }

    // Only sign out on 401 for authenticated calls with a real wp_ token
    if (res.status === 401 && token && token.startsWith("wp_")) {
      await storage.clearToken();
      if (onUnauthorizedCallback) {
        await onUnauthorizedCallback();
      }
    }

    throw new ApiError(message, res.status, retryAfter);
  }

  return res.json() as Promise<T>;
}

const post = (body: unknown): RequestInit => ({
  method: "POST",
  body: JSON.stringify(body),
});

const patch = (body: unknown): RequestInit => ({
  method: "PATCH",
  body: JSON.stringify(body),
});

export const api = {
  // Health
  health: () => request<{ ok: boolean; service: string }>("/health"),

  // Authentication
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const data = await request<LoginResponse>(
      "/parent/auth/login",
      post(credentials)
    );
    if (data.token) {
      await storage.setToken(data.token);
    }
    return data;
  },

  changePassword: (data: ChangePasswordRequest) =>
    request<{ ok: true; parentId: string }>(
      "/parent/auth/change-password",
      post(data)
    ),

  logout: async () => {
    try {
      await request<{ ok: true }>("/parent/auth/logout", { method: "POST" });
    } catch {
      // Ignore network failure on logout
    } finally {
      await storage.clearAll();
    }
  },

  me: () => request<MeResponse>("/parent/me"),

  updateProfile: (data: { locale?: "en" | "ur"; name?: string }) =>
    request<MeResponse>("/parent/me", patch(data)),

  devices: () => request<DeviceSession[]>("/parent/devices"),

  revokeDevice: (deviceId: string) =>
    request<{ ok: true }>(`/parent/devices/${deviceId}`, {
      method: "DELETE",
    }),

  // Child Specific Endpoints
  summary: (childId: string) =>
    request<ChildSummary>(`/parent/children/${childId}/summary`),

  attendance: (childId: string, month?: string) =>
    request<AttendanceResponse>(
      `/parent/children/${childId}/attendance${month ? `?month=${month}` : ""}`
    ),

  diary: (childId: string, date?: string) =>
    request<DiaryResponse>(
      `/parent/children/${childId}/diary${date ? `?date=${date}` : ""}`
    ),

  fees: (childId: string) =>
    request<FeesResponse>(`/parent/children/${childId}/fees`),

  results: (childId: string) =>
    request<ResultItem[]>(`/parent/children/${childId}/results`),

  timetable: (childId: string) =>
    request<TimetableResponse>(`/parent/children/${childId}/timetable`),

  calendar: (childId: string, from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const query = params.toString();
    return request<CalendarItem[]>(
      `/parent/children/${childId}/calendar${query ? `?${query}` : ""}`
    );
  },

  notices: (childId: string) =>
    request<NoticeItem[]>(`/parent/children/${childId}/notices`),

  // URL Helpers
  mediaUrl: (url?: string | null): string => {
    if (!url) return "";
    if (url.startsWith("/")) return `${API_URL}${url}`;
    return url;
  },

  formatMoney: (pkr: number): string => {
    return `Rs. ${Math.round(pkr).toLocaleString()}`;
  },
};

