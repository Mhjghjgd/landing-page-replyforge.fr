const BASE_URL = process.env.ZERNIO_API_URL ?? "https://zernio.com/api/v1";

/**
 * Google Business Profile returns review IDs as full resource names:
 * "accounts/x/locations/y/reviews/AbFvOq..."
 * Zernio passes these through. We only need the last segment for our endpoints.
 */
export function extractShortId(rawId: string): string {
  if (!rawId) return rawId;
  const idx = rawId.lastIndexOf("/");
  return idx >= 0 ? rawId.slice(idx + 1) : rawId;
}

export class ZernioError extends Error {
  constructor(
    public status: number,
    public code: string | null,
    message: string
  ) {
    super(message);
    this.name = "ZernioError";
  }
}

async function zernioFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const apiKey = process.env.ZERNIO_API_KEY;
  if (!apiKey) throw new ZernioError(500, null, "ZERNIO_API_KEY is not configured");

  const finalUrl = `${BASE_URL}${path}`;
  console.log("[zernioFetch] FINAL URL SENT:", finalUrl);
  console.log("[zernioFetch] METHOD:", init.method ?? "GET");
  console.log("[zernioFetch] X-Connect-Token:", (init.headers as Record<string, string>)?.["X-Connect-Token"] ?? "none");
  const res = await fetch(finalUrl, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (res.status === 429) {
    const retryAfter = res.headers.get("Retry-After") ?? "60";
    throw new ZernioError(429, "QUOTA_REACHED", `Rate limit. Retry after ${retryAfter}s`);
  }

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    console.error("[Zernio API error]", { status: res.status, url: `${BASE_URL}${path}`, body: bodyText });
    let code: string | null = null;
    let message = `Zernio HTTP ${res.status}`;
    try {
      const body = JSON.parse(bodyText);
      code = body.code ?? null;
      message = body.message ?? body.error ?? (bodyText || message);
    } catch {}
    throw new ZernioError(res.status, code, `${message} (body: ${bodyText.slice(0, 200)})`);
  }

  // Handle empty body (e.g. 204 No Content on DELETE)
  const text = await res.text();
  if (!text.trim()) return null as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    console.warn("[zernioFetch] Non-JSON response body:", text.slice(0, 200));
    return null as T;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ZernioProfile {
  _id: string;
  name: string;
}

export interface ZernioAccount {
  _id: string;
  platform: string;
  name?: string;
  address?: string;
  city?: string;
}

export interface ZernioReview {
  id?: string;
  _id?: string;
  reviewId?: string;
  rating?: number;
  starRating?: number;
  stars?: number;
  comment?: string;
  text?: string;
  content?: string;
  body?: string;
  message?: string;
  language?: string;
  locale?: string;
  author?: {
    name?: string;
    displayName?: string;
    photoUrl?: string;
    picture?: string;
  };
  reviewer?: {
    name?: string;
    displayName?: string;
    profilePhotoUrl?: string;
  };
  authorName?: string;
  createTime?: string;
  createdAt?: string;
  created_at?: string;
  updateTime?: string;
  updatedAt?: string;
  reply?: { comment?: string; text?: string; updateTime?: string; updatedAt?: string } | null;
}

export interface ZernioConnectLocation {
  id: string;
  name: string;
  address?: string;
  city?: string;
  locationId?: string;
  accountId?: string;
}

// ─── API functions ────────────────────────────────────────────────────────────

export const zernio = {
  createProfile: (name: string) =>
    zernioFetch<{ profile: ZernioProfile }>("/profiles", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  getGoogleBusinessConnectUrl: (profileId: string, redirectUrl: string, headless = true) => {
    const encodedRedirect = encodeURIComponent(redirectUrl);
    const path = `/connect/googlebusiness?profileId=${profileId}&headless=${headless}&redirect_url=${encodedRedirect}`;
    return zernioFetch<{ authUrl: string }>(path);
  },

  listConnectLocations: (
    connectToken: string,
    pendingDataToken?: string,
    profileId?: string
  ) => {
    const params = new URLSearchParams();
    if (pendingDataToken) params.set("pendingDataToken", pendingDataToken);
    if (profileId) params.set("profileId", profileId);
    const queryString = params.toString();
    const path = queryString
      ? `/connect/googlebusiness/locations?${queryString}`
      : "/connect/googlebusiness/locations";
    return zernioFetch<{ locations: ZernioConnectLocation[] }>(
      path,
      { headers: { "X-Connect-Token": connectToken } }
    );
  },

  selectConnectLocation: (
    connectToken: string,
    profileId: string,
    locationId: string,
    accountId: string,
    pendingDataToken: string
  ) =>
    (() => {
      const body = { profileId, locationId, accountId, pendingDataToken };
      console.log("[selectConnectLocation] BODY sent to Zernio:", JSON.stringify(body));
      return zernioFetch<{
        account: {
          accountId: string;
          platform: string;
          username: string;
          displayName: string;
          isActive: boolean;
          selectedLocationName: string;
          selectedLocationId: string;
        }
      }>(
        "/connect/googlebusiness/select-location",
        {
          method: "POST",
          headers: { "X-Connect-Token": connectToken },
          body: JSON.stringify(body),
        }
      );
    })(),

  listAccounts: (profileId: string) =>
    zernioFetch<{ accounts: ZernioAccount[] }>(
      `/accounts?profileId=${encodeURIComponent(profileId)}`
    ),

  getReviews: async (accountId: string) => {
    const path = `/inbox/reviews?accountId=${encodeURIComponent(accountId)}`;
    console.log("[getReviews] Calling:", path);
    const raw = await zernioFetch<unknown>(path);
    console.log("[getReviews] RAW response keys:", raw && typeof raw === "object" ? Object.keys(raw as object) : typeof raw);
    console.log("[getReviews] RAW response (first 500 chars):", JSON.stringify(raw).slice(0, 500));

    const r = raw as Record<string, unknown>;
    const reviews = (r.reviews ?? r.data ?? r.items ?? r.results ?? []) as ZernioReview[];

    if (!Array.isArray(reviews)) {
      console.error("[getReviews] Could not extract array from response. Returning empty.");
      return { reviews: [] as ZernioReview[] };
    }

    console.log("[getReviews] Extracted", reviews.length, "reviews");
    if (reviews.length > 0) {
      console.log("[getReviews] FIRST review keys:", Object.keys(reviews[0] as object));
      console.log("[getReviews] FIRST review full JSON:", JSON.stringify(reviews[0], null, 2));
    }
    return { reviews };
  },

  replyToReview: (accountId: string, reviewId: string, comment: string) =>
    zernioFetch<{ success: boolean }>(
      `/inbox/review-reply/${encodeURIComponent(reviewId)}`,
      { method: "POST", body: JSON.stringify({ comment, accountId }) }
    ),

  publishReviewReply: (accountId: string, reviewId: string, replyText: string) => {
    const shortId = extractShortId(reviewId);
    console.log("[publishReviewReply] raw reviewId:", reviewId, "→ extracted:", shortId);
    console.log("[publishReviewReply] accountId:", accountId);
    const path = `/accounts/${encodeURIComponent(accountId)}/gmb-reviews/${encodeURIComponent(shortId)}/reply`;
    const bodyPayload = { comment: replyText, text: replyText };
    console.log("[publishReviewReply] POST", path);
    console.log("[publishReviewReply] body:", JSON.stringify(bodyPayload));
    return zernioFetch<{ success?: boolean; id?: string } | null>(path, {
      method: "POST",
      body: JSON.stringify(bodyPayload),
    });
  },

  deleteReviewReply: (accountId: string, reviewId: string) => {
    const shortId = extractShortId(reviewId);
    console.log("[deleteReviewReply] raw reviewId:", reviewId, "→ extracted:", shortId);
    console.log("[deleteReviewReply] accountId:", accountId);
    const path = `/accounts/${encodeURIComponent(accountId)}/gmb-reviews/${encodeURIComponent(shortId)}/reply`;
    console.log("[deleteReviewReply] DELETE", path);
    return zernioFetch<null>(path, { method: "DELETE" });
  },
};
