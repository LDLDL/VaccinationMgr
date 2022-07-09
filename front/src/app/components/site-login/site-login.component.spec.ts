import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteLoginComponent } from './site-login.component';

describe('SiteLoginComponent', () => {
  let component: SiteLoginComponent;
  let fixture: ComponentFixture<SiteLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
