import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {VaccineInventory} from "../../../types";
import {MessageService} from "../../../services/message.service";

@Component({
  selector: 'app-vaccination',
  templateUrl: './vaccination.component.html',
  styleUrls: ['./vaccination.component.css']
})
export class VaccinationComponent implements OnInit {
  vaccinationForm: FormGroup;
  inventories?: VaccineInventory[];

  constructor(private api: ApiService,
              private msg: MessageService) {
    this.vaccinationForm = new FormGroup({
      personIdNumber: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      vaccine: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      vaccinationTimes: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      })
    });
  }

  updateInventories(): void {
    this.api.ListInventoriesSite().subscribe({
      next: listInventoriesP => {
        if (listInventoriesP.inventories) {
          this.inventories = listInventoriesP.inventories;
        } else {
          this.msg.SendMessage('没有库存');
        }
      },
      error: err => {
        this.msg.SendMessage(`获取库存信息失败: ${err}`);
      }
    });
  }

  addVaccinations(directive: FormGroupDirective): void {
    this.api.AddVaccinationLogSite({
      person_id_number: this.vaccinationForm.controls.personIdNumber.value,
      vaccination_times: this.vaccinationForm.controls.vaccinationTimes.value,
      vaccine_id: this.vaccinationForm.controls.vaccine.value.vaccine_id,
    }).subscribe({
      next: _ => {
        directive.resetForm();
        this.vaccinationForm.reset();
        this.updateInventories();
        this.msg.SendMessage('添加成功');
      },
      error: err => {
        this.msg.SendMessage(`添加失败: ${err}`);
      }
    });
  }

  ngOnInit(): void {
    this.updateInventories();
  }

}
