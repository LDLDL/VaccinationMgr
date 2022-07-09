import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {AppointmentArrangement, VaccinationSiteAdmin, Vaccine} from "../../../types";
import {ApiService} from "../../../services/api.service";
import {AuthService} from "../../../services/auth.service";
import {MessageService} from "../../../services/message.service";
import {first} from "rxjs/operators";
import {DateToAppointmentTime} from "../../../utils";
import {EnvironmentService} from "../../../services/environment.service";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";

@Component({
  selector: 'app-add-arrangement',
  templateUrl: './add-arrangement.component.html',
  styleUrls: ['./add-arrangement.component.css']
})
export class AddArrangementComponent implements OnInit {
  addArrangementForm: FormGroup;

  minDate: Date;
  maxDate: Date;

  arrangementDate?: Date;

  arrangements?: AppointmentArrangement[];
  vaccines: Vaccine[];
  vaccinesNoArrangement?: Vaccine[];

  constructor(private api: ApiService,
              private auth: AuthService,
              private msg: MessageService,
              public env: EnvironmentService) {
    const currentDate = new Date();
    this.minDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,0,0
    );
    this.maxDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,0,0
    );
    this.maxDate.setDate(this.minDate.getDate() + 30);
    this.vaccines = new Array<Vaccine>();
    this.addArrangementForm = new FormGroup({
      date: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      vaccine: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      total_number: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      })
    });
  }

  loadArrangement(date: Date): void {
    this.auth.user$.pipe(first()).subscribe(user => {
      const siteAdmin = (user as VaccinationSiteAdmin);
      this.api.ListArrangements({
        vaccination_site_id: siteAdmin.vaccination_site_id,
        date: DateToAppointmentTime(date)
      }).subscribe({
        next: listArrangementP => {
          if (listArrangementP.arrangements) {
            this.arrangements = listArrangementP.arrangements;
            this.vaccinesNoArrangement = new Array<Vaccine>();
            for (let vaccine of this.vaccines) {
              if (!this.hasArrangement(vaccine)) {
                this.vaccinesNoArrangement.push(vaccine);
              }
            }
          } else {
            this.vaccinesNoArrangement = this.vaccines;
          }
        },
        error: err => {
          this.msg.SendMessage(`获取预约安排失败: ${err}`);
        }
      });
    });
  }

  hasArrangement(vaccine: Vaccine): boolean {
    if (this.arrangements) {
      for (let arrangement of this.arrangements) {
        if (vaccine.id === arrangement.vaccine_id) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this.arrangementDate = new Date(
        event.value.getFullYear(),
        event.value.getMonth(),
        event.value.getDate(),
        23,
        59,
        59
      );

      this.loadArrangement(this.arrangementDate);
    }
  }

  addArrangement(directive: FormGroupDirective): void {
    if (this.arrangementDate) {
      this.api.AddArrangement({
        date: DateToAppointmentTime(this.arrangementDate),
        vaccine_id: this.addArrangementForm.controls.vaccine.value.id,
        total_number: this.addArrangementForm.controls.total_number.value
      }).subscribe({
        next: _ => {
          this.msg.SendMessage('添加成功');
          this.addArrangementForm.reset();
          directive.reset();
        },
        error: err => {
          this.msg.SendMessage(`添加失败: ${err}`);
          this.addArrangementForm.reset();
          directive.reset();
        }
      });
    }
  }

  ngOnInit(): void {
    this.api.ListVaccines().subscribe({
      next: listVaccineP => {
        if (listVaccineP.vaccines) {
          this.vaccines = listVaccineP.vaccines;
        }
         else {
          this.msg.SendMessage('加载疫苗列表失败');
        }
      },
      error: err => {
        this.msg.SendMessage(`加载疫苗列表失败: ${err}`);
      }
    });
  }

}
