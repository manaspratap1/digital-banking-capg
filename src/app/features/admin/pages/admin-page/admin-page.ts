import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { Admin } from '../../services/admin';

import { UsersTable } from '../../components/users-table/users-table';
import { AccountsTable } from '../../components/accounts-table/accounts-table';
import { TransactionsTable } from '../../components/transactions-table/transactions-table';
import { UserDetailsModal } from '../../components/user-details-modal/user-details-modal';

@Component({
  selector: 'app-admin-page',
  imports: [ UsersTable, AccountsTable, TransactionsTable, UserDetailsModal],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
})
export class AdminPage
  implements OnInit {

  admin = inject(Admin);

  ngOnInit(): void {

    this.admin.loadUsers();

    this.admin.loadAccounts();

    this.admin.loadTransactions();

  }

}