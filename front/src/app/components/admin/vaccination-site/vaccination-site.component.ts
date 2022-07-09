import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {VaccinationLog} from "../../../types";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";
import {UnixToTime} from "../../../utils";

@Component({
  selector: 'app-vaccination-site',
  templateUrl: './vaccination-site.component.html',
  styleUrls: ['./vaccination-site.component.css']
})
export class VaccinationSiteComponent implements OnInit {
  displayColumns: string[] = ['person_id', 'person_name', 'site','vaccine', 'time'];
  vaccinationLogsDataSource = new MatTableDataSource<VaccinationLog>();
  vaccinationDates: Date[] = new Array<Date>();
  siteForm: FormGroup;

  constructor(private api: ApiService,
              private msg: MessageService) {
    this.siteForm = new FormGroup({
      site_id: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      })
    });
  }

  searchVaccinationLogs(): void {
    this.vaccinationLogsDataSource = new MatTableDataSource<VaccinationLog>();
    this.api.ListVaccinationLogsSite(
      this.siteForm.controls.site_id.value
    ).subscribe({
      next: listVaccinationLogsP => {
        if(listVaccinationLogsP.vaccinations) {
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
    });
  }

  ngOnInit(): void {
  }

}
