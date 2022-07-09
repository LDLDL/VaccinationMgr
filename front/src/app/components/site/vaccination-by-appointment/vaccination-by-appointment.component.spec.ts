import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinationByAppointmentComponent } from './vaccination-by-appointment.component';

describe('VaccinationByAppointmentComponent', () => {
  let component: VaccinationByAppointmentComponent;
  let fixture: ComponentFixture<VaccinationByAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaccinationByAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccinationByAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
