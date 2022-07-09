import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {ApiService} from "../../services/api.service";
import {AuthService} from "../../services/auth.service";
import {UserType} from "../../types";
import {MessageService} from "../../services/message.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit, OnDestroy {
  constructor(private api: ApiService,
              private auth: AuthService,
              private msg: MessageService,
              private router: Router) {
    this.destroy$ = new Subject<void>();
  }

  loginForm = new FormGroup({
    idNumber: new FormControl('', {
      validators: Validators.required,
      updateOn: 'blur'
    }),
    password: new FormControl('', {
      validators: Validators.required,
      updateOn: 'blur'
    })
  });
  readonly destroy$: Subject<void>;

  login(directive: FormGroupDirective): void {
    this.api.PersonLogin({
      id_number: this.loginForm.controls.idNumber.value,
      password: this.loginForm.controls.password.value
    }).subscribe({
      next: user => {
        this.auth.updateUser(user, UserType.Person).subscribe(_ => {
          this.msg.SendMessage('登录成功');
          this.router.navigateByUrl('/user').then();
        });
      },
      error: e => {
        this.msg.SendMessage(`登录失败: ${e}`);
        this.loginForm.reset();
        directive.resetForm();
      }
    });
  }

  ngOnInit(): void {
    this.loginForm.reset();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
