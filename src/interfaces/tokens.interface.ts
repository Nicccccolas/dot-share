export interface TokenResponse {
  token: string;
  expires: Date;
}

export interface AuthTokenResponse {
  access: TokenResponse;
  refresh: TokenResponse;
}
