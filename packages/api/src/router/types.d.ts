export interface ExplicitContent {
  filter_enabled: boolean;
  filter_locked: boolean;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  height: number | null;
  url: string;
  width: number | null;
}

export interface Follower {
  href: string | null;
  total: number;
}

export interface User {
  country: string;
  display_name: string;
  email: string;
  explicit_content: ExplicitContent;
  external_urls: ExternalUrls;
  followers: Follower;
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

export type AccessTokenInfo = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

export type ErrorResponse = {
  error: string;
  error_description: string;
};