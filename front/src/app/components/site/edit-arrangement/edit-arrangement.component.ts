import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {AppointmentArrangement} from "../../../types";

@Component({
  selector: 'app-edit-arrangement',
  templateUrl: './edit-arrangement.component.html',
  styleUrls: ['./edit-arrangement.component.css']
})
export class EditArrangementComponent implements OnInit {
  editArrangementForm: FormGroup;

  constructor(private api: ApiService,
              private msg: MessageService,
              @Inject(MAT_DIALOG_DATA) public data: AppointmentArrangement) {
    this.editArrangementForm = new FormGroup({
      number: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      })
    });
  }

  setArrangement(directive: FormGroupDirective): void {
    this.api.SetArrangement({
      date: this.data.date,
      vaccine_id: this.data.vaccine_id,
      total_number: this.editArrangementForm.controls.number.value
    }).subscribe({
      next: _ => {
        this.msg.SendMessage('更改成功');
      },
      error: err => {
        this.msg.SendMessage(`更改失败 ${err}`);
        this.editArrangementForm.reset();
        directive.resetForm();
        this.editArrangementForm.controls.number.setValue(this.data.total_number);
      }
    });
  }

  ngOnInit(): void {
    this.editArrangementForm.controls.number.setValue(this.data.total_number);
  }

}
