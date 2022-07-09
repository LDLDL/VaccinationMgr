import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {VaccineInventory} from "../../../types";
import {MessageService} from "../../../services/message.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "../../../dialogs/confirm/confirm.component";
import {EditInventoryComponent} from "../edit-inventory/edit-inventory.component";
import {AddInventoryComponent} from "../add-inventory/add-inventory.component";

@Component({
  selector: 'app-inventories',
  templateUrl: './inventories.component.html',
  styleUrls: ['./inventories.component.css']
})
export class InventoriesComponent implements OnInit, AfterViewInit {
  displayColumns: string[] = ['vaccine_id', 'vaccine', 'number', 'actions'];
  inventoriesDataSource = new MatTableDataSource<VaccineInventory>();
  resultLength = 0;
  // @ViewChild('inventoryPaginator') paginator: MatPaginator | undefined;

  constructor(private api: ApiService,
              private msg: MessageService,
              private dialog: MatDialog) { }

  loadInventories(): void {
    this.api.ListInventoriesSite().subscribe({
      next: listInventoriesP => {
        if (listInventoriesP.inventories) {
          this.inventoriesDataSource = new MatTableDataSource<VaccineInventory>(listInventoriesP.inventories);
          this.resultLength = listInventoriesP.inventories.length;
        } else {
          // this.msg.SendMessage('获取疫苗库存失败,请刷新');
        }
      },
      error: err => {
        this.msg.SendMessage(`获取疫苗库存失败: ${err},请刷新 `);
      }
    });
  }

  onDeleteClick(vaccineInventory: VaccineInventory): void {
    this.dialog.open(ConfirmComponent, {
      data: '确定要删除吗?'
    }).afterClosed().subscribe(decision => {
      if (!decision) {
        return;
      }

      this.api.RemoveInventories(vaccineInventory.vaccine_id).subscribe({
        next: _ => {
          this.loadInventories();
          this.msg.SendMessage('删除成功');
        },
        error: err => {
          this.msg.SendMessage(`删除失败: ${err}`);
        }
      });
    });
  }

  onEditClick(vaccineInventory: VaccineInventory): void {
    this.dialog.open(EditInventoryComponent, {
      data: vaccineInventory
    }).afterClosed().subscribe(_ => {
      this.loadInventories();
    });
  }

  addInventory(): void {
    this.dialog.open(AddInventoryComponent).afterClosed().subscribe(_ => {
      this.loadInventories();
    });
  }

  ngOnInit(): void {
    this.loadInventories();
  }

  ngAfterViewInit() {
    // if (this.inventoriesDataSource) {
    //   if (this.paginator) {
    //     this.inventoriesDataSource.paginator = this.paginator;
    //   }
    // }
  }

}

