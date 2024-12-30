import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private keycloak: KeycloakService) {}

  public logout(): void {
    this.keycloak.logout("http://localhost:4200/").then();
  }

  login(redirectUri: string = window.location.origin + "/accueil"): void {
    this.keycloak.login({ redirectUri }).then();
  }

  isLoggedIn(): boolean {
    return this.keycloak.isLoggedIn();
  }

  getUsername(): string {
    return this.keycloak.getKeycloakInstance()?.profile?.username as string;
  }

  getId(): string {
    return this.keycloak.getKeycloakInstance().profile?.id as string;
  }

  getTokenExpirationDate(): number {
    return (this.keycloak.getKeycloakInstance().refreshTokenParsed as { exp: number })['exp'] as number;
  }

  refresh(): Observable<any> {
    return from(this.keycloak.getKeycloakInstance().updateToken(1800));
  }

  isExpired(): boolean {
    return this.keycloak.getKeycloakInstance().isTokenExpired();
  }
}
