import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinationSiteComponent } from './vaccination-site.component';

describe('VaccinationSiteComponent', () => {
  let component: VaccinationSiteComponent;
  let fixture: ComponentFixture<VaccinationSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaccinationSiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccinationSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
