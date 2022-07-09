import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {VaccineInventory} from "../../../types";

@Component({
  selector: 'app-edit-inventory',
  templateUrl: './edit-inventory.component.html',
  styleUrls: ['./edit-inventory.component.css']
})
export class EditInventoryComponent implements OnInit {
  editInventoryForm: FormGroup;

  constructor(private api: ApiService,
              private msg: MessageService,
              @Inject(MAT_DIALOG_DATA) public data: VaccineInventory) {
    this.editInventoryForm = new FormGroup({
      number: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      })
    });
  }

  setInventory(directive: FormGroupDirective): void {
    this.api.SetInventories({
      vaccine_id: this.data.vaccine_id,
      number: this.editInventoryForm.controls.number.value
    }).subscribe({
      next: _ => {
        this.msg.SendMessage('更改成功');
      },
      error: err => {
        this.msg.SendMessage(`更改失败: ${err}`);
        this.editInventoryForm.reset();
        directive.resetForm();
        this.editInventoryForm.controls.number.setValue(this.data.number);
      }
    });
  }

  ngOnInit(): void {
    this.editInventoryForm.controls.number.setValue(this.data.number);
  }

}
