import { Component, OnInit } from '@angular/core';
import {Navigation} from "../../../types";

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

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

  constructor() { }

  ngOnInit(): void {
  }

}
