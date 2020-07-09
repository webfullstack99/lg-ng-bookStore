import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XTitleComponent } from './x-title.component';

describe('XTitleComponent', () => {
  let component: XTitleComponent;
  let fixture: ComponentFixture<XTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
