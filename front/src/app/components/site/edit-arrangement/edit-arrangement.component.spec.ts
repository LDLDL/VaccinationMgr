import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditArrangementComponent } from './edit-arrangement.component';

describe('EditArrangementComponent', () => {
  let component: EditArrangementComponent;
  let fixture: ComponentFixture<EditArrangementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditArrangementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditArrangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
