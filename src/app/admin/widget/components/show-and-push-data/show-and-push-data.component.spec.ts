import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAndPushDataComponent } from './show-and-push-data.component';

describe('ShowAndPushDataComponent', () => {
  let component: ShowAndPushDataComponent;
  let fixture: ComponentFixture<ShowAndPushDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAndPushDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAndPushDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
