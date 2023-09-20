import { TestBed } from '@angular/core/testing';

import { ConsultantDaysService } from './consultant-days.service';

describe('ConsultantDaysService', () => {
  let service: ConsultantDaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultantDaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
