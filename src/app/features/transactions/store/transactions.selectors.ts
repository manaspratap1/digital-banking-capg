import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TransactionsState } from './transactions.state';
import { transactionsFeatureKey } from './transactions.state';

export const selectTransactionsState =
  createFeatureSelector<TransactionsState>(
    transactionsFeatureKey
  );

export const selectTransactions =
  createSelector(
    selectTransactionsState,
    state => state.transactions
  );

export const selectLoading =
  createSelector(
    selectTransactionsState,
    state => state.loading
  );

export const selectError =
  createSelector(
    selectTransactionsState,
    state => state.error
  );

export const selectSearchTerm =
  createSelector(
    selectTransactionsState,
    state => state.searchTerm
  );

export const selectCategoryFilter =
  createSelector(
    selectTransactionsState,
    state => state.categoryFilter
  );

export const selectFilteredTransactions =
  createSelector(
    selectTransactions,
    selectSearchTerm,
    selectCategoryFilter,
    (transactions, searchTerm, categoryFilter) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const normalizedCategory = categoryFilter.toLowerCase();

      return [...transactions]
        .filter(transaction => {
          const matchesCategory =
            normalizedCategory === 'all' ||
            transaction.category.toLowerCase() === normalizedCategory;

          const matchesSearch =
            normalizedSearch.length === 0 ||
            transaction.description.toLowerCase().includes(normalizedSearch) ||
            transaction.category.toLowerCase().includes(normalizedSearch) ||
            transaction.referenceNumber.toLowerCase().includes(normalizedSearch);

          return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
          const dateDifference =
            new Date(b.date).getTime() -
            new Date(a.date).getTime();

          if (dateDifference !== 0) {
            return dateDifference;
          }

          return String(b.referenceNumber).localeCompare(
            String(a.referenceNumber)
          );
        });
    }
  );
