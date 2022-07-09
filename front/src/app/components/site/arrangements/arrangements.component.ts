import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {AppointmentArrangement, VaccinationSiteAdmin} from "../../../types";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";
import {AuthService} from "../../../services/auth.service";
import {first} from "rxjs/operators";
import {AppointmentTimeToDate, DateToAppointmentTime} from "../../../utils";
import {FormControl, FormGroup} from "@angular/forms";
import {MatSelectChange} from "@angular/material/select";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "../../../dialogs/confirm/confirm.component";
import {EditArrangementComponent} from "../edit-arrangement/edit-arrangement.component";
import {AddArrangementComponent} from "../add-arrangement/add-arrangement.component";

@Component({
  selector: 'app-arrangements',
  templateUrl: './arrangements.component.html',
  styleUrls: ['./arrangements.component.css']
})
export class ArrangementsComponent implements OnInit {
  displayColumns: string[] = ['vaccine', 'total_number', 'booked_number', 'actions'];
  arrangementsDataResource = new MatTableDataSource<AppointmentArrangement>();
  arrangementDates?: Date[];
  dateForm: FormGroup;

  constructor(private api: ApiService,
              private msg: MessageService,
              private auth: AuthService,
              private dialog: MatDialog) {
    this.dateForm = new FormGroup({
      date: new FormControl(null, {
        updateOn: 'blur'
      })
    });
  }

  onDateSelectionChange(event: MatSelectChange): void {
    this.loadArrangements(event.source.value);
  }

  loadArrangementDates(): void {
    this.auth.user$.pipe(first()).subscribe(user => {
      const siteAdmin = (user as VaccinationSiteAdmin);
      this.api.GetArrangementDates(siteAdmin.vaccination_site_id).subscribe({
        next: getArrangementDatesP => {
          if (getArrangementDatesP.dates) {
            this.arrangementDates = new Array<Date>();
            for (let dateUnix of getArrangementDatesP.dates) {
              this.arrangementDates.push(AppointmentTimeToDate(dateUnix));
            }
          } else {
            this.msg.SendMessage('没有预约日期');
          }
        },
        error: err => {
          this.msg.SendMessage(`获取预约日期失败: ${err}`);
        }
      });
    });
  }

  loadArrangements(date: Date): void {
    this.auth.user$.pipe(first()).subscribe(user => {
      const siteAdmin = (user as VaccinationSiteAdmin);
      this.api.ListArrangements({
        vaccination_site_id: siteAdmin.vaccination_site_id,
        date: DateToAppointmentTime(date)
      }).subscribe({
        next: listArrangementsP => {
          if (listArrangementsP.arrangements) {
            this.arrangementsDataResource =
              new MatTableDataSource<AppointmentArrangement>(listArrangementsP.arrangements);
          } else {
            this.dateForm.reset();
            this.arrangementsDataResource = new MatTableDataSource<AppointmentArrangement>();
            this.loadArrangementDates();
          }
        },
        error: err => {
          this.msg.SendMessage(`获取安排列表失败: ${err}`);
        }
      })
    });
  }

  onEditClick(arrangement: AppointmentArrangement): void {
    this.dialog.open(EditArrangementComponent, {
      data: arrangement
    }).afterClosed().subscribe(_ => {
      this.loadArrangements(this.dateForm.controls.date.value);
    });
  }

  onDeleteClick(arrangement: AppointmentArrangement): void {
    this.dialog.open(ConfirmComponent, {
      data: '确定要删除吗?'
    }).afterClosed().subscribe(decision => {
      if (!decision) {
        return;
      }

      this.api.RemoveArrangement({
        vaccine_id: arrangement.vaccine_id,
        date: arrangement.date
      }).subscribe({
        next: _ => {
          this.msg.SendMessage('删除成功');
          this.loadArrangements(this.dateForm.controls.date.value);
        },
        error: err => {
          this.msg.SendMessage(`删除失败; ${err}`);
        }
      });
    });
  }

  addArrangement(): void {
    this.dialog.open(AddArrangementComponent).afterClosed().subscribe(_ => {
      this.loadArrangementDates();
      this.loadArrangements(this.dateForm.controls.date.value);
    });
  }

  ngOnInit(): void {
    this.loadArrangementDates();
  }

}
