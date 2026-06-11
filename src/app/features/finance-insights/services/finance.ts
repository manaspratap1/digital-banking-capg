import { computed, inject, Injectable, signal } from '@angular/core';
import { Account, SavingsGoal, Transaction } from '../../../shared/models';
import { TransactionType } from '../../../shared/enums/transaction-type.enum';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { map, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class Finance {

  private api = inject(ApiService);

  transactions = signal<Transaction[]>([]);
  savingsGoals = signal<SavingsGoal[]>([]);
  private authService = inject(AuthService);

  totalIncome = computed(() =>
    this.transactions()
      .filter(
        transaction =>
          transaction.type === TransactionType.CREDIT
      )
      .reduce(
        (sum, transaction) =>
          sum + transaction.amount,
        0
      )
  );

  totalExpense = computed(() =>
    this.transactions()
      .filter(
        transaction =>
          transaction.type === TransactionType.DEBIT
      )
      .reduce(
        (sum, transaction) =>
          sum + transaction.amount,
        0
      )
  );

  savingsRate = computed(() => {

    const income = this.totalIncome();
    const expense = this.totalExpense();

    if (income === 0) {
      return 0;
    }

    return Math.round(
      ((income - expense) / income) * 100
    );
  });

  loadTransactions(): void {
    this.api.get<Account[]>('accounts')
      .subscribe(accounts => {
        const currentUserId = String(this.authService.currentUser().userId ?? 2);

        const account = accounts.find(
          account =>
            String(account.userId) === String(currentUserId)
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
  }

  loadSavingsGoals(): void {
    this.api.get<SavingsGoal[]>('savingsGoals')
      .subscribe(goals => {
        const currentUserId = String(this.authService.currentUser().userId ?? 2);

        this.savingsGoals.set(
          goals.filter(
            goal =>
              String(goal.userId) === String(currentUserId)
          )
        );
      });
  }

  addSavingsGoal(goal: SavingsGoal): Observable<SavingsGoal> {
    return this.api.create<SavingsGoal>('savingsGoals', goal).pipe(
      map(() => goal)
    );
  }

  getCategorySpending() {

    const categoryMap =
      new Map<string, number>();

    this.transactions()
      .filter(
        transaction =>
          transaction.type ===
          TransactionType.DEBIT
      )
      .forEach(transaction => {

        const currentAmount =
          categoryMap.get(
            transaction.category
          ) ?? 0;

        categoryMap.set(
          transaction.category,
          currentAmount +
            transaction.amount
        );

      });

    return Array.from(
      categoryMap.entries()
    );

  }

  highestSpendingCategory(): string {

    const spending =
      this.getCategorySpending();

    if (spending.length === 0) {
      return 'N/A';
    }

    spending.sort(
      (a, b) => b[1] - a[1]
    );

    return spending[0][0];
  }

}
