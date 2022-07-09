import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {MessageService} from "../../../services/message.service";
import {ApiService} from "../../../services/api.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Vaccine} from "../../../types";

@Component({
  selector: 'app-edit-vaccine',
  templateUrl: './edit-vaccine.component.html',
  styleUrls: ['./edit-vaccine.component.css']
})
export class EditVaccineComponent implements OnInit {
  editVaccineForm: FormGroup;

  constructor(private msg: MessageService,
              private api: ApiService,
              @Inject(MAT_DIALOG_DATA) public data: Vaccine) {
    this.editVaccineForm = new FormGroup({
      manufacturer: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      type: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      location: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      })
    });
  }

  editVaccine(directive: FormGroupDirective): void {
    this.api.SetVaccine({
      id: this.data.id,
      type: this.editVaccineForm.controls.type.value,
      manufacturer: this.editVaccineForm.controls.manufacturer.value,
      location: this.editVaccineForm.controls.location.value
    }).subscribe({
      next: _ => {
        this.msg.SendMessage('修改成功');
        this.editVaccineForm.reset();
        directive.reset();
      },
      error: err => {
        this.msg.SendMessage(`修改失败: ${err}`);
        this.editVaccineForm.reset();
        directive.reset();
      }
    })
  }

  ngOnInit(): void {
    this.editVaccineForm.controls.manufacturer.setValue(this.data.manufacturer);
    this.editVaccineForm.controls.type.setValue(this.data.type);
    this.editVaccineForm.controls.location.setValue(this.data.location);
  }

}
