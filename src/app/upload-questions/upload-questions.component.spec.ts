import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadQuestionsComponent } from './upload-questions.component';

describe('UploadQuestionsComponent', () => {
  let component: UploadQuestionsComponent;
  let fixture: ComponentFixture<UploadQuestionsComponent>;

  beforeEach(async(() => {
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
