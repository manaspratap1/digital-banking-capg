import { inject, Injectable } from '@angular/core';

import { map, Observable, of, switchMap } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Account, Transaction } from '../../../shared/models';
import { TransactionType } from '../../../shared/enums/transaction-type.enum';

export interface TransactionSummary {
  credits: number;
  debits: number;
  netChange: number;
  totalTransactions: number;
}

export interface StatementMonthOption {
  value: string;
  label: string;
}

export interface MonthlyStatement {
  monthLabel: string;
  totalCredits: number;
  totalDebits: number;
  currentBalance: number;
  transactions: Transaction[];
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private api = inject(ApiService);
  private authService = inject(AuthService);

  loadCustomerTransactions(): Observable<Transaction[]> {
    return this.loadCustomerAccounts().pipe(
      switchMap(accounts => {
        const accountIds = accounts.map(account => String(account.id));

        if (accountIds.length === 0) {
          return of([] as Transaction[]);
        }

        return this.api.get<Transaction[]>('transactions').pipe(
          map(transactions =>
            transactions.filter(transaction =>
              accountIds.includes(String(transaction.accountId))
            )
          )
        );
      }),
      map(transactions => this.sortTransactions(transactions))
    );
  }

  loadCustomerAccounts(): Observable<Account[]> {
    return this.api.get<Account[]>('accounts').pipe(
      map(accounts =>
        accounts.filter(
          account =>
            String(account.userId) === String(this.getUserId())
        )
      )
    );
  }

  getCategoryOptions(transactions: Transaction[]): string[] {
    const categories = Array.from(
      new Set(
        transactions
          .map(transaction => transaction.category)
          .filter(category => category.trim().length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));

    return ['All', ...categories];
  }

  createHistorySummary(transactions: Transaction[]): TransactionSummary {
    const credits = transactions
      .filter(transaction => transaction.type === TransactionType.CREDIT)
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const debits = transactions
      .filter(transaction => transaction.type === TransactionType.DEBIT)
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      credits,
      debits,
      netChange: credits - debits,
      totalTransactions: transactions.length,
    };
  }

  createStatementAccountLabel(
    accounts: Account[]
  ): string {
    if (accounts.length === 0) {
      return 'Account unavailable';
    }

    if (accounts.length > 1) {
      return 'Multiple Accounts';
    }

    return this.maskAccountNumber(
      accounts[0].accountNumber
    );
  }

  createStatementCurrentBalance(
    accounts: Account[]
  ): number {
    return accounts.reduce(
      (sum, account) => sum + account.balance,
      0
    );
  }

  getStatementMonths(transactions: Transaction[]): StatementMonthOption[] {
    return Array.from(
      new Set(
        transactions.map(transaction => this.toMonthKey(transaction.date))
      )
    )
      .sort((a, b) => b.localeCompare(a))
      .map(month => ({
        value: month,
        label: this.formatMonthLabel(month),
      }));
  }

  buildMonthlyStatement(
    transactions: Transaction[],
    monthKey: string,
    currentBalance: number
  ): MonthlyStatement | null {
    if (!monthKey) {
      return null;
    }

    const sortedTransactions = this.sortTransactions(transactions);
    const statementTransactions = sortedTransactions.filter(transaction =>
      this.toMonthKey(transaction.date) === monthKey
    );

    const totalCredits = statementTransactions
      .filter(transaction => transaction.type === TransactionType.CREDIT)
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalDebits = statementTransactions
      .filter(transaction => transaction.type === TransactionType.DEBIT)
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const statementNetChange =
      totalCredits - totalDebits;

    const transactionsAfterSelectedMonth =
      sortedTransactions.filter(transaction =>
        this.toMonthKey(transaction.date) > monthKey
      );

    const netChangeAfterSelectedMonth =
      transactionsAfterSelectedMonth.reduce(
        (sum, transaction) =>
          sum + this.toSignedAmount(transaction),
        0
      );

    const monthEndBalance =
      currentBalance - netChangeAfterSelectedMonth;

    const openingBalance =
      monthEndBalance - statementNetChange;

    return {
      monthLabel: this.formatMonthLabel(monthKey),
      totalCredits,
      totalDebits,
      currentBalance: openingBalance + statementNetChange,
      transactions: statementTransactions,
    };
  }

  private getUserId(): string {
    return String(this.authService.currentUser().userId ?? 2);
  }

  private sortTransactions(transactions: Transaction[]): Transaction[] {
    return [...transactions].sort((a, b) => {
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

  private toSignedAmount(transaction: Transaction): number {
    return transaction.type === TransactionType.CREDIT
      ? transaction.amount
      : -transaction.amount;
  }

  private toMonthKey(date: string): string {
    return date.slice(0, 7);
  }

  private formatMonthLabel(monthKey: string): string {
    const [year, month] = monthKey
      .split('-')
      .map(value => Number(value));

    return new Intl.DateTimeFormat('en-IN', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(year, month - 1, 1));
  }

  private maskAccountNumber(
    accountNumber: string
  ): string {
    const visibleDigits =
      accountNumber.slice(-4);

    return `XXXX${visibleDigits}`;
  }
}
