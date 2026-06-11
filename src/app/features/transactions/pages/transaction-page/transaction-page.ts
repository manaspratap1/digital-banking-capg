import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

import { Store } from '@ngrx/store';

import { Transaction } from '../../../../shared/models';
import { StatementViewComponent } from '../../components/statement-view/statement-view';
import { TransactionDetails } from '../../components/transaction-details/transaction-details';
import { TransactionFilter } from '../../components/transaction-filter/transaction-filter';
import { TransactionList } from '../../components/transaction-list/transaction-list';
import { TransactionService } from '../../services/transaction';
import {
  clearFilters,
  loadTransactions,
  setCategoryFilter,
  setSearchTerm,
} from '../../store/transactions.actions';
import {
  selectCategoryFilter,
  selectError,
  selectFilteredTransactions,
  selectLoading,
  selectSearchTerm,
  selectTransactions,
} from '../../store/transactions.selectors';

@Component({
  selector: 'app-transaction-page',
  imports: [
    CommonModule,
    StatementViewComponent,
    TransactionDetails,
    TransactionFilter,
    TransactionList,
  ],
  templateUrl: './transaction-page.html',
  styleUrl: './transaction-page.scss',
})
export class TransactionPage implements OnInit {
  private store = inject(Store);
  private transactionService =
    inject(TransactionService);

  allTransactions =
    this.store.selectSignal(selectTransactions);

  filteredTransactions =
    this.store.selectSignal(
      selectFilteredTransactions
    );

  loading =
    this.store.selectSignal(selectLoading);

  error =
    this.store.selectSignal(selectError);

  searchTerm =
    this.store.selectSignal(selectSearchTerm);

  categoryFilter =
    this.store.selectSignal(
      selectCategoryFilter
    );

  selectedTransaction =
    signal<Transaction | null>(null);

  statementVisible =
    signal(false);

  statementMonth =
    signal('');

  statementAccountNumber =
    signal('Account unavailable');

  statementCurrentBalance =
    signal(0);

  categoryOptions =
    computed(() =>
      this.transactionService.getCategoryOptions(
        this.allTransactions()
      )
    );

  summary =
    computed(() =>
      this.transactionService.createHistorySummary(
        this.filteredTransactions()
      )
    );

  ngOnInit(): void {
    this.store.dispatch(loadTransactions());

    this.transactionService
      .loadCustomerAccounts()
      .subscribe(accounts => {
        this.statementAccountNumber.set(
          this.transactionService.createStatementAccountLabel(
            accounts
          )
        );

        this.statementCurrentBalance.set(
          this.transactionService.createStatementCurrentBalance(
            accounts
          )
        );
      });
  }

  updateSearchTerm(
    searchTerm: string
  ): void {
    this.store.dispatch(
      setSearchTerm({ searchTerm })
    );
  }

  updateCategoryFilter(
    categoryFilter: string
  ): void {
    this.store.dispatch(
      setCategoryFilter({ categoryFilter })
    );
  }

  resetFilters(): void {
    this.store.dispatch(clearFilters());
  }

  openTransactionDetails(
    transaction: Transaction
  ): void {
    this.selectedTransaction.set(transaction);
  }

  closeTransactionDetails(): void {
    this.selectedTransaction.set(null);
  }

  openStatementView(): void {
    if (!this.statementMonth()) {
      const firstMonth =
        this.transactionService.getStatementMonths(
          this.allTransactions()
        )[0]?.value ?? '';

      this.statementMonth.set(firstMonth);
    }

    this.statementVisible.set(true);
  }

  closeStatementView(): void {
    this.statementVisible.set(false);
  }

  updateStatementMonth(
    month: string
  ): void {
    this.statementMonth.set(month);
  }
}
