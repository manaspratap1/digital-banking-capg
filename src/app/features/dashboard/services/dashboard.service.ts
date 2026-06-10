import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, catchError, of, tap, map } from 'rxjs';
import { environment } from '../../../../environments';
import { Account } from '../../../shared/models/account.model';
import { Transaction } from '../../../shared/models/transaction.model';
import { Notification } from '../../../shared/models/notification.model';
import { SavingsGoal } from '../../../shared/models/savings-goal.model';
const RECENT_TXN_LIMIT = 5;
const PREVIEW_NOTIF_LIMIT = 5;
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  readonly accounts = signal<Account[]>([]);
  readonly recentTransactions = signal<Transaction[]>([]);
  readonly notifications = signal<Notification[]>([]);
  readonly savingsGoals = signal<SavingsGoal[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly totalBalance = computed(() =>
    this.accounts().reduce((sum, account) => sum + account.balance, 0)
  );
  readonly unreadNotifications = computed(() =>
    this.notifications().filter(n => !n.isRead).length
  );
  readonly previewNotifications = computed(() =>
    this.sortByDateDesc(this.notifications()).slice(0, PREVIEW_NOTIF_LIMIT)
  );
  loadDashboardData(userId: number): Observable<void> {
    this.isLoading.set(true);
    this.error.set(null);
    return forkJoin({
      accounts: this.http.get<Account[]>(
        `${this.baseUrl}/accounts?userId=${userId}`
      ),
      transactions: this.http.get<Transaction[]>(
        `${this.baseUrl}/transactions`
      ),
      notifications: this.http.get<Notification[]>(
        `${this.baseUrl}/notifications?userId=${userId}`
      ),
      savingsGoals: this.http.get<SavingsGoal[]>(
        `${this.baseUrl}/savingsGoals?userId=${userId}`
      )
    }).pipe(
      map(({ accounts, transactions, notifications, savingsGoals }) => {
        const accountIds = new Set(
          accounts.map(account => Number(account.id))
        );
        const userTransactions = transactions
          .filter(txn => accountIds.has(Number(txn.accountId)))
          .sort((a, b) => this.toTimestamp(b.date) - this.toTimestamp(a.date))
          .slice(0, RECENT_TXN_LIMIT);
        const sortedNotifications = this.sortByDateDesc(notifications);
        return {
          accounts,
          transactions: userTransactions,
          notifications: sortedNotifications,
          savingsGoals
        };
      }),
      tap(({ accounts, transactions, notifications, savingsGoals }) => {
        this.accounts.set(accounts);
        this.recentTransactions.set(transactions);
        this.notifications.set(notifications);
        this.savingsGoals.set(savingsGoals);
        this.isLoading.set(false);
      }),
      map(() => void 0),
      catchError(err => {
        console.error('Dashboard load failed:', err);
        this.error.set('Unable to load dashboard data. Please try again.');
        this.isLoading.set(false);
        return of(void 0);
      })
    );
  }
  private sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
    return [...items].sort(
      (a, b) => this.toTimestamp(b.date) - this.toTimestamp(a.date)
    );
  }
  private toTimestamp(date: string): number {
    const parsed = new Date(date).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }
}