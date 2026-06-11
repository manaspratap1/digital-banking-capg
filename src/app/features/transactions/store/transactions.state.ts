import { Transaction } from '../../../shared/models';

export const transactionsFeatureKey = 'transactions';

export interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  categoryFilter: string;
}

export const initialTransactionsState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
  searchTerm: '',
  categoryFilter: 'All',
};
