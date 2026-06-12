// import { Injectable, inject, signal, computed } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, forkJoin, catchError, of, tap } from 'rxjs';
// import { environment } from '../../../../environments';

// import { Account } from '../../../shared/models/account.model';
// import { Transaction } from '../../../shared/models/transaction.model';
// import { Notification } from '../../../shared/models/notification.model';
// import { SavingsGoal } from '../../../shared/models/savings-goal.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class DashboardService {

//   private http = inject(HttpClient);

//   private baseUrl = environment.apiUrl;

//   readonly accounts = signal<Account[]>([]);
//   readonly recentTransactions = signal<Transaction[]>([]);
//   readonly notifications = signal<Notification[]>([]);
//   readonly savingsGoals = signal<SavingsGoal[]>([]);

//   readonly isLoading = signal(false);

//   readonly totalBalance = computed(() =>
//     this.accounts().reduce(
//       (sum, account) => sum + account.balance,
//       0
//     )
//   );

//   readonly unreadNotifications = computed(() =>
//     this.notifications().filter(n => !n.isRead).length
//   );

//   loadDashboardData(userId: number): Observable<any> {

//     this.isLoading.set(true);

//     return forkJoin([
//       this.http.get<Account[]>(`${this.baseUrl}/accounts`),
//       this.http.get<Transaction[]>(`${this.baseUrl}/transactions`),
//       this.http.get<Notification[]>(`${this.baseUrl}/notifications`),
//       this.http.get<SavingsGoal[]>(`${this.baseUrl}/savingsGoals`)

//     ]).pipe(

//       tap(([accounts, transactions, notifications, goals]) => {

//         console.log('Accounts:', accounts);
//         console.log('Transactions:', transactions);
//         console.log('Notifications:', notifications);
//         console.log('Goals:', goals);

//         const userAccounts = accounts.filter(
//           account =>
//             String(account.userId) === String(userId)
//         );
//         const userAccountIds = userAccounts.map(account => String(account.id));

//         this.accounts.set(userAccounts);
//         this.recentTransactions.set(
//           transactions
//             .filter(transaction =>
//               userAccountIds.includes(String(transaction.accountId))
//             )
//             .slice(0, 5)
//         );
//         this.notifications.set(
//           notifications.filter(
//             notification =>
//               String(notification.userId) === String(userId)
//           )
//         );
//         this.savingsGoals.set(
//           goals.filter(
//             goal =>
//               String(goal.userId) === String(userId)
//           )
//         );

//         this.isLoading.set(false);
//       }),

//       catchError(error => {

//         console.error(error);

//         this.isLoading.set(false);

//         return of(null);
//       })
//     );
//   }
// }
