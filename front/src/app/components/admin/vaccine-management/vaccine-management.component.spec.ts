import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccineManagementComponent } from './vaccine-management.component';

describe('VaccineManagementComponent', () => {
  let component: VaccineManagementComponent;
  let fixture: ComponentFixture<VaccineManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaccineManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccineManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
