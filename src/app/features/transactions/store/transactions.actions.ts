import { createAction, props } from '@ngrx/store';

import { Transaction } from '../../../shared/models';

export const loadTransactions =
  createAction('[Transactions] Load Transactions');

export const loadTransactionsSuccess =
  createAction(
    '[Transactions] Load Transactions Success',
    props<{ transactions: Transaction[] }>()
  );

export const loadTransactionsFailure =
  createAction(
    '[Transactions] Load Transactions Failure',
    props<{ error: string }>()
  );

export const setSearchTerm =
  createAction(
    '[Transactions] Set Search Term',
    props<{ searchTerm: string }>()
  );

export const setCategoryFilter =
  createAction(
    '[Transactions] Set Category Filter',
    props<{ categoryFilter: string }>()
  );

export const clearFilters =
  createAction('[Transactions] Clear Filters');
