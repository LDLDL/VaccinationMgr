import { Component, OnInit } from '@angular/core';
import {Navigation} from "../../../types";

@Component({
  selector: 'app-site-home',
  templateUrl: './site-home.component.html',
  styleUrls: ['./site-home.component.css']
})
export class SiteHomeComponent implements OnInit {

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

  constructor() { }

  ngOnInit(): void {
  }

}
