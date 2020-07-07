import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarRightComponent } from './topbar-right.component';

describe('TopbarRightComponent', () => {
  let component: TopbarRightComponent;
  let fixture: ComponentFixture<TopbarRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopbarRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
