import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {Vaccine, VaccineInventory} from "../../../types";
import {MessageService} from "../../../services/message.service";

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.css']
})
export class AddInventoryComponent implements OnInit {
  addInventoryForm: FormGroup;

  inventories?: VaccineInventory[];
  vaccines?: Vaccine[];
  vaccinesNoInventory: Vaccine[];

  constructor(private api: ApiService,
              private msg: MessageService) {
    this.vaccinesNoInventory = new Array<Vaccine>();
    this.inventories = new Array<VaccineInventory>();
    this.vaccines = new Array<Vaccine>();
    this.addInventoryForm = new FormGroup({
      vaccine: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      number: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      })
    });
  }

  hasInventoryLog(vaccine: Vaccine): boolean {
    if (this.inventories) {
      for (let inventory of this.inventories) {
        if (inventory.vaccine_id === vaccine.id) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }

  addInventory(directive: FormGroupDirective): void {
    this.api.AddInventories({
      vaccine_id: this.addInventoryForm.controls.vaccine.value.id,
      number: this.addInventoryForm.controls.number.value
    }).subscribe({
      next: _ => {
        this.msg.SendMessage('添加成功');
        this.addInventoryForm.reset();
        directive.reset();
      },
      error: err => {
        this.msg.SendMessage(`添加失败 ${err}`);
        this.addInventoryForm.reset();
        directive.reset();
      }
    });
  }

  ngOnInit(): void {
    this.api.ListVaccines().subscribe({
      next: listVaccineP => {
        if (listVaccineP.vaccines) {
          this.vaccines = listVaccineP.vaccines;
          this.api.ListInventoriesSite().subscribe({
            next: listInventoriesP => {
              if (listInventoriesP.inventories) {
                this.inventories = listInventoriesP.inventories;
              }
              if (this.vaccines) {
                for (let vaccine of this.vaccines) {
                  if (!this.hasInventoryLog(vaccine)) {
                    this.vaccinesNoInventory.push(vaccine);
                  }
                }
              }
            },
            error: err => {
              this.msg.SendMessage(`获取库存失败: ${err}`);
            }
          });
        } else {
          this.msg.SendMessage('获取疫苗列表失败');
        }
      },
      error: err => {
        this.msg.SendMessage(`获取疫苗列表失败: ${err}`);
      }
    });
  }
}
