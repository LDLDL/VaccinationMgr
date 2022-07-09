import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {VaccinationLog, VaccinationLogsP} from "../../../types";
import {UnixToTime} from "../../../utils";
import {EnvironmentService} from "../../../services/environment.service";

@Component({
  selector: 'app-vaccination-logs',
  templateUrl: './vaccination-logs.component.html',
  styleUrls: ['./vaccination-logs.component.css']
})
export class VaccinationLogsComponent implements OnInit {
  vaccinations?: VaccinationLogsP;
  ts: Date[];

  constructor(private api: ApiService, public env: EnvironmentService) {
    this.ts = [];
  }

  ngOnInit(): void {
    this.api.GetVaccinationLogPerson().subscribe(logs => {
      this.vaccinations = logs
      if (logs.vaccinations) {
        for (let vaccination of logs.vaccinations) {
          this.ts.push(UnixToTime(vaccination.time));
        }
      }
    })
  }

}
