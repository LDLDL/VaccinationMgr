import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetSiteadminPasswordComponent } from './set-siteadmin-password.component';

describe('SetSiteadminPasswordComponent', () => {
  let component: SetSiteadminPasswordComponent;
  let fixture: ComponentFixture<SetSiteadminPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetSiteadminPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetSiteadminPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
