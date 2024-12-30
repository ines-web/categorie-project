import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
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
import { CommonModule } from '@angular/common'; 
import { CategoryDetailsComponent } from './category-details/category-details.component';
import { CategorieSearchComponent } from './categorie-search/categorie-search.component';
import { AssociateCategoryPopupComponent } from './associate-category-popup/associate-category-popup.component';
import { FormsModule } from '@angular/forms';
import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';

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
        CategoryDetailsComponent,
        
    ],
    bootstrap: [AppComponent], 
    imports: [BrowserModule,
        NgxPaginationModule,
        RouterModule,
        NgSelectModule,
        NavbarComponent,
        AppRoutingModule,
        BrowserAnimationsModule,
        KachelComponent,
        KeycloakAngularModule,    
        FormsModule, 
        TableauComponent,
        ErrorPopupComponent,
        MatButtonModule,], providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService]
        },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
