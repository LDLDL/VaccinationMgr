import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Person, VaccinationLog, Vaccine} from "../../../types";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";
import {EnvironmentService} from "../../../services/environment.service";
import {UnixToTime} from "../../../utils";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "../../../dialogs/confirm/confirm.component";
import {SetPasswordComponent} from "../set-password/set-password.component";

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {
  userSearchForm: FormGroup;
  user?: Person;
  birthday?: Date;
  vaccinationLogs?: VaccinationLog[];
  ts: Date[];

  constructor(private api: ApiService,
              private msg: MessageService,
              public env: EnvironmentService,
              private dialog: MatDialog) {
    this.ts = [];
    this.userSearchForm = new FormGroup({
      id_number: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      })
    });
  }

  searchUser(): void {
    this.api.GetPerson(
      this.userSearchForm.controls.id_number.value
    ).subscribe({
      next: person => {
        this.user = person;
        this.birthday = UnixToTime(person.birthday);
      },
      error: err => {
        this.msg.SendMessage(`获取用户信息失败: ${err}`);
      }
    });

    this.api.ListVaccinationLogsPersonAdmin(
      this.userSearchForm.controls.id_number.value
    ).subscribe({
      next: vaccinationLogsP => {
        if (vaccinationLogsP.vaccinations) {
          this.vaccinationLogs = vaccinationLogsP.vaccinations;
          for (let vaccination of this.vaccinationLogs) {
            this.ts.push(UnixToTime(vaccination.time));
          }
        }
      },
      error: err => {
        this.msg.SendMessage(`获取用户接种记录失败: ${err}`);
      }
    });
  }

  onSetPasswordClick(): void {
    this.dialog.open(SetPasswordComponent, {
      data: this.user
    }).afterClosed().subscribe();
  }

  onUserDeleteClick(): void {
    this.dialog.open(ConfirmComponent, {
      data: '确定要删除吗?'
    }).afterClosed().subscribe(decision => {
      if (!decision) {
        return
      }

      if (this.user) {
        this.api.RemovePerson(
          this.user.id_number
        ).subscribe({
          next: _ => {
            this.msg.SendMessage('删除成功');
            this.searchUser();
          },
          error: err => {
            this.msg.SendMessage(`删除失败: ${err}`);
          }
        });
      }
    });
  }

  onVaccinationDeleteClick(vaccination: VaccinationLog): void {
    this.dialog.open(ConfirmComponent, {
      data: '确定要删除吗?'
    }).afterClosed().subscribe(decision => {
      if (!decision) {
        return
      }

      this.api.RemoveVaccinationLogAdmin(
        vaccination.id
      ).subscribe({
        next: _ => {
          this.msg.SendMessage('删除成功');
          this.searchUser();
        },
        error: err => {
          this.msg.SendMessage(`删除失败: ${err}`);
        }
      });
    });
  }

  ngOnInit(): void {
  }

}
