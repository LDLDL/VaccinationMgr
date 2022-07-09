import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SiteComponent} from "./site.component";
import { SiteHomeComponent } from './site-home/site-home.component';
import {SiteRoutingModule} from "./site-routing.module";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import { AppointmentsComponent } from './appointments/appointments.component';
import { ArrangementsComponent } from './arrangements/arrangements.component';
import { InventoriesComponent } from './inventories/inventories.component';
import { VaccinationComponent } from './vaccination/vaccination.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import { EditInventoryComponent } from './edit-inventory/edit-inventory.component';
import {MatDialogModule} from "@angular/material/dialog";
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { AddArrangementComponent } from './add-arrangement/add-arrangement.component';
import { EditArrangementComponent } from './edit-arrangement/edit-arrangement.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import { VaccinationByAppointmentComponent } from './vaccination-by-appointment/vaccination-by-appointment.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { VaccinationChartsComponent } from './vaccination-charts/vaccination-charts.component';
import {MatTabsModule} from "@angular/material/tabs";
import {NgxEchartsModule} from "ngx-echarts";


@NgModule({
  declarations: [
    SiteComponent,
    SiteHomeComponent,
    AppointmentsComponent,
    ArrangementsComponent,
    InventoriesComponent,
    VaccinationComponent,
    EditInventoryComponent,
    AddInventoryComponent,
    AddArrangementComponent,
    EditArrangementComponent,
    VaccinationByAppointmentComponent,
    VaccinationChartsComponent,
  ],
  imports: [
    CommonModule,
    SiteRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    FormsModule,
    MatTabsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ]
})
export class SiteModule { }
