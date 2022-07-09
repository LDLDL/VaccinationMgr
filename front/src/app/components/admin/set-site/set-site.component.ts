import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {VaccinationSite} from "../../../types";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";
import {MatSelectChange} from "@angular/material/select";
import {Locations} from "../../../locations";

@Component({
  selector: 'app-set-site',
  templateUrl: './set-site.component.html',
  styleUrls: ['./set-site.component.css']
})
export class SetSiteComponent implements OnInit {
  setSiteForm: FormGroup;

  provinces = Locations;
  cities: any = null;
  districts: any = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: VaccinationSite,
              private api: ApiService,
              private msg: MessageService) {
    this.setSiteForm = new FormGroup({
      name: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      province: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      city: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      district: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      address: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      })
    })
  }

  onProvincesSelectionChange(event: MatSelectChange): void {
    this.cities = event.source.value.children;
    this.districts = null;
  }

  onCitySelectionChange(event: MatSelectChange): void {
    this.districts = event.source.value.children;
  }

  setSite(): void {
    this.api.SetSite({
      id: this.data.id,
      name: this.setSiteForm.controls.name.value,
      province: this.setSiteForm.controls.province.value.name,
      city: this.setSiteForm.controls.city.value.name,
      district: this.setSiteForm.controls.district.value.name,
      address: this.setSiteForm.controls.address.value
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
    this.setSiteForm.controls.name.setValue(this.data.name);
    this.setSiteForm.controls.address.setValue(this.data.address);
    for (let p of this.provinces) {
      if (this.data.province === p.name) {
        this.setSiteForm.controls.province.setValue(p);
        this.cities = p.children;
        for (let c of p.children) {
          if (this.data.city === c.name) {
            this.setSiteForm.controls.city.setValue(c);
            this.districts = c.children;
            for (let d of c.children) {
              if (this.data.district === d.name) {
                this.setSiteForm.controls.district.setValue(d);
              }
            }
          }
        }
      }
    }
  }
}
