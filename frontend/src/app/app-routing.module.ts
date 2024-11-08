import {inject, NgModule} from '@angular/core';
import {CanActivateFn, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./authentication/auth.guard";
import {SecuredComponent} from "./secured/secured.component";
import { TableauComponent } from './tableau/tableau.component';

const isAuthenticated: CanActivateFn = (route, state) => {
  return inject(AuthGuard).isAccessAllowed(route, state);
}

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'secured',
    canActivate: [isAuthenticated],
    component: SecuredComponent
  },
  {
    path: '**', redirectTo: 'login'
  },
  { path: 'accueil', component: TableauComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
