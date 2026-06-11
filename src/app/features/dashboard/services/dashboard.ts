import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Account, Bill, Transaction } from '../../../shared/models';
import { TransactionType } from '../../../shared/enums/transaction-type.enum';
import { BillStatus } from '../../../shared/enums/bill-status.enum';
import { Finance } from '../../finance-insights/services/finance';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class Dashboard {

  private api = inject(ApiService);

  private finance = inject(Finance);

  private authService = inject(AuthService);

  account = signal<Account | null>(null);

  transactions = signal<Transaction[]>([]);

  bills = signal<Bill[]>([]);

  availableBalance = computed(() => this.account()?.balance ?? 0 );

  monthlyIncome = computed(() =>
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
            bill => bill.status === BillStatus.PENDING
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

    this.api.get<Account[]>('accounts')
      .subscribe(accounts => {

        const currentUserId = String(this.authService.currentUser().userId ?? 2);

        const account = accounts.find(
          account =>
            String(account.userId) === String(currentUserId)
        );

        this.account.set(
          account ?? null
        );

      if (!account) {
        return;
      }

      this.api.get<Transaction[]>('transactions')
        .subscribe(transactions => {

          this.transactions.set(

            transactions.filter(
              transaction =>
                String(transaction.accountId) === String(account.id)
            )
          );
        });
      });

    this.api
      .get<Bill[]>('bills')
      .subscribe(bills => {

        const currentUserId = String(this.authService.currentUser().userId ?? 2);

        this.bills.set(
          bills.filter(
            bill =>
              String(bill.userId) === String(currentUserId)
          )
        );
      });
  }

}
