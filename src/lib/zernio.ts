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
      return zernioFetch<{ account: { _id: string; name?: string; address?: string; city?: string } }>(
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
