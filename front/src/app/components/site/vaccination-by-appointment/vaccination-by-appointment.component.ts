import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {VaccinationAppointment, VaccineInventory} from "../../../types";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-vaccination-by-appointment',
  templateUrl: './vaccination-by-appointment.component.html',
  styleUrls: ['./vaccination-by-appointment.component.css']
})
export class VaccinationByAppointmentComponent implements OnInit {
  vaccinationForm: FormGroup;
  appointmentInventory?: VaccineInventory;

  constructor(private api: ApiService,
              private msg: MessageService,
              @Inject(MAT_DIALOG_DATA) public appointment: VaccinationAppointment) {
    this.loadInventories();
    if (this.appointment.vaccine) {
      this.vaccinationForm = new FormGroup({
        vaccine: new FormControl(
          {value: this.appointment.vaccine.manufacturer + this.appointment.vaccine.type, disabled: true},
          {
            validators: Validators.required,
            updateOn: 'blur'
          }),
        vaccinationTimes: new FormControl(null, {
          validators: Validators.required,
          updateOn: 'blur'
        })
      });
    } else {
      this.vaccinationForm = new FormGroup({
        vaccine: new FormControl(
          {value: "", disabled: true},
          {
            validators: Validators.required,
            updateOn: 'blur'
          }),
        vaccinationTimes: new FormControl(null, {
          validators: Validators.required,
          updateOn: 'blur'
        })
      });
    }
  }

  loadInventories(): void {
    this.api.ListInventoriesSite().subscribe({
      next: listInventoriesP => {
        if (listInventoriesP.inventories) {
          for (let inventory of listInventoriesP.inventories) {
            if (inventory.vaccine_id === this.appointment.vaccine_id) {
              this.appointmentInventory = inventory;
              return;
            }
          }
        }
      },
      error: err => {
        this.msg.SendMessage(`获取库存信息失败: ${err}`);
      }
    });
  }

  addVaccinations(directive: FormGroupDirective): void {
    this.api.AddVaccinationLogSiteByAppointment({
      appointment_id: this.appointment.id,
      vaccination_times: this.vaccinationForm.controls.vaccinationTimes.value
    }).subscribe({
      next: _ => {
        directive.resetForm();
        this.vaccinationForm.reset();
        this.msg.SendMessage('添加成功');
      },
      error: err => {
        this.msg.SendMessage(`添加失败: ${err}`);
      }
    });
  }

  ngOnInit(): void {

  }

}
