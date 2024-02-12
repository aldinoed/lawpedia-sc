import { TestBed } from '@angular/core/testing';

import { SpeakupService } from './speakup.service';

describe('SpeakupService', () => {
  let service: SpeakupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeakupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
