import { inject, Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap } from 'rxjs';

import { TransactionService } from '../services/transaction';
import {
  loadTransactions,
  loadTransactionsFailure,
  loadTransactionsSuccess,
} from './transactions.actions';

@Injectable()
export class TransactionsEffects {
  private actions$ = inject(Actions);
  private transactionService = inject(TransactionService);

  loadTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTransactions),
      switchMap(() =>
        this.transactionService.loadCustomerTransactions().pipe(
          map(transactions =>
            loadTransactionsSuccess({ transactions })
          ),
          catchError(() =>
            of(
              loadTransactionsFailure({
                error: 'Unable to load transactions.',
              })
            )
          )
        )
      )
    )
  );
}
