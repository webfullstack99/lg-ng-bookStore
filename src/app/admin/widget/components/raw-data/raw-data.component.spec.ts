/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RawDataComponent } from './raw-data.component';

describe('RawDataComponent', () => {
  let component: RawDataComponent;
  let fixture: ComponentFixture<RawDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
