import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {SiteComponent} from "./site.component";
import {SiteLoginGuard} from "../../guards/site-login.guard";
import {SiteHomeComponent} from "./site-home/site-home.component";
import {AppointmentsComponent} from "./appointments/appointments.component";
import {ArrangementsComponent} from "./arrangements/arrangements.component";
import {InventoriesComponent} from "./inventories/inventories.component";
import {VaccinationComponent} from "./vaccination/vaccination.component";
import {VaccinationChartsComponent} from "./vaccination-charts/vaccination-charts.component";

const siteRoutes: Routes = [
  {
    path: 'site',
    component: SiteComponent,
    canActivate: [SiteLoginGuard],
    children: [
      {path: '', component: SiteHomeComponent},
      {path: 'appointments', component: AppointmentsComponent},
      {path: 'arrangements', component: ArrangementsComponent},
      {path: 'inventories', component: InventoriesComponent},
      {path: 'vaccination', component: VaccinationComponent},
      {path: 'charts', component: VaccinationChartsComponent}
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(siteRoutes)],
  exports: [RouterModule]
})
export class SiteRoutingModule { }
