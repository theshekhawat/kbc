import { TestBed } from '@angular/core/testing';

import { QuizInformationDetailsService } from './quiz-information-details.service';

describe('QuizInformationDetailsService', () => {
  let service: QuizInformationDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizInformationDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
