import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AdminComponent} from "./admin.component";
import {AdminGuard} from "../../guards/admin.guard";
import {AdminHomeComponent} from "./admin-home/admin-home.component";
import {VaccineManagementComponent} from "./vaccine-management/vaccine-management.component";
import {SiteManagementComponent} from "./site-management/site-management.component";
import {UserSearchComponent} from "./user-search/user-search.component";
import {VaccinationSiteComponent} from "./vaccination-site/vaccination-site.component";
import {VaccinationLocationComponent} from "./vaccination-location/vaccination-location.component";
import {SiteInfoComponent} from "./site-info/site-info.component";
import {VaccinationChartsComponent} from "./vaccination-charts/vaccination-charts.component";

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {path: '', component: AdminHomeComponent},
      {path: 'vaccine', component: VaccineManagementComponent},
      {path: 'site', component: SiteManagementComponent},
      {path: 'site/:id', component: SiteInfoComponent},
      {path: 'user', component: UserSearchComponent},
      {path: 'vaccination/site', component: VaccinationSiteComponent},
      {path: 'vaccination/location', component: VaccinationLocationComponent},
      {path: 'charts', component: VaccinationChartsComponent}
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
