import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultorOnboardingComponent } from './consultor-onboarding.component';

describe('ConsultorOnboardingComponent', () => {
  let component: ConsultorOnboardingComponent;
  let fixture: ComponentFixture<ConsultorOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultorOnboardingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultorOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
