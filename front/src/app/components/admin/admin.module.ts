import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import {AdminComponent} from "./admin.component";
import {AdminRoutingModule} from "./admin-routing.module";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatMenuModule} from "@angular/material/menu";
import { SiteManagementComponent } from './site-management/site-management.component';
import { VaccineManagementComponent } from './vaccine-management/vaccine-management.component';
import { UserSearchComponent } from './user-search/user-search.component';
import {MatTableModule} from "@angular/material/table";
import { AddVaccineComponent } from './add-vaccine/add-vaccine.component';
import {MatDialogModule} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { EditVaccineComponent } from './edit-vaccine/edit-vaccine.component';
import {MatTabsModule} from "@angular/material/tabs";
import { VaccinationSiteComponent } from './vaccination-site/vaccination-site.component';
import { VaccinationLocationComponent } from './vaccination-location/vaccination-location.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { SiteInfoComponent } from './site-info/site-info.component';
import {MatSelectModule} from "@angular/material/select";
import { AddSiteComponent } from './add-site/add-site.component';
import { AddSiteadminComponent } from './add-siteadmin/add-siteadmin.component';
import { SetSiteadminPasswordComponent } from './set-siteadmin-password/set-siteadmin-password.component';
import { SetSiteComponent } from './set-site/set-site.component';
import { VaccinationChartsComponent } from './vaccination-charts/vaccination-charts.component';
import {NgxEchartsModule} from "ngx-echarts";



@NgModule({
  declarations: [
    AdminComponent,
    AdminHomeComponent,
    SiteManagementComponent,
    VaccineManagementComponent,
    UserSearchComponent,
    AddVaccineComponent,
    EditVaccineComponent,
    VaccinationSiteComponent,
    VaccinationLocationComponent,
    SetPasswordComponent,
    SiteInfoComponent,
    AddSiteComponent,
    AddSiteadminComponent,
    SetSiteadminPasswordComponent,
    SetSiteComponent,
    VaccinationChartsComponent,
  ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        MatSidenavModule,
        MatCardModule,
        MatIconModule,
        MatDividerModule,
        MatListModule,
        MatToolbarModule,
        MatButtonModule,
        MatTooltipModule,
        MatMenuModule,
        MatTableModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        MatSelectModule,
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts')
        })
    ]
})
export class AdminModule { }
