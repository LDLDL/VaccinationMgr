import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinationChartsComponent } from './vaccination-charts.component';

describe('VaccinationChartsComponent', () => {
  let component: VaccinationChartsComponent;
  let fixture: ComponentFixture<VaccinationChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaccinationChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccinationChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
