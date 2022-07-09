import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Locations} from "../../../locations";
import {MatSelectChange} from "@angular/material/select";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";

@Component({
  selector: 'app-add-site',
  templateUrl: './add-site.component.html',
  styleUrls: ['./add-site.component.css']
})
export class AddSiteComponent implements OnInit {
  addSiteForm: FormGroup;

  provinces = Locations;
  cities = null;
  districts = null;

  constructor(private api: ApiService,
              private msg: MessageService) {
    this.addSiteForm = new FormGroup({
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
      name: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      address: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      })
    });
  }

  onProvincesSelectionChange(event: MatSelectChange): void {
    this.cities = event.source.value.children;
    this.districts = null;
  }

  onCitySelectionChange(event: MatSelectChange): void {
    this.districts = event.source.value.children;
  }

  addSite(): void {
    this.api.AddSite({
      name: this.addSiteForm.controls.name.value,
      address: this.addSiteForm.controls.address.value,
      province: this.addSiteForm.controls.province.value.name,
      city: this.addSiteForm.controls.city.value.name,
      district: this.addSiteForm.controls.district.value.name
    }).subscribe({
      next: _ => {
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
