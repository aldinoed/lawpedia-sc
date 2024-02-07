import { TestBed } from '@angular/core/testing';

import { HoaxService } from './hoax.service';

describe('HoaxService', () => {
  let service: HoaxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoaxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
