import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarAlertComponent } from './topbar-alert.component';

describe('TopbarAlertComponent', () => {
  let component: TopbarAlertComponent;
  let fixture: ComponentFixture<TopbarAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopbarAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
