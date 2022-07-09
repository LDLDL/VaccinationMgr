import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {Observable, of, Subject} from "rxjs";
import {ApiService} from "../../services/api.service";
import {AuthService} from "../../services/auth.service";
import {MessageService} from "../../services/message.service";
import {Router} from "@angular/router";
import {ErrorStateMatcher} from "@angular/material/core";
import {catchError, map} from "rxjs/operators";
import {BirthdayToUnix} from "../../utils";
import {EnvironmentService} from "../../services/environment.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  readonly destroy$: Subject<void>;

  passwordVisible = false;
  passwordErrorStateMatcher = new RepeatedErrorStateMatcher();
  sexs = ['男', '女'];

  constructor(private api: ApiService,
    private auth: AuthService,
    private msg: MessageService,
    private router: Router,
    public env: EnvironmentService) {
    this.destroy$ = new Subject<void>();

    this.registerForm = new FormGroup({
      name: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      idNumber: new FormControl(null,{
        validators: Validators.required,
        asyncValidators: this.IDNumberExistValidator,
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
    }, {
      validators: this.PasswordIdenticalValidator,
    });
  }

  PasswordIdenticalValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value.password;
    const passwordConfirm = control.value.passwordConfirm;
    return password && passwordConfirm && password === passwordConfirm ? null : {passwordMismatch: true};
  }

  IDNumberExistValidator = (
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>=> {
      if (!control.value) {
        return of<null>(null);
      }
      return this.api.PersonExist(control.value).pipe(
        map(exist => exist ? {userExist: {value: control.value}} : null),
        catchError(_ => of<null>(null))
      );
  }

  PhoneExistValidator = (
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>=> {
    if (!control.value) {
      return of<null>(null);
    }
    return this.api.PhoneNumberExist(control.value).pipe(
      map(exist => exist? {phoneExist: {value: control.value}} : null),
      catchError(_ => of<null>(null))
    );
  }

  register(directive: FormGroupDirective): void {
    this.api.Register({
      name: this.registerForm.controls.name.value,
      password: this.registerForm.controls.password.value,
      id_number: this.registerForm.controls.idNumber.value,
      sex: this.registerForm.controls.sex.value,
      phone_number: this.registerForm.controls.phone.value,
      birthday: BirthdayToUnix(this.registerForm.controls.birthday.value)
    }).subscribe({
      next: _ => {
        this.msg.SendMessage('注册成功，前往登录');
        this.router.navigateByUrl('/login').then();
      },
      error: e => {
        this.msg.SendMessage(`注册失败: ${e}`);
        this.registerForm.reset();
        directive.resetForm();
      }
    });
  }

  ngOnInit(): void {
    this.registerForm.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

}

export class RepeatedErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control?.value && form?.hasError('passwordMismatch'));
  }
}
