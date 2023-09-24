import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConsultorComponent } from './view-consultor.component';

describe('ViewConsultorComponent', () => {
  let component: ViewConsultorComponent;
  let fixture: ComponentFixture<ViewConsultorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewConsultorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewConsultorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
