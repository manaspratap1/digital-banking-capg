import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

import { Account, Bill, SavingsGoal, Transaction } from '../../../shared/models';
import { Notification, NotificationCategory } from '../../../shared/models/notification.model';
import { TransactionType } from '../../../shared/enums/transaction-type.enum';
import { BillStatus } from '../../../shared/enums/bill-status.enum';

// ── Thresholds ──────────────────────────────────────────────────────────────
const CURRENT_USER_ID          = 2;
const LOW_BALANCE_THRESHOLD    = 10_000;
const LARGE_DEBIT_THRESHOLD    = 8_000;
const BILL_DUE_DAYS_THRESHOLD  = 7;
const SAVINGS_MILESTONES       = [25, 50, 75, 100];

let _idCounter = 1;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private api = inject(ApiService);

  // ── Signals ──────────────────────────────────────────────────────────────
  notifications = signal<Notification[]>([]);
  isLoading     = signal(false);

  // ── Computed: filter / summary counts ───────────────────────────────────
  unreadCount = computed(() =>
    this.notifications().filter(n => !n.isRead).length
  );

  totalCount = computed(() =>
    this.notifications().length
  );

  transactionAlertsCount = computed(() =>
    this.notifications().filter(n => n.category === 'transactions').length
  );

  billRemindersCount = computed(() =>
    this.notifications().filter(n => n.category === 'bills').length
  );

  savingsCount = computed(() =>
    this.notifications().filter(n => n.category === 'savings').length
  );

  // ── Load: generate notifications dynamically ────────────────────────────
  load(): void {
    this.isLoading.set(true);
    _idCounter = 1;

    let accounts: Account[] = [];
    let transactions: Transaction[] = [];
    let bills: Bill[] = [];
    let savingsGoals: SavingsGoal[] = [];
    let loadedCount = 0;
    const totalCalls = 4;

    const tryBuild = () => {
      loadedCount++;
      if (loadedCount < totalCalls) return;

      const generated: Notification[] = [
        ...this.systemNotifications(),
        ...this.accountNotifications(accounts),
        ...this.transactionNotifications(transactions),
        ...this.billNotifications(bills),
        ...this.savingsNotifications(savingsGoals),
      ];

      generated.sort((a, b) => {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return diff !== 0 ? diff : String(b.id).localeCompare(String(a.id));
      });

      this.notifications.set(generated);
      this.isLoading.set(false);
    };

    this.api.get<Account[]>('accounts').subscribe(res => {
      accounts = res;
      tryBuild();
    });

    this.api.get<Transaction[]>('transactions').subscribe(res => {
      transactions = res;
      tryBuild();
    });

    this.api.get<Bill[]>('bills').subscribe(res => {
      bills = res.filter(b => b.userId === CURRENT_USER_ID);
      tryBuild();
    });

    this.api.get<SavingsGoal[]>('savingsGoals').subscribe(res => {
      savingsGoals = res.filter(g => g.userId === CURRENT_USER_ID);
      tryBuild();
    });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  markAsRead(id: string | number): void {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }

  markAllRead(): void {
    this.notifications.update(list =>
      list.map(n => ({ ...n, isRead: true }))
    );
  }

  deleteNotification(id: string | number): void {
    this.notifications.update(list =>
      list.filter(n => n.id !== id)
    );
  }

  /** Returns notifications matching the active filter tab */
  filterNotifications(filter: 'all' | 'unread' | NotificationCategory): Notification[] {
    const all = this.notifications();

    switch (filter) {
      case 'unread':       return all.filter(n => !n.isRead);
      case 'transactions': return all.filter(n => n.category === 'transactions');
      case 'bills':        return all.filter(n => n.category === 'bills');
      case 'savings':      return all.filter(n => n.category === 'savings');
      default:             return all;
    }
  }

  // ── Generators ────────────────────────────────────────────────────────────

  private systemNotifications(): Notification[] {
    const today = this.today();
    return [
      this.make({
        title:    'Welcome to Digital Banking',
        message:  'Your account is set up and ready to use. Explore your dashboard to get started.',
        category: 'system',
        icon:     'bi-emoji-smile',
        isRead:   true,
        date:     this.daysAgo(today, 7),
      }),
    ];
  }

  private accountNotifications(accounts: Account[]): Notification[] {
    const today = this.today();
    const results: Notification[] = [];

    for (const acc of accounts) {
      if (acc.balance < LOW_BALANCE_THRESHOLD) {
        results.push(this.make({
          title:    'Low Balance Alert',
          message:  `Your ${acc.accountType} account ending in ${acc.accountNumber.slice(-4)} has a balance of ₹${acc.balance.toLocaleString('en-IN')}. Consider topping up.`,
          category: 'transactions',
          icon:     'bi-exclamation-triangle-fill',
          isRead:   false,
          date:     this.daysAgo(today, 0),
        }));
      }
    }

    return results;
  }

  private transactionNotifications(transactions: Transaction[]): Notification[] {
    const results: Notification[] = [];

    for (const tx of transactions) {
      const amt = `₹${tx.amount.toLocaleString('en-IN')}`;
      const cat = tx.category?.toLowerCase();

      // Salary credited
      if (tx.type === TransactionType.CREDIT && cat === 'salary') {
        results.push(this.make({
          title:    'Salary Credited',
          message:  `${amt} credited to your account. Ref: ${tx.referenceNumber}.`,
          category: 'transactions',
          icon:     'bi-cash-coin',
          isRead:   false,
          date:     tx.date,
        }));
        continue;
      }

      // Bonus credited
      if (tx.type === TransactionType.CREDIT && cat === 'bonus') {
        results.push(this.make({
          title:    'Bonus Credited',
          message:  `Performance bonus of ${amt} has been credited. Ref: ${tx.referenceNumber}.`,
          category: 'transactions',
          icon:     'bi-gift-fill',
          isRead:   false,
          date:     tx.date,
        }));
        continue;
      }

      // Refund received
      if (tx.type === TransactionType.CREDIT && cat === 'refund') {
        results.push(this.make({
          title:    'Refund Received',
          message:  `A refund of ${amt} has been processed to your account. Ref: ${tx.referenceNumber}.`,
          category: 'transactions',
          icon:     'bi-arrow-counterclockwise',
          isRead:   false,
          date:     tx.date,
        }));
        continue;
      }

      // Other credits (freelance, etc.) — treat as "transfer received"
      if (tx.type === TransactionType.CREDIT) {
        results.push(this.make({
          title:    'Money Received',
          message:  `${amt} credited — ${tx.description}. Ref: ${tx.referenceNumber}.`,
          category: 'transactions',
          icon:     'bi-arrow-down-circle-fill',
          isRead:   true,
          date:     tx.date,
        }));
        continue;
      }

      // Large debit / transfer
      if (tx.type === TransactionType.DEBIT && tx.amount >= LARGE_DEBIT_THRESHOLD) {
        results.push(this.make({
          title:    'Transfer Successful',
          message:  `${amt} debited for "${tx.description}". Ref: ${tx.referenceNumber}.`,
          category: 'transactions',
          icon:     'bi-send-fill',
          isRead:   false,
          date:     tx.date,
        }));
        continue;
      }

      // Smaller debits — silent, not surfaced as notifications
    }

    return results;
  }

  private billNotifications(bills: Bill[]): Notification[] {
    const today = new Date();
    const results: Notification[] = [];

    for (const bill of bills) {
      const dueDate  = new Date(bill.dueDate);
      const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / 86_400_000);
      const amt      = `₹${bill.amount.toLocaleString('en-IN')}`;

      if (bill.status === BillStatus.PAID) {
        results.push(this.make({
          title:    'Bill Paid Successfully',
          message:  `${bill.billerName} bill of ${amt} has been paid successfully.`,
          category: 'bills',
          icon:     'bi-check-circle-fill',
          isRead:   true,
          date:     bill.dueDate,
        }));
        continue;
      }

      // Pending bill
      if (daysLeft < 0) {
        results.push(this.make({
          title:    'Bill Overdue',
          message:  `${bill.billerName} bill of ${amt} was due on ${this.formatDate(bill.dueDate)}. Please pay to avoid late fees.`,
          category: 'bills',
          icon:     'bi-exclamation-octagon-fill',
          isRead:   false,
          date:     bill.dueDate,
        }));
      } else if (daysLeft === 0) {
        results.push(this.make({
          title:    'Bill Due Today',
          message:  `${bill.billerName} bill of ${amt} is due today.`,
          category: 'bills',
          icon:     'bi-receipt',
          isRead:   false,
          date:     bill.dueDate,
        }));
      } else if (daysLeft <= BILL_DUE_DAYS_THRESHOLD) {
        results.push(this.make({
          title:    'Bill Due Soon',
          message:  `${bill.billerName} bill of ${amt} is due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}, on ${this.formatDate(bill.dueDate)}.`,
          category: 'bills',
          icon:     'bi-receipt-cutoff',
          isRead:   false,
          date:     bill.dueDate,
        }));
      } else {
        results.push(this.make({
          title:    'Upcoming Bill Reminder',
          message:  `${bill.billerName} bill of ${amt} is due on ${this.formatDate(bill.dueDate)}.`,
          category: 'bills',
          icon:     'bi-calendar-event',
          isRead:   true,
          date:     bill.dueDate,
        }));
      }
    }

    return results;
  }

  private savingsNotifications(goals: SavingsGoal[]): Notification[] {
    const today = this.today();
    const results: Notification[] = [];

    for (const goal of goals) {
      if (goal.targetAmount <= 0) continue;

      const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
      const crossed = SAVINGS_MILESTONES.filter(m => pct >= m).sort((a, b) => b - a)[0];

      if (crossed === undefined) continue;

      const isComplete = crossed === 100;

      results.push(this.make({
        title:    isComplete ? `Goal Completed: ${goal.title}` : 'Savings Milestone Reached',
        message:  isComplete
          ? `Congratulations! "${goal.title}" reached its target of ₹${goal.targetAmount.toLocaleString('en-IN')}.`
          : `${goal.title} reached ${crossed}% of its ₹${goal.targetAmount.toLocaleString('en-IN')} target (₹${goal.currentAmount.toLocaleString('en-IN')} saved).`,
        category: 'savings',
        icon:     isComplete ? 'bi-trophy-fill' : 'bi-piggy-bank-fill',
        isRead:   pct < 50,
        date:     this.daysAgo(today, isComplete ? 0 : 3),
      }));
    }

    return results;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private make(partial: Omit<Notification, 'id' | 'userId'>): Notification {
    return {
      ...partial,
      id:     `local_${_idCounter++}`,
      userId: CURRENT_USER_ID,
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