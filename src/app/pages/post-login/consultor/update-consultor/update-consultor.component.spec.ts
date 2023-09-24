import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConsultorComponent } from './update-consultor.component';

describe('UpdateConsultorComponent', () => {
  let component: UpdateConsultorComponent;
  let fixture: ComponentFixture<UpdateConsultorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateConsultorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateConsultorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
