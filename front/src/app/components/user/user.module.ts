import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserHomeComponent } from './user-home/user-home.component';
import {UserRoutingModule} from "./user-routing.module";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatMenuModule} from "@angular/material/menu";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import { MyAppointmentComponent } from './my-appointment/my-appointment.component';
import { MakeAppointmentComponent } from './make-appointment/make-appointment.component';
import { VaccinationLogsComponent } from './vaccination-logs/vaccination-logs.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import {MatDialogModule} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { ChangeProfileComponent } from './change-profile/change-profile.component';
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatStepperModule} from "@angular/material/stepper";
import {MatTabsModule} from "@angular/material/tabs";



@NgModule({
  declarations: [
    UserComponent,
    UserHomeComponent,
    MyAppointmentComponent,
    MakeAppointmentComponent,
    VaccinationLogsComponent,
    ChangePasswordComponent,
    ChangeProfileComponent,
  ],
    imports: [
        CommonModule,
        UserRoutingModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatSidenavModule,
        MatMenuModule,
        MatListModule,
        MatCardModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatStepperModule,
        MatTabsModule
    ]
})
export class UserModule { }
