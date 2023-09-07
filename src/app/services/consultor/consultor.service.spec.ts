import { TestBed } from '@angular/core/testing';

import { ConsultorService } from './consultor.service';

describe('ConsultorService', () => {
  let service: ConsultorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
