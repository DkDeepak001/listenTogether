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

export type AccessTokenInfo = TokenData & {
  refresh_token: string;
};

export type ErrorResponse = {
  error: string;
  error_description: string;
};

export interface ExternalIds {
  isrc: string;
}
export interface Owner {
  external_urls: object;
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name: string | null;
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
export interface Device {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export interface Context {
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
}

//_______________________________________
// Spotify API Response Types
export type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token: string;
};

export interface TopArtistsResponse {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: Artist[];
}

export interface TrackResponse {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: Track[];
}
export interface PlaylistResponse {
  href: string;
  items: Playlist[];
  limit: number;
  next: null | string;
  offset: number;
  previous: null | string;
  total: number;
}
export interface AlbumResponse {
  href: string;
  items: Album[];
  limit: number;
  next: null | string;
  offset: number;
  previous: null | string;
  total: number;
}
export interface CurrentlyPlaying {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: { isrc: string };
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
}

//_______________________________________
// Spotify Types
export interface PlaylistTrack {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: { track: Track }[];
}
export interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color: null;
  public: boolean;
  snapshot_id: string;
  tracks: PlaylistTrack;
  type: "playlist";
  uri: string;
}

export interface Track {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

export interface Album {
  album_type: "ALBUM";
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: "day";
  type: "album";
  uri: string;
  artists: Artist[];
  tracks: TrackResponse;
}

export interface Artist {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: "artist";
  uri: string;
}

export interface CurrentlyPlayingResponse {
  device: Device;
  shuffle_state: boolean;
  repeat_state: string;
  timestamp: number;
  context: Context;
  progress_ms: number;
  item: CurrentlyPlaying;
  currently_playing_type: string;
  actions: {
    disallows: { resuming: boolean };
  };
  is_playing: boolean;
}
