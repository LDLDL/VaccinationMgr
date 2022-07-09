import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {AuthService} from "../../services/auth.service";
import {MessageService} from "../../services/message.service";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {UserType} from "../../types";

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit, OnDestroy {
  constructor(private api: ApiService,
              private auth: AuthService,
              private msg: MessageService,
              private router: Router) {
    this.destroy$ = new Subject<void>();
  }

  loginForm = new FormGroup({
    password: new FormControl('', {
      validators: Validators.required,
      updateOn: 'blur'
    })
  });
  readonly destroy$: Subject<void>;

  login(directive: FormGroupDirective): void {
    this.api.LoginAdmin({
      password: this.loginForm.controls.password.value
    }).subscribe({
      next: _ => {
        this.auth.updateUser('admin', UserType.Admin).subscribe(_ => {
          this.msg.SendMessage('登录成功');
          this.router.navigateByUrl('/admin').then();
        });
      },
      error: e => {
        this.msg.SendMessage(`登录失败: ${String(e)}`);
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
