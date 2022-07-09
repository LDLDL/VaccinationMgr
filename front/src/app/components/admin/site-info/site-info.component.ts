import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {VaccinationSite, VaccinationSiteAdmin} from "../../../types";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {AddSiteadminComponent} from "../add-siteadmin/add-siteadmin.component";
import {SetSiteadminPasswordComponent} from "../set-siteadmin-password/set-siteadmin-password.component";
import {ConfirmComponent} from "../../../dialogs/confirm/confirm.component";
import {SetSiteComponent} from "../set-site/set-site.component";

@Component({
  selector: 'app-site-info',
  templateUrl: './site-info.component.html',
  styleUrls: ['./site-info.component.css']
})
export class SiteInfoComponent implements OnInit {
  displayColumns: string[] = ['account', 'name', 'phone', 'actions'];
  admins = new MatTableDataSource<VaccinationSiteAdmin>();
  site?: VaccinationSite;

  constructor(private api: ApiService,
              private msg: MessageService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router) { }

  loadSiteInfo(): void {
    const siteId = Number(this.route.snapshot.paramMap.get('id'));
    this.api.GetSite(siteId).subscribe({
      next: site => {
        this.site = site;
      },
      error: err => {
        this.msg.SendMessage(`获取站点信息失败: ${err}`);
      }
    });
  }

  loadSiteAdmins(): void {
    this.admins = new MatTableDataSource<VaccinationSiteAdmin>();
    const siteId = Number(this.route.snapshot.paramMap.get('id'));
    this.api.ListSiteAdmins(siteId).subscribe({
      next: listSiteAdminsP => {
        if (listSiteAdminsP.admins) {
          this.admins = new MatTableDataSource<VaccinationSiteAdmin>(listSiteAdminsP.admins);
        }
      },
      error: err => {
        this.msg.SendMessage(`获取管理员信息失败: ${err}`);
      }
    });
  }

  onSetPasswordClick(siteAdmin: VaccinationSiteAdmin): void {
    this.dialog.open(SetSiteadminPasswordComponent, {
      data: siteAdmin
    }).afterClosed().subscribe();
  }

  onDeleteClick(siteAdmin: VaccinationSiteAdmin): void {
    this.dialog.open(ConfirmComponent, {
      data: '确定要删除吗?'
    }).afterClosed().subscribe(decision => {
      if (!decision) {
        return;
      }

      this.api.RemoveSiteAdmin({
        account: siteAdmin.account
      }).subscribe({
        next: _ => {
          this.msg.SendMessage('删除成功');
          this.loadSiteAdmins();
        },
        error: err => {
          this.msg.SendMessage(`删除失败: ${err}`);
        }
      });
    });
  }

  addSiteAdmin(): void {
    this.dialog.open(AddSiteadminComponent, {
      data: this.site
    }).afterClosed().subscribe(_ => {
      this.loadSiteAdmins();
    });
  }

  onSiteEditClick(): void {
    if (this.site) {
      this.dialog.open(SetSiteComponent, {
        data: this.site
      }).afterClosed().subscribe(_ => {
        this.loadSiteInfo();
      });
    }
  }

  onSiteDeleteClick(): void {
    this.dialog.open(ConfirmComponent, {
      data: '确定要删除吗?'
    }).afterClosed().subscribe(decision => {
      if (!decision) {
        return;
      }

      if (this.site) {
        this.api.RemoveSite(this.site.id).subscribe({
          next: _ => {
            this.msg.SendMessage('移除成功');
            this.router.navigateByUrl('/admin/site').then();
          },
          error: err => {
            this.msg.SendMessage(`移除失败: ${err}`);
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.loadSiteInfo();
    this.loadSiteAdmins();
  }

}
