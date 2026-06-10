import {
  computed,
  inject,
  Injectable,
  signal
} from '@angular/core';

import { Account, Transaction, User } from '../../../shared/models';
import { ApiService } from '../../../core/services/api.service';



@Injectable({
  providedIn: 'root',
})
export class Admin {

  private api = inject(ApiService);

  users = signal<User[]>([]);

  accounts = signal<Account[]>([]);

  transactions = signal<Transaction[]>([]);

  selectedUser = signal<User | null>(null);

  selectedAccounts = signal<Account[]>([]);

  selectedTransactions = signal<Transaction[]>([]);

  isModalOpen = signal(false);

  searchTerm = signal('');

  loadUsers(): void {

    this.api
      .get<User[]>('users')
      .subscribe(users => {

        this.users.set(users);

      });

  }

  loadAccounts(): void {

    this.api
      .get<Account[]>('accounts')
      .subscribe(accounts => {

        this.accounts.set(accounts);

      });

  }

  loadTransactions(): void {

    this.api
      .get<Transaction[]>(
        'transactions'
      )
      .subscribe(transactions => {

        this.transactions.set(
          transactions
        );

      });

  }

  usersCount = computed(() => this.users().length );

  accountsCount = computed(() => this.accounts().length);

  transactionsCount = computed( () => this.transactions().length);

  openUserDetails(userId: string | number): void {

    const user =
      this.users()
        .find(
          user =>
            String(user.id) === String(userId)
        );

    if (!user) {
      return;
    }

    const accounts =
      this.accounts()
        .filter(
          account =>
            String(account.userId) === String(userId)
        );

    const accountIds =
      accounts.map(
        account =>
          String(account.id)
      );

    const transactions =
      this.transactions()
        .filter(
          transaction =>
            accountIds.includes(
              String(transaction.accountId)
            )
        );

    this.selectedUser.set(user);

    this.selectedAccounts.set(accounts);

    this.selectedTransactions.set(transactions);

    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(
      false
    );

  }


  filteredUsers = computed(() => {

    const search =
      this.searchTerm()
        .toLowerCase();

    return this.users()
      .filter(user =>
        user.name
          .toLowerCase()
          .includes(search)
      );

  });

}