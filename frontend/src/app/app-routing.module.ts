import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './authentication/auth.guard';
import { SecuredComponent } from './secured/secured.component';
import { TableauComponent } from './tableau/tableau.component';
import { CategoryDetailsComponent } from './category-details/category-details.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'secured',
    canActivate: [AuthGuard],
    component: SecuredComponent
  },
  {
    path: 'accueil',
    canActivate: [AuthGuard],
    component: TableauComponent
  },
  {
    path: 'category/:id',
    canActivate: [AuthGuard],
    component: CategoryDetailsComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
