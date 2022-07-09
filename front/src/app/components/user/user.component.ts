import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {EnvironmentService} from "../../services/environment.service";
import {Navigation, Person} from "../../types";
import {first} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "../../dialogs/confirm/confirm.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ChangeProfileComponent} from "./change-profile/change-profile.component";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user?: Person;
  navigations: Navigation[] = [
    {
      name: '预约',
      url: '/user/appointment'
    },
    {
      name: '我的预约',
      url: '/user/appointment/valid'
    },
    {
      name: '接种记录',
      url: '/user/vaccinations'
    }
  ];

  constructor(public auth: AuthService,
              private router: Router,
              public env: EnvironmentService,
              private dialog: MatDialog) {
    auth.user$.pipe(first()).subscribe(user => {
      this.user = (user as Person);
    });
  }

  logout(): void {
    this.dialog.open(ConfirmComponent, {
      data: '确定要退出登录吗?'
    }).afterClosed().subscribe(decision => {
      if (!decision) {
        return;
      }

      this.auth.clear().subscribe(_ => {
        this.router.navigateByUrl('/').then();
      });
    });
  }

  changePassword(): void {
    this.dialog.open(ChangePasswordComponent).afterClosed().subscribe();
  }

  changeProfile(): void {
    this.dialog.open(ChangeProfileComponent).afterClosed().subscribe();
  }

  ngOnInit(): void {
  }

}
