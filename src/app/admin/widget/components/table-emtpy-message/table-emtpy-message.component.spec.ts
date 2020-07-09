import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableEmtpyMessageComponent } from './table-emtpy-message.component';

describe('TableEmtpyMessageComponent', () => {
  let component: TableEmtpyMessageComponent;
  let fixture: ComponentFixture<TableEmtpyMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableEmtpyMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableEmtpyMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
