export interface AuthConfigDto {
  authority: string;
  clientId: string;
  scope: string;
  responseType: string;
  redirectUrl: string;
  logoutUrl: string;
}
