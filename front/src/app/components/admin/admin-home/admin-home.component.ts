import { Component, OnInit } from '@angular/core';
import {Navigation} from "../../../types";

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

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

  constructor() { }

  ngOnInit(): void {
  }

}
