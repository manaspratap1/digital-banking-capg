import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsTable } from './transactions-table';

describe('TransactionsTable', () => {
  let component: TransactionsTable;
  let fixture: ComponentFixture<TransactionsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsTable],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
