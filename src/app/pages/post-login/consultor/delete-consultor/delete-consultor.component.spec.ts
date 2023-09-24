import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConsultorComponent } from './delete-consultor.component';

describe('DeleteConsultorComponent', () => {
  let component: DeleteConsultorComponent;
  let fixture: ComponentFixture<DeleteConsultorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteConsultorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteConsultorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
