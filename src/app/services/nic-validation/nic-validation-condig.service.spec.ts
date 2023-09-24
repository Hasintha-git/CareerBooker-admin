import { TestBed } from '@angular/core/testing';

import { NicValidationCondigService } from './nic-validation-condig.service';

describe('NicValidationCondigService', () => {
  let service: NicValidationCondigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NicValidationCondigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
