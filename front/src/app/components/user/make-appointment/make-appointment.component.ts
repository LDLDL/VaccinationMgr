import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {InfoComponent} from "../../../dialogs/info/info.component";
import {Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Locations} from "../../../locations";
import {MatSelectChange} from "@angular/material/select";
import {AppointmentArrangement, VaccinationSite} from "../../../types";
import {MessageService} from "../../../services/message.service";
import {EnvironmentService} from "../../../services/environment.service";
import {AppointmentTimeToDate, DateToAppointmentTime} from "../../../utils";

@Component({
  selector: 'app-make-appointment',
  templateUrl: './make-appointment.component.html',
  styleUrls: ['./make-appointment.component.css']
})
export class MakeAppointmentComponent implements OnInit {
  locationForm: FormGroup;
  siteForm: FormGroup;
  dateForm: FormGroup;
  vaccineForm: FormGroup;

  provinces = Locations;
  cities = null;
  districts = null;

  sites?: VaccinationSite[];
  dates?: Date[];
  arrangements?: AppointmentArrangement[];

  constructor(private dialog: MatDialog,
              private router: Router,
              private api: ApiService,
              private _fromBuilder: FormBuilder,
              private msg: MessageService,
              public env: EnvironmentService) {
    this.locationForm = this._fromBuilder.group({
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
      })
    });
    this.siteForm = this._fromBuilder.group({
      vaccinationSite: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      })
    });

    this.dateForm = this._fromBuilder.group({
      date: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      })
    });
    this.vaccineForm = this._fromBuilder.group({
      vaccine: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      })
    });
  }

  makeAppointment(): void {
    this.api.MakeAppointment({
      vaccine_id: this.vaccineForm.controls.vaccine.value.vaccine_id,
      vaccination_site_id: this.vaccineForm.controls.vaccine.value.vaccination_site_id,
      date: this.vaccineForm.controls.vaccine.value.date
    }).subscribe({
      next: _ => {
        this.msg.SendMessage('预约成功');
        this.router.navigateByUrl('/user/appointment/valid').then();
      },
      error: err => {
        this.msg.SendMessage(`预约失败: ${err}`);
        this.vaccineForm.reset();
        this.dateForm.reset();
        this.siteForm.reset();
        this.locationForm.reset();
      }
    })
  }

  onProvincesSelectionChange(event: MatSelectChange): void {
    this.cities = event.source.value.children;
    this.districts = null;
  }

  onCitySelectionChange(event: MatSelectChange): void {
    this.districts = event.source.value.children;
  }

  onDistrictSelectionChange(event: MatSelectChange): void {
    this.sites = undefined;
    this.siteForm.reset();
    this.api.ListSites({
      province: this.locationForm.controls.province.value.name,
      city: this.locationForm.controls.city.value.name,
      district: event.source.value.name
    }).subscribe({
      next: listSitesP => {
        if (listSitesP.vaccination_sites) {
          this.sites = listSitesP.vaccination_sites;
        } else {
          this.msg.SendMessage('该地区没有站点');
        }
      },
      error: err => {
        this.msg.SendMessage(`获取站点信息失败 ${err}`);
      }
    });
  }

  onSiteSelectionChange(event: MatSelectChange): void {
    this.dates = new Array<Date>();
    this.dateForm.reset();
    this.api.GetArrangementDates(event.source.value.id).subscribe({
      next: getArrangementDatesP => {
        if (getArrangementDatesP.dates) {
          for (let date of getArrangementDatesP.dates) {
            this.dates?.push(AppointmentTimeToDate(date));
          }
        } else {
          this.msg.SendMessage('该站点没有可预约的日期');
        }
      },
      error: err => {
        this.msg.SendMessage(`获取可预约日期失败: ${err}`);
      }
    })
  }

  onDateSelectionChange(event: MatSelectChange): void {
    this.arrangements = new Array<AppointmentArrangement>();
    this.vaccineForm.reset();
    this.api.ListArrangements({
      vaccination_site_id: this.siteForm.controls.vaccinationSite.value.id,
      date: DateToAppointmentTime(event.source.value)
    }).subscribe({
      next: listArrangements => {
        if (listArrangements.arrangements) {
          for (let arrangement of listArrangements.arrangements) {
            this.arrangements?.push(arrangement);
          }
        } else {
          this.msg.SendMessage('该日期没有可预约疫苗');
        }
      },
      error: err => {
        this.msg.SendMessage(`获取可预约疫苗失败: ${err}`);
      }
    });
  }

  ngOnInit(): void {
    this.api.ListAppointmentsPerson().subscribe(appointments => {
      if (appointments.available) {
        this.dialog.open(InfoComponent, {
          data: '您已有有效的预约，请预约失效后再进行新的预约'
        }).afterClosed().subscribe(_ => {
          this.router.navigateByUrl('/user').then();
        });
      }
    })
  }

}
