import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {ListAppointmentPersonP} from "../../../types";
import {AppointmentTimeToDate} from "../../../utils";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "../../../dialogs/confirm/confirm.component";
import {MessageService} from "../../../services/message.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-appointment',
  templateUrl: './my-appointment.component.html',
  styleUrls: ['./my-appointment.component.css']
})
export class MyAppointmentComponent implements OnInit {
  appointment?: ListAppointmentPersonP;
  appointmentDate?: Date;
  historyDates: Date[];

  constructor(private api: ApiService,
              private dialog: MatDialog,
              private msg: MessageService,
              private router: Router) {
    this.historyDates = new Array<Date>();
  }

  cancelAppointment(): void {
    this.dialog.open(ConfirmComponent, {
      data: '确定要取消预约吗?'
    }).afterClosed().subscribe(decision => {
      if (!decision) {
        return;
      }

      if (this.appointment) {
        if (this.appointment.available) {
          console.log(this.appointment.available.id);
          this.api.RemoveAppointment(this.appointment.available.id).subscribe({
            next: _ => {
              this.msg.SendMessage('取消成功');
              this.router.navigateByUrl('/user').then();
            },
            error: err => {
              this.msg.SendMessage(`取消失败: ${err}`);
            }
          });
        } else {
          this.msg.SendMessage('取消失败');
        }
      } else {
        this.msg.SendMessage('取消失败');
      }
    });
  }

  ngOnInit(): void {
    this.api.ListAppointmentsPerson().subscribe(appointments => {
      this.appointment = appointments
      if (appointments.available) {
        this.appointmentDate = AppointmentTimeToDate(appointments.available.date);
      }

      if (appointments.history) {
        for (let history of appointments.history) {
          this.historyDates.push(AppointmentTimeToDate(history.date));
        }
      }
    });
  }

}
