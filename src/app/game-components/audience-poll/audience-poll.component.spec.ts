import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiencePollComponent } from './audience-poll.component';

describe('AudiencePollComponent', () => {
  let component: AudiencePollComponent;
  let fixture: ComponentFixture<AudiencePollComponent>;

  beforeEach(async(() => {
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
