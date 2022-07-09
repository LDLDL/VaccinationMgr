import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArrangementComponent } from './add-arrangement.component';

describe('AddArrangementComponent', () => {
  let component: AddArrangementComponent;
  let fixture: ComponentFixture<AddArrangementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddArrangementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddArrangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
