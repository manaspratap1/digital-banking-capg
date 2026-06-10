import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, catchError, of } from 'rxjs';
import { environment } from '../../../../environments';
import { Notification, NotificationCategory, NotificationPriority, NotificationType } from '../../../shared/models/notification.model';
import { Account } from '../../../shared/models/account.model';
import { Transaction } from '../../../shared/models/transaction.model';
import { Bill } from '../../../shared/models/bill.model';
import { SavingsGoal } from '../../../shared/models/savings-goal.model';
import { TransactionType } from '../../../shared/enums/transaction-type.enum';
import { BillStatus } from '../../../shared/enums/bill-status.enum';

// ── Thresholds ────────────────────────────────────────────────────────────────
const LOW_BALANCE_THRESHOLD   = 10_000;   // ₹10,000
const LARGE_DEBIT_THRESHOLD   = 8_000;    // ₹8,000
const BILL_DUE_DAYS_THRESHOLD = 7;        // warn if due within 7 days
const SAVINGS_MILESTONES      = [25, 50, 75, 100];
let _idCounter = 1;

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // ── Signals ─────────────────────────────────────────────────────────────────
  readonly notifications = signal<Notification[]>([]);
  readonly isLoading     = signal(false);
  readonly error         = signal<string | null>(null);

  // ── Computed ─────────────────────────────────────────────────────────────────
  readonly unreadCount = computed(() =>
    this.notifications().filter(n => !n.isRead).length
  );

  readonly totalCount = computed(() => this.notifications().length);

  readonly importantCount = computed(() =>
    this.notifications().filter(n => n.priority === 'high' || n.priority === 'critical').length
  );

  readonly securityCount = computed(() =>
    this.notifications().filter(n => n.category === 'security').length
  );

  // ── Public API ───────────────────────────────────────────────────────────────

  load(userId: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    _idCounter = 1;

    forkJoin({
      accounts:     this.http.get<Account[]>    (`${this.base}/accounts?userId=${userId}`),
      transactions: this.http.get<Transaction[]>(`${this.base}/transactions`),
      bills:        this.http.get<Bill[]>        (`${this.base}/bills?userId=${userId}`),
      goals:        this.http.get<SavingsGoal[]> (`${this.base}/savingsGoals?userId=${userId}`)
    }).pipe(
      catchError(err => {
        console.error('NotificationService load error:', err);
        this.error.set('Failed to load notifications.');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe(data => {
      if (!data) return;

      const { accounts, transactions, bills, goals } = data;

      // Filter transactions that belong to this user's accounts
      const accountIds = new Set(accounts.map(a => Number(a.id)));
      const userTxns   = transactions.filter(t => accountIds.has(Number(t.accountId)));

      const generated: Notification[] = [
        ...this.systemNotifications(userId),
        ...this.accountNotifications(accounts, userId),
        ...this.transactionNotifications(userTxns, userId),
        ...this.billNotifications(bills, userId),
        ...this.savingsNotifications(goals, userId),
      ];

      // Sort newest-first by date then by id (deterministic)
      generated.sort((a, b) => {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return diff !== 0 ? diff : String(b.id).localeCompare(String(a.id));
      });

      this.notifications.set(generated);
      this.isLoading.set(false);
    });
  }

  markAsRead(id: string | number): void {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }

  markAllRead(): void {
    this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
  }

  deleteNotification(id: string | number): void {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }

  /** Filter + search helper used by the notification page */
  filterNotifications(
    filter: string,
    searchQuery: string
  ): Notification[] {
    let result = this.notifications();

    switch (filter) {
      case 'unread':       result = result.filter(n => !n.isRead);                    break;
      case 'read':         result = result.filter(n => n.isRead);                     break;
      case 'transactions': result = result.filter(n => n.category === 'transactions'); break;
      case 'savings':      result = result.filter(n => n.category === 'savings');      break;
      case 'security':     result = result.filter(n => n.category === 'security');     break;
      case 'system':       result = result.filter(n => n.category === 'system');       break;
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q)
      );
    }

    return result;
  }

  getIcon(type: NotificationType): string {
    const map: Record<NotificationType, string> = {
      salary_credited:    '💰',
      transfer_success:   '↗️',
      bill_due:           '📋',
      savings_progress:   '🎯',
      low_balance:        '⚠️',
      login_alert:        '🔐',
      kyc_reminder:       '✅',
      investment_update:  '📈',
    };
    return map[type] ?? '🔔';
  }

  getPriorityLabel(priority: NotificationPriority): string | null {
    if (priority === 'critical') return 'Critical';
    if (priority === 'high')     return 'Important';
    return null;
  }

  // ── Private generators ───────────────────────────────────────────────────────

  private systemNotifications(userId: number): Notification[] {
    const today = this.today();
    return [
      this.make({
        userId,
        title:    'Welcome to Nexora',
        message:  'Your account is active. Explore quick actions from your dashboard.',
        type:     'kyc_reminder',
        category: 'system',
        priority: 'normal',
        isRead:   true,
        date:     this.daysAgo(today, 7),
      }),
      this.make({
        userId,
        title:    'KYC Verified',
        message:  'Your KYC verification is complete. All features are unlocked.',
        type:     'kyc_reminder',
        category: 'security',
        priority: 'normal',
        isRead:   true,
        date:     this.daysAgo(today, 6),
      }),
      this.make({
        userId,
        title:    'Login from new device',
        message:  'A new login was detected on your account. If this wasn\'t you, secure your account immediately.',
        type:     'login_alert',
        category: 'security',
        priority: 'high',
        isRead:   false,
        date:     this.daysAgo(today, 1),
      }),
    ];
  }

  private accountNotifications(accounts: Account[], userId: number): Notification[] {
    const today   = this.today();
    const results: Notification[] = [];

    for (const acc of accounts) {
      if (acc.balance < LOW_BALANCE_THRESHOLD) {
        results.push(this.make({
          userId,
          title:    'Low Balance Alert',
          message:  `Your ${acc.accountType} account (••••${acc.accountNumber.slice(-4)}) balance is ₹${acc.balance.toLocaleString('en-IN')}. Consider topping up.`,
          type:     'low_balance',
          category: 'transactions',
          priority: 'critical',
          isRead:   false,
          date:     this.daysAgo(today, 0),
        }));
      }
    }

    return results;
  }

  private transactionNotifications(txns: Transaction[], userId: number): Notification[] {
    const results: Notification[] = [];

    for (const tx of txns) {
      const amt = `₹${tx.amount.toLocaleString('en-IN')}`;

      // Salary credit
      if (tx.type === TransactionType.CREDIT && tx.category?.toLowerCase() === 'salary') {
        results.push(this.make({
          userId,
          title:    'Salary Credited',
          message:  `${amt} has been credited to your account. Ref: ${tx.referenceNumber}.`,
          type:     'salary_credited',
          category: 'transactions',
          priority: 'high',
          isRead:   false,
          date:     tx.date,
        }));
        continue;
      }

      // Bonus credit
      if (tx.type === TransactionType.CREDIT && tx.category?.toLowerCase() === 'bonus') {
        results.push(this.make({
          userId,
          title:    'Bonus Credited',
          message:  `Performance bonus of ${amt} credited. Ref: ${tx.referenceNumber}.`,
          type:     'salary_credited',
          category: 'transactions',
          priority: 'high',
          isRead:   false,
          date:     tx.date,
        }));
        continue;
      }

      // Freelance / other credits
      if (tx.type === TransactionType.CREDIT && tx.category?.toLowerCase() !== 'refund') {
        results.push(this.make({
          userId,
          title:    'Amount Received',
          message:  `${amt} credited – ${tx.description}. Ref: ${tx.referenceNumber}.`,
          type:     'transfer_success',
          category: 'transactions',
          priority: 'normal',
          isRead:   true,
          date:     tx.date,
        }));
        continue;
      }

      // Refund
      if (tx.type === TransactionType.CREDIT && tx.category?.toLowerCase() === 'refund') {
        results.push(this.make({
          userId,
          title:    'Refund Received',
          message:  `Refund of ${amt} has been processed. Ref: ${tx.referenceNumber}.`,
          type:     'transfer_success',
          category: 'transactions',
          priority: 'normal',
          isRead:   false,
          date:     tx.date,
        }));
        continue;
      }

      // Large debit
      if (tx.type === TransactionType.DEBIT && tx.amount >= LARGE_DEBIT_THRESHOLD) {
        results.push(this.make({
          userId,
          title:    'Large Debit Transaction',
          message:  `${amt} debited for "${tx.description}". If unrecognised, contact support. Ref: ${tx.referenceNumber}.`,
          type:     'transfer_success',
          category: 'transactions',
          priority: 'high',
          isRead:   false,
          date:     tx.date,
        }));
        continue;
      }

      // Regular debit (silent — don't flood with every small txn)
    }

    return results;
  }

  private billNotifications(bills: Bill[], userId: number): Notification[] {
    const today   = new Date();
    const results: Notification[] = [];

    for (const bill of bills) {
      const dueDate  = new Date(bill.dueDate);
      const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / 86_400_000);
      const amt      = `₹${bill.amount.toLocaleString('en-IN')}`;

      if (bill.status === BillStatus.PAID) {
        results.push(this.make({
          userId,
          title:    'Bill Paid Successfully',
          message:  `${bill.billerName} bill of ${amt} has been paid successfully.`,
          type:     'bill_due',
          category: 'transactions',
          priority: 'normal',
          isRead:   true,
          date:     bill.dueDate,
        }));
        continue;
      }

      // Pending bill
      if (bill.status === BillStatus.PENDING) {
        const isOverdue = daysLeft < 0;
        const isUrgent  = daysLeft >= 0 && daysLeft <= BILL_DUE_DAYS_THRESHOLD;

        if (isOverdue) {
          results.push(this.make({
            userId,
            title:    'Bill Overdue',
            message:  `${bill.billerName} bill of ${amt} was due on ${this.formatDate(bill.dueDate)}. Please pay immediately to avoid late fees.`,
            type:     'bill_due',
            category: 'transactions',
            priority: 'critical',
            isRead:   false,
            date:     bill.dueDate,
          }));
        } else if (isUrgent) {
          results.push(this.make({
            userId,
            title:    'Bill Due Soon',
            message:  `${bill.billerName} bill of ${amt} is due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Pay before ${this.formatDate(bill.dueDate)}.`,
            type:     'bill_due',
            category: 'transactions',
            priority: 'high',
            isRead:   false,
            date:     bill.dueDate,
          }));
        } else {
          results.push(this.make({
            userId,
            title:    'Upcoming Bill Reminder',
            message:  `${bill.billerName} bill of ${amt} is due on ${this.formatDate(bill.dueDate)}.`,
            type:     'bill_due',
            category: 'transactions',
            priority: 'normal',
            isRead:   false,
            date:     bill.dueDate,
          }));
        }
      }
    }

    return results;
  }

  private savingsNotifications(goals: SavingsGoal[], userId: number): Notification[] {
    const today   = this.today();
    const results: Notification[] = [];

    for (const goal of goals) {
      if (goal.targetAmount <= 0) continue;

      const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);

      // Find the highest milestone crossed
      const crossed = SAVINGS_MILESTONES
        .filter(m => pct >= m)
        .sort((a, b) => b - a)[0];

      if (crossed === undefined) continue;

      const isComplete = crossed === 100;

      results.push(this.make({
        userId,
        title:    isComplete ? `Goal Achieved: ${goal.title}!` : `Savings Milestone Reached`,
        message:  isComplete
          ? `Congratulations! You've fully funded your "${goal.title}" goal of ₹${goal.targetAmount.toLocaleString('en-IN')}.`
          : `You've reached ${crossed}% of your "${goal.title}" goal. ₹${goal.currentAmount.toLocaleString('en-IN')} saved of ₹${goal.targetAmount.toLocaleString('en-IN')}.`,
        type:     'savings_progress',
        category: 'savings',
        priority: isComplete ? 'high' : 'normal',
        isRead:   pct < 50,          // unread only for recent-ish milestones
        date:     this.daysAgo(today, isComplete ? 0 : 3),
      }));
    }

    return results;
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  private make(partial: Omit<Notification, 'id' | 'isLocal'>): Notification {
    return {
      ...partial,
      id:      `local_${_idCounter++}`,
      isLocal: true,
    };
  }

  private today(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private daysAgo(from: Date, days: number): string {
    const d = new Date(from);
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  }

  private formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }
}