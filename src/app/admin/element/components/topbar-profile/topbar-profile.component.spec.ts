import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarProfileComponent } from './topbar-profile.component';

describe('TopbarProfileComponent', () => {
  let component: TopbarProfileComponent;
  let fixture: ComponentFixture<TopbarProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopbarProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
