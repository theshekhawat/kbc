import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AudiencePollComponent } from './audience-poll.component';

describe('AudiencePollComponent', () => {
  let component: AudiencePollComponent;
  let fixture: ComponentFixture<AudiencePollComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AudiencePollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudiencePollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
