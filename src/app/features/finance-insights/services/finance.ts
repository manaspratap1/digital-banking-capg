import { computed, inject, Injectable, signal } from '@angular/core';
import { SavingsGoal, Transaction } from '../../../shared/models';
import { TransactionType } from '../../../shared/enums/transaction-type.enum';
import { ApiService } from '../../../core/services/api.service';



@Injectable({
  providedIn: 'root',
})
export class Finance {

  private api = inject(ApiService);

  transactions = signal<Transaction[]>([]);
  savingsGoals = signal<SavingsGoal[]>([]);

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

    this.api
      .get<Transaction[]>('transactions')
      .subscribe(transactions => {

        this.transactions.set(
          transactions
        );

      });

  }

  loadSavingsGoals(): void {

    this.api
      .get<SavingsGoal[]>('savingsGoals')
      .subscribe(goals => {

        this.savingsGoals.set(goals);

      });

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