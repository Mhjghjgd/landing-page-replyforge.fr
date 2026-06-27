const BASE_URL = process.env.ZERNIO_API_URL ?? "https://zernio.com/api/v1";

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

  const res = await fetch(`${BASE_URL}${path}`, {
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

  return res.json() as Promise<T>;
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
  id: string;
  rating: number;
  comment?: string;
  language?: string;
  author: {
    name?: string;
    photoUrl?: string;
  };
  createTime?: string;
  updateTime?: string;
  reply: { comment: string; updateTime?: string } | null;
}

// ─── API functions ────────────────────────────────────────────────────────────

export const zernio = {
  createProfile: (name: string) =>
    zernioFetch<{ profile: ZernioProfile }>("/profiles", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  // redirect_url param name inferred from Zernio error "Invalid redirect_url format"
  // Variant 1 (default): /connect/googlebusiness?profileId=...&redirect_url=...
  // Variant 2 (fallback): /connect/google-business?profileId=...
  // Variant 3 (fallback): /connect/get-url?platform=googlebusiness&profileId=...
  getOAuthUrl: (profileId: string, redirectUrl?: string) => {
    const params = new URLSearchParams({ profileId });
    if (redirectUrl) params.append("redirect_url", redirectUrl); // URLSearchParams encodes automatically
    return zernioFetch<{ authUrl: string }>(
      `/connect/googlebusiness?${params.toString()}`
    );
  },

  listAccounts: (profileId: string) =>
    zernioFetch<{ accounts: ZernioAccount[] }>(
      `/accounts?profileId=${encodeURIComponent(profileId)}`
    ),

  getReviews: (accountId: string) =>
    zernioFetch<{ reviews: ZernioReview[] }>(
      `/accounts/${encodeURIComponent(accountId)}/google-business-reviews`
    ),

  replyToReview: (accountId: string, reviewId: string, comment: string) =>
    zernioFetch<{ success: boolean }>(
      `/accounts/${encodeURIComponent(accountId)}/google-business-reviews/${encodeURIComponent(reviewId)}/reply`,
      { method: "POST", body: JSON.stringify({ comment }) }
    ),
};
