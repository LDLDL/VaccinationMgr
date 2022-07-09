import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {AuthService} from "../../services/auth.service";
import {MessageService} from "../../services/message.service";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {UserType} from "../../types";

@Component({
  selector: 'app-site-login',
  templateUrl: './site-login.component.html',
  styleUrls: ['./site-login.component.css']
})
export class SiteLoginComponent implements OnInit, OnDestroy {

  constructor(private api: ApiService,
              private auth: AuthService,
              private msg: MessageService,
              private router: Router) {
    this.destroy$ = new Subject<void>();
  }

  loginForm = new FormGroup({
    account: new FormControl('', {
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
    this.api.LoginSiteAdmin({
      account: this.loginForm.controls.account.value,
      password: this.loginForm.controls.password.value
    }).subscribe({
      next: user => {
        this.auth.updateUser(user, UserType.VaccinationSiteAdmin).subscribe(_ => {
          this.msg.SendMessage('登录成功');
          this.router.navigateByUrl('/site').then();
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
