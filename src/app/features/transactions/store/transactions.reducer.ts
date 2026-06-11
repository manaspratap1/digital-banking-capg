import { createReducer, on } from '@ngrx/store';

import {
  clearFilters,
  loadTransactions,
  loadTransactionsFailure,
  loadTransactionsSuccess,
  setCategoryFilter,
  setSearchTerm,
} from './transactions.actions';
import { initialTransactionsState } from './transactions.state';

export const transactionsReducer = createReducer(
  initialTransactionsState,

  on(loadTransactions, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(loadTransactionsSuccess, (state, { transactions }) => ({
    ...state,
    transactions,
    loading: false,
    error: null,
  })),

  on(loadTransactionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  })),

  on(setCategoryFilter, (state, { categoryFilter }) => ({
    ...state,
    categoryFilter,
  })),

  on(clearFilters, state => ({
    ...state,
    searchTerm: '',
    categoryFilter: 'All',
  }))
);
