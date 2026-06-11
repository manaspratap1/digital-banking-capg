import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { provideStore } from '@ngrx/store';

import { TransactionPage } from './transaction-page';
import { authReducer } from '../../../../core/store/auth/auth.reducer';
import { transactionsReducer } from '../../store/transactions.reducer';

describe('TransactionPage', () => {
  let component: TransactionPage;
  let fixture: ComponentFixture<TransactionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionPage],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideStore({
          auth: authReducer,
          transactions: transactionsReducer,
        }),
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
