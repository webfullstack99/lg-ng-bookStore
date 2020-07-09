import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTableEmptyComponent } from './main-table-empty.component';

describe('MainTableEmptyComponent', () => {
  let component: MainTableEmptyComponent;
  let fixture: ComponentFixture<MainTableEmptyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainTableEmptyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTableEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
