import {
  Component,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Admin } from '../../services/admin';

@Component({
  selector: 'app-users-table',
  imports: [FormsModule],
  templateUrl: './users-table.html',
  styleUrl: './users-table.scss',
})
export class UsersTable {

  admin = inject(Admin);
  salaryModalOpen = false;
  selectedUserId: string | number | null = null;
  salaryAmount: number | null = null;
  isSalarySaving = false;
  salarySuccess = false;
  salaryError = '';

  viewUser( userId: string | number): void {
    this.admin
      .openUserDetails(
        userId
      );

  }

  onSearch( event: Event): void {
    const value =
      (event.target as HTMLInputElement)
        .value;

    this.admin
      .searchTerm
      .set(value);

  }

  openSalaryModal(userId: number | string): void {
    this.selectedUserId = userId;
    this.salaryAmount = null;
    this.salarySuccess = false;
    this.salaryError = '';
    this.salaryModalOpen = true;
  }

  closeSalaryModal(): void {
    this.salaryModalOpen = false;
    this.selectedUserId = null;
    this.salaryAmount = null;
    this.salarySuccess = false;
    this.salaryError = '';
    this.isSalarySaving = false;
  }

  submitSalary(): void {
    const amount = Number(this.salaryAmount);

    if (!this.selectedUserId || !amount || amount <= 0) {
      this.salaryError = 'Enter a valid salary amount.';
      return;
    }

    this.isSalarySaving = true;
    this.salaryError = '';

    this.admin
      .creditSalary(this.selectedUserId, amount)
      .subscribe({
        next: () => {
          this.admin.loadAccounts();
          this.admin.loadTransactions();
          this.salarySuccess = true;
          this.isSalarySaving = false;

          setTimeout(() => {
            this.closeSalaryModal();
          }, 1500);
        },
        error: () => {
          this.isSalarySaving = false;
          this.salaryError = 'Unable to credit salary.';
        }
      });
  }

}
