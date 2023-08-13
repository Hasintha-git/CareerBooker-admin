import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiteManagementComponent } from './bite-management.component';

describe('BiteManagementComponent', () => {
  let component: BiteManagementComponent;
  let fixture: ComponentFixture<BiteManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiteManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiteManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
