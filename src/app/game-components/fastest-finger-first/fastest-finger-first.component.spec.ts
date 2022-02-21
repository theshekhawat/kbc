import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FastestFingerFirstComponent } from './fastest-finger-first.component';

describe('FastestFingerFirstComponent', () => {
  let component: FastestFingerFirstComponent;
  let fixture: ComponentFixture<FastestFingerFirstComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FastestFingerFirstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastestFingerFirstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
