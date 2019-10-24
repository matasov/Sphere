import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTestHeaderRowComponent } from './table-test-header-row.component';

describe('TableTestHeaderRowComponent', () => {
  let component: TableTestHeaderRowComponent;
  let fixture: ComponentFixture<TableTestHeaderRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableTestHeaderRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTestHeaderRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
