import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Locations} from "../../../locations";
import {MatSelectChange} from "@angular/material/select";
import {MatTableDataSource} from "@angular/material/table";
import {VaccinationSite} from "../../../types";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";
import {MatDialog} from "@angular/material/dialog";
import {AddSiteComponent} from "../add-site/add-site.component";

@Component({
  selector: 'app-site-management',
  templateUrl: './site-management.component.html',
  styleUrls: ['./site-management.component.css']
})
export class SiteManagementComponent implements OnInit {
  displayColumns: string[] = ['id', 'location', 'name', 'address'];
  siteDataSource = new MatTableDataSource<VaccinationSite>();
  locationForm: FormGroup;

  provinces = Locations;
  cities = null;
  districts = null;

  constructor(private api: ApiService,
              private msg: MessageService,
              private dialog: MatDialog) {
    this.locationForm = new FormGroup({
      province: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      city: new FormControl(null, {
        updateOn: 'blur'
      }),
      district: new FormControl(null, {
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

  searchSites(): void {
    let province: string;
    let city: string;
    let district: string;
    if (this.locationForm.controls.province.value) {
      province = this.locationForm.controls.province.value.name;
    } else {
      return;
    }
    if (this.locationForm.controls.city.value) {
      city = this.locationForm.controls.city.value.name;
    } else {
      city = '';
    }

    if (this.locationForm.controls.district.value) {
      district = this.locationForm.controls.district.value.name;
    } else {
      district = '';
    }
    this.siteDataSource = new MatTableDataSource<VaccinationSite>();
    this.api.ListSites({
      province: province,
      city: city,
      district: district
    }).subscribe({
      next: listSitesP => {
        if (listSitesP.vaccination_sites) {
          this.siteDataSource = new MatTableDataSource<VaccinationSite>(listSitesP.vaccination_sites);
        }
      },
      error: err => {
        this.msg.SendMessage(`获取站点信息失败: ${err}`);
      }
    });
  }

  addSite(): void {
    this.dialog.open(AddSiteComponent).afterClosed().subscribe(_ => {
      this.searchSites();
    });
  }

  ngOnInit(): void {
  }

}
