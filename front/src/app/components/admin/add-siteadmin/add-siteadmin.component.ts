import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {VaccinationSite} from "../../../types";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Component({
  selector: 'app-add-siteadmin',
  templateUrl: './add-siteadmin.component.html',
  styleUrls: ['./add-siteadmin.component.css']
})
export class AddSiteadminComponent implements OnInit {
  addSiteAdminForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) private data: VaccinationSite,
              private api: ApiService,
              private msg: MessageService) {
    this.addSiteAdminForm = new FormGroup({
      account: new FormControl(null, {
        validators: Validators.required,
        asyncValidators: this.AccountExistValidator,
        updateOn: 'blur'
      }),
      name: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      phone: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      password: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      })
    });
  }

  AccountExistValidator = (
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>=> {
    if (!control.value) {
      return of<null>(null);
    }

    return this.api.SiteAdminExist(control.value).pipe(
      map(exist => exist? {accountExist: {value: control.value}} : null),
      catchError(_ => of<null>(null))
    );
  }

  addSiteAdmin(): void {
    this.api.AddSiteAdmin({
      vaccination_site_id: this.data.id,
      name: this.addSiteAdminForm.controls.name.value,
      phone: this.addSiteAdminForm.controls.phone.value,
      account: this.addSiteAdminForm.controls.account.value,
      password: this.addSiteAdminForm.controls.password.value
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
