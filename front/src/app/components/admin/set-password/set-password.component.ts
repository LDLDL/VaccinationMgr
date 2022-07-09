import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Person} from "../../../types";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {
  setPasswordForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public user: Person,
              private api: ApiService,
              private msg: MessageService) {
    this.setPasswordForm = new FormGroup({
      password: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      })
    });
  }

  setPassword(): void {
    this.api.SetPersonPassword({
      id_number: this.user.id_number,
      password: this.setPasswordForm.controls.password.value
    }).subscribe({
      next: _ => {
        this.msg.SendMessage('修改成功');
      },
      error: err => {
        this.msg.SendMessage(`修改失败: ${err}`);
      }
    });
  }

  ngOnInit(): void {
  }

}
