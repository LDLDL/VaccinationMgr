import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSiteadminComponent } from './add-siteadmin.component';

describe('AddSiteadminComponent', () => {
  let component: AddSiteadminComponent;
  let fixture: ComponentFixture<AddSiteadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSiteadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSiteadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
