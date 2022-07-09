import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {Observable, of} from "rxjs";
import {catchError, first, map} from "rxjs/operators";
import {ApiService} from "../../../services/api.service";
import {EnvironmentService} from "../../../services/environment.service";
import {AuthService} from "../../../services/auth.service";
import {Person, UserType} from "../../../types";
import {BirthdayToUnix, UnixToTime} from "../../../utils";
import {MessageService} from "../../../services/message.service";

@Component({
  selector: 'app-change-profile',
  templateUrl: './change-profile.component.html',
  styleUrls: ['./change-profile.component.css']
})
export class ChangeProfileComponent implements OnInit {
  changeProfileForm: FormGroup;
  sexs = ['男', '女'];
  person?: Person;

  PhoneExistValidator = (
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>=> {
    if (!control.value) {
      return of<null>(null);
    }
    if (control.value === this.person?.phone_number) {
      return of<null>(null);
    }
    return this.api.PhoneNumberExist(control.value).pipe(
      map(exist => exist? {phoneExist: {value: control.value}} : null),
      catchError(_ => of<null>(null))
    );
  }

  constructor(private api: ApiService,
              public env: EnvironmentService,
              private auth: AuthService,
              private msg: MessageService) {
    this.changeProfileForm = new FormGroup({
      name: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      sex: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      birthday: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      phone: new FormControl(null, {
        validators: Validators.required,
        asyncValidators: this.PhoneExistValidator,
        updateOn: 'blur'
      })
    });
    this.auth.user$.pipe(first()).subscribe(user => {
      const userP = (user as Person);
      this.person = userP;
      this.changeProfileForm.controls.name.setValue(userP.name);
      this.changeProfileForm.controls.sex.setValue(userP.sex);
      this.changeProfileForm.controls.phone.setValue(userP.phone_number);
      this.changeProfileForm.controls.birthday.setValue(UnixToTime(userP.birthday));
    });
  }

  changeProfile(directive: FormGroupDirective): void {
    this.api.ChangeProfile({
      name: this.changeProfileForm.controls.name.value,
      sex: this.changeProfileForm.controls.sex.value,
      phone_number: this.changeProfileForm.controls.phone.value,
      birthday: BirthdayToUnix(this.changeProfileForm.controls.birthday.value)
    }).subscribe({
      next: _ => {
        this.msg.SendMessage('修改成功');
        this.api.GetUser().subscribe(person => {
          this.auth.updateUser(person, UserType.Person).subscribe(_ => {
            location.reload();
          });
        });
      },
      error: err => {
        this.msg.SendMessage(`修改失败: ${err}`);
        this.changeProfileForm.reset();
        directive.resetForm();
      }
    });
  }

  ngOnInit(): void {
  }

}
