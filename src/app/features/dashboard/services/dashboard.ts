import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Account, Bill, Transaction } from '../../../shared/models';
import { TransactionType } from '../../../shared/enums/transaction-type.enum';
import { BillStatus } from '../../../shared/enums/bill-status.enum';
import { Finance } from '../../finance-insights/services/finance';

@Injectable({
  providedIn: 'root',
})
export class Dashboard {

  private api = inject(ApiService);

  private finance = inject(Finance);

  account = signal<Account | null>(null);

  transactions = signal<Transaction[]>([]);

  bills = signal<Bill[]>([]);

  availableBalance = computed(() => this.account()?.balance ?? 0 );

  monthlyIncome =
    computed(() =>

      this.transactions()
        .filter(
          transaction =>
            transaction.type ===
            TransactionType.CREDIT
        )
        .reduce(
          (sum, transaction) =>
            sum + transaction.amount,
          0
        )

    );

    recentTransactions = computed(() =>
        [...this.transactions()]
          .reverse()
          .slice(0, 5)
      );

    upcomingBills = computed(() =>
        this.bills()
          .filter(
            bill => BillStatus.PENDING
          )
          .slice(0, 5)
      );  

  monthlyExpense =
    computed(() =>

      this.transactions()
        .filter(
          transaction =>
            transaction.type ===
            TransactionType.DEBIT
        )
        .reduce(
          (sum, transaction) =>
            sum + transaction.amount,
          0
        )

    );

  pendingBillsCount =
    computed(() =>

      this.bills()
        .filter(
          bill =>
            bill.status ===
            BillStatus.PENDING
        )
        .length

    );

  loadDashboard(): void {

    this.finance.loadTransactions();

    this.finance.loadSavingsGoals();

    this.api
      .get<Account[]>('accounts')
      .subscribe(accounts => {

        this.account.set(
          accounts[0]
        );

      });

    this.api
      .get<Transaction[]>(
        'transactions'
      )
      .subscribe(transactions => {

        this.transactions.set(
          transactions
        );

      });

    this.api
      .get<Bill[]>('bills')
      .subscribe(bills => {

        this.bills.set(
          bills
        );

      });

  }

}