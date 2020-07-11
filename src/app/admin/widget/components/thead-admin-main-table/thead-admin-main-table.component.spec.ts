import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheadAdminMainTableComponent } from './thead-admin-main-table.component';

describe('TheadAdminMainTableComponent', () => {
  let component: TheadAdminMainTableComponent;
  let fixture: ComponentFixture<TheadAdminMainTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheadAdminMainTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheadAdminMainTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
