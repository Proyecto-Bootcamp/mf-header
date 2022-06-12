import { LoginService } from './services/login.service';
import { MessageService } from './services/message.service';
import {
  OAuthService,
  AuthConfig,
  NullValidationHandler,
} from 'angular-oauth2-oidc';
import { Component, Input } from '@angular/core';
@Component({
  selector: 'mf-header',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'mf-header';

  @Input() isAdmin!: boolean;

  @Input() username!: string;

  @Input() isLogged!: boolean;

  constructor(
    private oauthService: OAuthService,
    private messageService: MessageService,
    private loginService: LoginService
  ) {
    this.configure();
  }

  authConfig: AuthConfig = {
    issuer: 'http://localhost:8180/auth/realms/tutorial',
    redirectUri: window.location.origin,
    clientId: 'tutorial-frontend',
    responseType: 'code',
    scope: 'openid profile email offline_access',
    showDebugInformation: true,
  };

  configure(): void {
    this.oauthService.configure(this.authConfig);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService
      .loadDiscoveryDocument()
      .then(() => this.oauthService.tryLogin())
      .then(() => {
        if (this.oauthService.getIdentityClaims()) {
          this.isLogged = this.loginService.getIsLogged();
          this.isAdmin = this.loginService.getIsAdmin();
          this.username = this.loginService.getUsername();
          this.messageService.sendMessage(this.loginService.getUsername());
        }
      });
  }

  public getIsLogged(): boolean {
    return this.loginService.getIsLogged();
  }

  public getIsAdmin(): boolean {
    return this.loginService.getIsAdmin();
  }

  public login(): void {
    this.loginService.login();
  }

  public logout(): void {
    this.loginService.logout();
  }
}
