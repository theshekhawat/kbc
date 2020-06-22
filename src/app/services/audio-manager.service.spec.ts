import { TestBed } from '@angular/core/testing';

import { AudioManagerService } from './audio-manager.service';

describe('AudioManagerService', () => {
  let service: AudioManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
