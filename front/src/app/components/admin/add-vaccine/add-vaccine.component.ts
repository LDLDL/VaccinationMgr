import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";

@Component({
  selector: 'app-add-vaccine',
  templateUrl: './add-vaccine.component.html',
  styleUrls: ['./add-vaccine.component.css']
})
export class AddVaccineComponent implements OnInit {
  addVaccineForm: FormGroup;

  constructor(private api: ApiService,
              private msg: MessageService) {
    this.addVaccineForm = new FormGroup({
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

  addVaccine(directive: FormGroupDirective): void {
    this.api.AddVaccine({
      type: this.addVaccineForm.controls.type.value,
      manufacturer: this.addVaccineForm.controls.manufacturer.value,
      location: this.addVaccineForm.controls.location.value
    }).subscribe({
      next: _ => {
        this.msg.SendMessage('添加成功');
        this.addVaccineForm.reset();
        directive.reset();
      },
      error: err => {
        this.msg.SendMessage(`添加失败 ${err}`);
        this.addVaccineForm.reset();
        directive.reset();
      }
    });
  }

  ngOnInit(): void {
  }

}
