import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";
import {ErrorStateMatcher} from "@angular/material/core";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;

  passwordVisible = false;
  passwordErrorStateMatcher = new RepeatedErrorStateMatcher();

  constructor(private api: ApiService,
              private msg: MessageService,
              private auth: AuthService,
              private router: Router) {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      password: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      passwordConfirm: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
    }, {
      validators: this.PasswordIdenticalValidator,
    });
  }

  PasswordIdenticalValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value.password;
    const passwordConfirm = control.value.passwordConfirm;
    return password && passwordConfirm && password === passwordConfirm ? null : {passwordMismatch: true};
  }

  changePassword(directive: FormGroupDirective): void {
    this.api.ChangePasswordPerson({
      old_password: this.changePasswordForm.controls.oldPassword.value,
      new_password: this.changePasswordForm.controls.password.value
    }).subscribe({
      next: _ => {
        this.msg.SendMessage('修改成功，请重新登录');
        this.auth.clear().subscribe(_ => {
          this.router.navigateByUrl('/login').then();
        });
      },
      error: err => {
        this.msg.SendMessage(`修改失败: ${err}`);
        this.changePasswordForm.reset();
        directive.resetForm();
      }
    });
  }

  ngOnInit(): void {
  }

}

export class RepeatedErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control?.value && form?.hasError('passwordMismatch'));
  }
}
