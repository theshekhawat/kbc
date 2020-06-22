import { TestBed } from '@angular/core/testing';

import { GameShowUtilitiesService } from './utilities.service';

describe('UtilitiesService', () => {
  let service: GameShowUtilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameShowUtilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
