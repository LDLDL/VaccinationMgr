import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Vaccine} from "../../../types";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";
import {MatDialog} from "@angular/material/dialog";
import {AddVaccineComponent} from "../add-vaccine/add-vaccine.component";
import {ConfirmComponent} from "../../../dialogs/confirm/confirm.component";
import {EditVaccineComponent} from "../edit-vaccine/edit-vaccine.component";

@Component({
  selector: 'app-vaccine-management',
  templateUrl: './vaccine-management.component.html',
  styleUrls: ['./vaccine-management.component.css']
})
export class VaccineManagementComponent implements OnInit {
  displayColumns: string[] = ['id', 'manufacturer', 'type', 'location', 'actions'];
  vaccinesDataSource = new MatTableDataSource<Vaccine>();

  constructor(private api: ApiService,
              private msg: MessageService,
              private dialog: MatDialog) { }

  loadVaccines(): void {
    this.api.ListVaccines().subscribe({
      next: listVaccinesP => {
        if (listVaccinesP.vaccines) {
          this.vaccinesDataSource = new MatTableDataSource<Vaccine>(listVaccinesP.vaccines);
        }
      },
      error: err => {
        this.msg.SendMessage(`获取疫苗列表失败: ${err}`);
      }
    })
  }

  onEditClick(vaccine: Vaccine): void {
    this.dialog.open(EditVaccineComponent, {
      data: vaccine
    }).afterClosed().subscribe(_ => {
      this.loadVaccines();
    });
  }

  onDeleteClick(vaccine: Vaccine): void {
    this.dialog.open(ConfirmComponent, {
      data: '确定要删除吗?'
    }).afterClosed().subscribe(decision => {
      if (!decision) {
        return;
      }

      this.api.RemoveVaccine(vaccine.id).subscribe({
        next: _ => {
          this.msg.SendMessage('删除成功');
          this.loadVaccines();
        },
        error: err => {
          this.msg.SendMessage(`删除失败: ${err}`);
        }
      });
    })
  }

  addVaccine(): void {
    this.dialog.open(AddVaccineComponent).afterClosed().subscribe(_ => {
      this.loadVaccines();
    });
  }

  ngOnInit(): void {
    this.loadVaccines();
  }

}
