import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ConfirmComponent} from "../../dialogs/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {Navigation} from "../../types";
import {EnvironmentService} from "../../services/environment.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  navigations: Navigation[] = [
    {
      name: '疫苗管理',
      url: '/admin/vaccine'
    },
    {
      name: '站点管理',
      url: '/admin/site'
    },
    {
      name: '用户查询',
      url: '/admin/user'
    },
    {
      name: '站点接种记录',
      url: '/admin/vaccination/site'
    },
    {
      name: '地区接种记录',
      url: '/admin/vaccination/location'
    },
    {
      name: '统计图表',
      url: '/admin/charts'
    }
  ];

  constructor(private auth: AuthService,
              private router: Router,
              private dialog: MatDialog,
              public env: EnvironmentService) { }

  logout(): void {
    this.dialog.open(ConfirmComponent, {
      data: '确定要退出登录吗?'
    }).afterClosed().subscribe(decision => {
      if (!decision) {
        return
      }
      this.auth.clear().subscribe(_ => {
        this.router.navigateByUrl('/admin/login').then();
      });
    });
  }

  ngOnInit(): void {
  }

}
