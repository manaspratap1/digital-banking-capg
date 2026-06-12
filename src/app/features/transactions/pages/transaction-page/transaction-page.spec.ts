import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { provideStore } from '@ngrx/store';
import { of } from 'rxjs';

import { TransactionPage } from './transaction-page';
import { authReducer } from '../../../../core/store/auth/auth.reducer';
import { transactionsReducer } from '../../store/transactions.reducer';
import { TransactionService } from '../../services/transaction';

describe('TransactionPage', () => {
  let component: TransactionPage;
  let fixture: ComponentFixture<TransactionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionPage],
      providers: [
        provideRouter([]),
        provideStore({
          auth: authReducer,
          transactions: transactionsReducer,
        }),
        {
          provide: TransactionService,
          useValue: {
            getCategoryOptions: () => ['All'],
            createHistorySummary: () => ({
              credits: 0,
              debits: 0,
              netChange: 0,
              totalTransactions: 0,
            }),
            loadCustomerAccounts: () => of([]),
            createStatementAccountLabel: () => 'Account unavailable',
            createStatementCurrentBalance: () => 0,
            getStatementMonths: () => [],
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
