import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SecuredComponent } from './secured/secured.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {KachelComponent} from "./common/kachel/kachel.component";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";
import { TableauComponent } from './tableau/tableau.component';
import { NavbarComponent } from './navbar/navbar.component';


function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:9080',
        realm: 'jhipster',
        clientId: 'frontend'
      },
      initOptions: {
        onLoad: 'check-sso'
      }
    });
}

@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        SecuredComponent,
        TableauComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        NavbarComponent,
        AppRoutingModule,
        BrowserAnimationsModule,
        KachelComponent,
        KeycloakAngularModule,
        MatButtonModule], providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService]
        },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
