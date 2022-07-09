import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinationLogsComponent } from './vaccination-logs.component';

describe('VaccinationLogsComponent', () => {
  let component: VaccinationLogsComponent;
  let fixture: ComponentFixture<VaccinationLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaccinationLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccinationLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
