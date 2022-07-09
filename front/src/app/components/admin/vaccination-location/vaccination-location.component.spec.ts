import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinationLocationComponent } from './vaccination-location.component';

describe('VaccinationLocationComponent', () => {
  let component: VaccinationLocationComponent;
  let fixture: ComponentFixture<VaccinationLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaccinationLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccinationLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
