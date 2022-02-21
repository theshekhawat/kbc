import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastestFingerFirstComponent } from './fastest-finger-first.component';

describe('FastestFingerFirstComponent', () => {
  let component: FastestFingerFirstComponent;
  let fixture: ComponentFixture<FastestFingerFirstComponent>;

  beforeEach(async(() => {
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
