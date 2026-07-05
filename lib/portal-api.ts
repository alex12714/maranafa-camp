/**
 * Client helper for the conference portal -> backend API.
 *
 * The API (FastAPI at api.maranafa.camp) is cross-origin from the portal
 * host (conference.maranafa.camp), so the session is a JWT kept in
 * localStorage and sent as an `Authorization: Bearer` header — no cookies.
 *
 * Portal pages (/portal/login, /portal/me, /portal/services, ...) should use
 * `apiFetch` for authenticated calls: it attaches the token and, on a 401,
 * clears the session and redirects to the login page.
 */

export const PORTAL_API_BASE = "https://api.maranafa.camp"

/** Public (un-rewritten) path of the portal login page. */
export const PORTAL_LOGIN_PATH = "/portal/login"

const ACCESS_TOKEN_KEY = "portal_access_token"
const REFRESH_TOKEN_KEY = "portal_refresh_token"

// ---------------------------------------------------------------------------
// Token storage (localStorage; all functions are SSR-safe no-ops)
// ---------------------------------------------------------------------------

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(accessToken: string, refreshToken?: string): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export function clearTokens(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/** True when an access token is present (does not check expiry). */
export function isLoggedIn(): boolean {
  return getToken() !== null
}

// ---------------------------------------------------------------------------
// API types (mirror app/schemas/auth.py in the maranafa-api repo)
// ---------------------------------------------------------------------------

export type AuthRole = "staff" | "participant" | "parent"
export type TokenSource = "people" | "parents"

/** The authenticated subject (`user` in login/refresh responses, GET /auth/me). */
export interface AuthUser {
  id: string
  name: string | null
  phone: string | null
  role: AuthRole
  source: TokenSource
}

/** One selectable profile when an identifier matches more than one person. */
export interface LoginCandidate {
  id: string
  name: string | null
  role: AuthRole
}

interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: AuthUser
}

interface MultiProfileResponse {
  needs_selection: true
  candidates: LoginCandidate[]
}

/** Discriminated result of a login attempt (both shapes come back as HTTP 200). */
export type LoginResult =
  | { kind: "success"; user: AuthUser }
  | { kind: "select"; candidates: LoginCandidate[] }

/** Thrown by `login` on a 401 (unknown identifier / verification failed). */
export class LoginError extends Error {
  constructor() {
    super("Invalid identifier or verification failed")
    this.name = "LoginError"
  }
}

// ---------------------------------------------------------------------------
// Auth calls
// ---------------------------------------------------------------------------

/**
 * POST /auth/login.
 *
 * `identifier` is a phone number or (when it contains "@") an email — the
 * backend auto-detects; the request field is named `phone` for back-compat.
 *
 * Returns `{kind: "select", candidates}` when the identifier matches several
 * people; re-call with the chosen `personId` to complete the login. On
 * success the token pair is stored and the user returned.
 *
 * Throws `LoginError` on 401 and `TypeError` on network failure.
 */
export async function login(
  identifier: string,
  personId?: string,
): Promise<LoginResult> {
  const res = await fetch(`${PORTAL_API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: identifier,
      ...(personId ? { person_id: personId } : {}),
    }),
  })

  if (res.status === 401) throw new LoginError()
  if (!res.ok) throw new Error(`Login failed: HTTP ${res.status}`)

  const data: TokenResponse | MultiProfileResponse = await res.json()
  if ("needs_selection" in data && data.needs_selection) {
    return { kind: "select", candidates: data.candidates }
  }

  const tokens = data as TokenResponse
  setTokens(tokens.access_token, tokens.refresh_token)
  return { kind: "success", user: tokens.user }
}

/** Clear the stored session and send the user to the login page. */
export function logout(): void {
  clearTokens()
  if (typeof window !== "undefined") {
    window.location.href = PORTAL_LOGIN_PATH
  }
}

// ---------------------------------------------------------------------------
// Authenticated fetch
// ---------------------------------------------------------------------------

export interface ApiFetchOptions extends RequestInit {
  /**
   * When true (default), a 401 response clears the stored tokens and
   * redirects to the portal login page. Set to false for calls that handle
   * 401 themselves.
   */
  redirectOn401?: boolean
}

/**
 * fetch() against the portal API: prefixes `PORTAL_API_BASE`, attaches the
 * bearer token when present, and (by default) treats a 401 as an expired
 * session — tokens are cleared and the browser navigates to /portal/login.
 *
 * Example: `const res = await apiFetch("/auth/me"); const me = await res.json()`
 */
export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
  const { redirectOn401 = true, headers, ...init } = options
  const token = getToken()

  const res = await fetch(`${PORTAL_API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  if (res.status === 401 && redirectOn401) {
    clearTokens()
    if (typeof window !== "undefined") {
      window.location.href = PORTAL_LOGIN_PATH
    }
  }

  return res
}
