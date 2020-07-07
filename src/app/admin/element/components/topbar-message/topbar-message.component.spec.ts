import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarMessageComponent } from './topbar-message.component';

describe('TopbarMessageComponent', () => {
  let component: TopbarMessageComponent;
  let fixture: ComponentFixture<TopbarMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopbarMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
