import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {EnvironmentService} from "../../services/environment.service";
import {Navigation, VaccinationSiteAdmin} from "../../types";
import {first} from "rxjs/operators";
import {ConfirmComponent} from "../../dialogs/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {
  siteAdmin?: VaccinationSiteAdmin;
  navigations: Navigation[] = [
    {
      name: '预约列表',
      url: '/site/appointments'
    },
    {
      name: '预约安排',
      url: '/site/arrangements'
    },
    {
      name: '库存管理',
      url: '/site/inventories'
    },
    {
      name: '接种',
      url: '/site/vaccination'
    },
    {
      name: '统计图表',
      url: '/site/charts'
    }
  ];

  constructor(private auth: AuthService,
              private router: Router,
              public env: EnvironmentService,
              private api: ApiService,
              private dialog: MatDialog) {
    this.auth.user$.pipe(first()).subscribe(user => {
      this.siteAdmin = (user as VaccinationSiteAdmin);
    });
  }

  logout(): void {
    this.dialog.open(ConfirmComponent, {
      data: '确定要退出登录吗?'
    }).afterClosed().subscribe(decision => {
      if (!decision) {
        return
      }
      this.auth.clear().subscribe(_ => {
        this.router.navigateByUrl('/site/login').then();
      });
    });
  }

  ngOnInit(): void {
  }

}
