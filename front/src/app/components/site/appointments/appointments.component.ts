import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";
import {AuthService} from "../../../services/auth.service";
import {VaccinationAppointment} from "../../../types";
import {DateToAppointmentTime} from "../../../utils";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {ConfirmComponent} from "../../../dialogs/confirm/confirm.component";
import {FormControl, FormGroup} from "@angular/forms";
import {VaccinationByAppointmentComponent} from "../vaccination-by-appointment/vaccination-by-appointment.component";
import {EnvironmentService} from "../../../services/environment.service";

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit, AfterViewInit {
  displayColumns: string[] = ['appointment-no', 'person-name', 'person-id', 'vaccine', 'vaccination', 'actions'];
  appointmentsDataSource = new MatTableDataSource<VaccinationAppointment>();
  appointmentsDataSourceNoVaccination = new MatTableDataSource<VaccinationAppointment>();
  resultLength = 0;
  dateForm = new FormGroup({
    date: new FormControl(),
  });
  showVaccination: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private api: ApiService,
              private msg: MessageService,
              private auth: AuthService,
              private dialog: MatDialog,
              public env: EnvironmentService) {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.appointmentsDataSource.filter = filterValue.trim().toLowerCase();
    this.appointmentsDataSourceNoVaccination.filter = filterValue.trim().toLowerCase();
  }

  loadAppointments(): void {
    let arrangementDate = new Date(
      this.dateForm.controls.date.value.getFullYear(),
      this.dateForm.controls.date.value.getMonth(),
      this.dateForm.controls.date.value.getDate(),
      23,
      59,
      59
    );
    this.appointmentsDataSource = new MatTableDataSource<VaccinationAppointment>();
    this.appointmentsDataSourceNoVaccination = new MatTableDataSource<VaccinationAppointment>();
    this.api.ListAppointmentsSite(DateToAppointmentTime(arrangementDate)).subscribe({
      next: listAppointmentP => {
        if (listAppointmentP.appointments) {
          this.appointmentsDataSource = new MatTableDataSource<VaccinationAppointment>(listAppointmentP.appointments);
          this.resultLength = listAppointmentP.appointments.length;
        }

        if (listAppointmentP.appointments_no_vaccination) {
          this.appointmentsDataSourceNoVaccination =
            new MatTableDataSource<VaccinationAppointment>(listAppointmentP.appointments_no_vaccination);
        }
      },
      error: err => {
        this.msg.SendMessage(`获取预约列表失败: ${err}`);
      }
    });
  }


  onDeleteClick(appointment: VaccinationAppointment): void {
    this.dialog.open(ConfirmComponent, {
      data: '确定要删除吗?'
    }).afterClosed().subscribe(decision => {
      if (!decision) {
        return;
      }

      this.api.RemoveAppointmentSite(appointment.id).subscribe({
        next: _ => {
          this.msg.SendMessage('删除成功');
          this.loadAppointments();
          this.dateForm.reset();
          this.appointmentsDataSource = new MatTableDataSource<VaccinationAppointment>();
        },
        error: err => {
          this.msg.SendMessage(`删除失败: ${err}`);
        }
      });
    });
  }

  onVaccinationClick(appointment: VaccinationAppointment): void {
    this.dialog.open(VaccinationByAppointmentComponent, {
      data: appointment
    }).afterClosed().subscribe(_ => {
      this.loadAppointments();
    });
  }

  onDateChange(): void {
    this.loadAppointments();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.appointmentsDataSource) {
      if (this.paginator) {
        this.appointmentsDataSource.paginator = this.paginator;
      }
    }
  }
}
