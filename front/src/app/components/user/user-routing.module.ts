import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {UserComponent} from "./user.component";
import {UserLoginGuard} from "../../guards/user-login.guard";
import {UserHomeComponent} from "./user-home/user-home.component";
import {MyAppointmentComponent} from "./my-appointment/my-appointment.component";
import {MakeAppointmentComponent} from "./make-appointment/make-appointment.component";
import {VaccinationLogsComponent} from "./vaccination-logs/vaccination-logs.component";

const userRoutes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    canActivate: [UserLoginGuard],
    children: [
      {path: '', component: UserHomeComponent},
      {path: 'appointment/valid', component: MyAppointmentComponent},
      {path: 'appointment', component: MakeAppointmentComponent},
      {path: 'vaccinations', component: VaccinationLogsComponent}
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
