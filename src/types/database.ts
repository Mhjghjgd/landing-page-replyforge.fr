export type SubscriptionStatus = "pending_payment" | "active" | "cancelled" | "expired";
export type UserRole = "hotel" | "admin";
export type ResponseStatus = "pending" | "published" | "failed";
export type CatchupJobStatus = "pending" | "processing" | "completed" | "failed";
export type ResponseLength = "short" | "medium" | "long";

export interface Profile {
  id: string;
  full_name: string;
  hotel_name: string;
  email: string;
  role: UserRole;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
}

export interface ToneProfile {
  id: string;
  user_id: string;
  positioning: string;
  tone_level: number;
  response_length: ResponseLength;
  signature: string | null;
  strengths: string[];
  sensitive_topics: string[];
  updated_at: string;
}

export interface GoogleConnection {
  id: string;
  user_id: string;
  gmbapi_location_id: string;
  business_name: string | null;
  business_address: string | null;
  connected_at: string;
  last_sync_at: string | null;
}

export interface Review {
  id: string;
  user_id: string;
  gmbapi_review_id: string;
  author_name: string | null;
  rating: number | null;
  review_text: string | null;
  review_language: string | null;
  review_created_at: string | null;
  imported_at: string;
}

export interface Response {
  id: string;
  review_id: string;
  user_id: string;
  response_text: string;
  status: ResponseStatus;
  published_at: string | null;
  is_catchup: boolean;
  generated_at: string;
}

export interface CatchupJob {
  id: string;
  user_id: string;
  stripe_payment_intent_id: string | null;
  status: CatchupJobStatus;
  total_reviews: number;
  processed_reviews: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}
