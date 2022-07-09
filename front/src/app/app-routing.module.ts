import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserMainComponent} from "./components/user-main/user-main.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {RegisterComponent} from "./components/register/register.component";
import {UserLoginComponent} from "./components/user-login/user-login.component";
import {SiteLoginComponent} from "./components/site-login/site-login.component";
import {AdminLoginComponent} from "./components/admin-login/admin-login.component";
import {NonLoginGuard} from "./guards/non-login.guard";

const routes: Routes = [
  {path: 'login', component: UserLoginComponent, canActivate: [NonLoginGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [NonLoginGuard]},
  {path: 'site/login', component: SiteLoginComponent, canActivate: [NonLoginGuard]},
  {path: 'admin/login', component: AdminLoginComponent, canActivate: [NonLoginGuard]},
  {path: '', component: UserMainComponent, pathMatch: 'full', canActivate: [NonLoginGuard]},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
