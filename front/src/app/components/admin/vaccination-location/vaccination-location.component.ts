import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Locations} from "../../../locations";
import {MatSelectChange} from "@angular/material/select";
import {MatTableDataSource} from "@angular/material/table";
import {VaccinationLog} from "../../../types";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";
import {UnixToTime} from "../../../utils";

@Component({
  selector: 'app-vaccination-location',
  templateUrl: './vaccination-location.component.html',
  styleUrls: ['./vaccination-location.component.css']
})
export class VaccinationLocationComponent implements OnInit {
  displayColumns: string[] = ['person_id', 'person_name', 'site','vaccine', 'time'];
  vaccinationLogsDataSource = new MatTableDataSource<VaccinationLog>();
  vaccinationDates: Date[] = new Array<Date>();
  locationForm: FormGroup;

  provinces = Locations;
  cities = null;
  districts = null;

  constructor(private api: ApiService,
              private msg: MessageService) {
    this.locationForm = new FormGroup({
      province: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      city: new FormControl(null, {
        updateOn: 'blur'
      }),
      district: new FormControl(null, {
        updateOn: 'blur'
      })
    });
  }

  onProvincesSelectionChange(event: MatSelectChange): void {
    this.cities = event.source.value.children;
    this.districts = null;
  }

  onCitySelectionChange(event: MatSelectChange): void {
    this.districts = event.source.value.children;
  }

  searchVaccinationLogs(): void {
    let province: string;
    let city: string;
    let district: string;
    if (this.locationForm.controls.province.value) {
      province = this.locationForm.controls.province.value.name;
    } else {
      return;
    }
    if (this.locationForm.controls.city.value) {
      city = this.locationForm.controls.city.value.name;
    } else {
      city = '';
    }

    if (this.locationForm.controls.district.value) {
      district = this.locationForm.controls.district.value.name;
    } else {
      district = '';
    }

    this.vaccinationLogsDataSource = new MatTableDataSource<VaccinationLog>();
    this.api.ListVaccinationLogsLocation({
      province: province,
      city: city,
      district: district
    }).subscribe({
      next: listVaccinationLogsP => {
        if (listVaccinationLogsP.vaccinations) {
          this.vaccinationLogsDataSource = new MatTableDataSource<VaccinationLog>(listVaccinationLogsP.vaccinations);
          this.vaccinationDates = new Array<Date>();
          for (let vaccinationLog of listVaccinationLogsP.vaccinations) {
            this.vaccinationDates.push(UnixToTime(vaccinationLog.time));
          }
        }
      },
      error: err => {
        this.msg.SendMessage(`获取接种记录失败: ${err}`);
      }
    })
  }

  ngOnInit(): void {
  }

}
