import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetSiteComponent } from './set-site.component';

describe('SetSiteComponent', () => {
  let component: SetSiteComponent;
  let fixture: ComponentFixture<SetSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetSiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
