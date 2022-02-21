import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadQuestionsComponent } from './upload-questions.component';

describe('UploadQuestionsComponent', () => {
  let component: UploadQuestionsComponent;
  let fixture: ComponentFixture<UploadQuestionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
