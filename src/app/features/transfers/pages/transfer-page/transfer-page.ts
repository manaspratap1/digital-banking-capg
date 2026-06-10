import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { forkJoin } from 'rxjs';

import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Account, Beneficiary, Transaction } from '../../../../shared/models';
import { TransactionType } from '../../../../shared/enums/transaction-type.enum';

type TransferStep = 'form' | 'review' | 'success';

@Component({
  selector: 'app-transfer-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './transfer-page.html',
  styleUrl: './transfer-page.scss',
})
export class TransferPage implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private authService = inject(AuthService);

  accounts = signal<Account[]>([]);
  beneficiaries = signal<Beneficiary[]>([]);
  step = signal<TransferStep>('form');
  isLoading = signal(false);
  errorMessage = signal('');
  successReference = signal('');

  transferTypes = [
    { value: 'beneficiary', label: 'Beneficiary Transfer' },
    { value: 'own', label: 'Own Account Transfer' },
  ];

  dynamicFields = [
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      placeholder: 'Enter amount',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      placeholder: 'Purpose of transfer',
    },
    {
      name: 'scheduledDate',
      label: 'Schedule Date',
      type: 'date',
      placeholder: '',
    },
  ];

  transferForm = this.fb.group(
    {
      transferType: ['beneficiary', Validators.required],
      fromAccountId: ['', Validators.required],
      beneficiaryId: [''],
      toAccountNumber: [''],
      amount: [
        0,
        [Validators.required, Validators.min(1), Validators.max(100000)],
      ],
      description: ['', [Validators.required, Validators.minLength(3)]],
      scheduleType: ['immediate', Validators.required],
      scheduledDate: [''],
    },
    {
      validators: [
        this.payeeRequiredValidator(),
        this.balanceValidator(),
        this.scheduleDateValidator(),
      ],
    }
  );

  selectedAccount = computed(() => {
    const accountId = this.transferForm.value.fromAccountId;

    return this.accounts().find(
      account => String(account.id) === String(accountId)
    );
  });

  selectedBeneficiary = computed(() => {
    const beneficiaryId = this.transferForm.value.beneficiaryId;

    return this.beneficiaries().find(
      beneficiary => String(beneficiary.id) === String(beneficiaryId)
    );
  });

  ngOnInit(): void {
    this.loadTransferData();

    this.transferForm.valueChanges.subscribe(() => {
      this.errorMessage.set('');
    });
  }

  loadTransferData(): void {
    const userId = this.getUserId();

    this.isLoading.set(true);

    forkJoin({
      accounts: this.api.get<Account[]>(`accounts?userId=${userId}`),
      beneficiaries: this.api.get<Beneficiary[]>(`beneficiaries?userId=${userId}`),
    }).subscribe({
      next: ({ accounts, beneficiaries }) => {
        this.accounts.set(accounts);
        this.beneficiaries.set(beneficiaries);

        if (accounts.length) {
          this.transferForm.patchValue({
            fromAccountId: String(accounts[0].id),
          });
        }

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load transfer details.');
        this.isLoading.set(false);
      },
    });
  }

  goToReview(): void {
    this.transferForm.markAllAsTouched();

    if (this.transferForm.invalid) {
      return;
    }

    this.step.set('review');
  }

  editTransfer(): void {
    this.step.set('form');
  }

  confirmTransfer(): void {
    const account = this.selectedAccount();

    if (!account || this.transferForm.invalid) {
      return;
    }

    const amount = Number(this.transferForm.value.amount);
    const referenceNumber = this.generateReferenceNumber();

    const transaction: Transaction = {
      id: Date.now(),
      accountId: Number(account.id),
      beneficiaryId: this.transferForm.value.beneficiaryId
        ? Number(this.transferForm.value.beneficiaryId)
        : undefined,
      amount,
      type: TransactionType.DEBIT,
      category: 'Transfer',
      date:
        this.transferForm.value.scheduleType === 'scheduled'
          ? String(this.transferForm.value.scheduledDate)
          : this.getToday(),
      description: String(this.transferForm.value.description),
      referenceNumber,
    };

    const updatedAccount: Account = {
      ...account,
      balance: account.balance - amount,
    };

    this.isLoading.set(true);

    forkJoin([
      this.api.create<Transaction>('transactions', transaction),
      this.api.update<Account>('accounts', account.id, updatedAccount),
    ]).subscribe({
      next: () => {
        this.successReference.set(referenceNumber);
        this.step.set('success');
        this.loadTransferData();
        this.transferForm.reset({
          transferType: 'beneficiary',
          amount: 0,
          scheduleType: 'immediate',
        });
      },
      error: () => {
        this.errorMessage.set('Transfer failed. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  startNewTransfer(): void {
    this.successReference.set('');
    this.errorMessage.set('');
    this.step.set('form');
  }

  getFieldError(fieldName: string): string {
    const control = this.transferForm.get(fieldName);

    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required.';
    }

    if (control.errors['min']) {
      return 'Amount must be greater than zero.';
    }

    if (control.errors['max']) {
      return 'Maximum transfer limit is 100000.';
    }

    if (control.errors['minlength']) {
      return 'Enter at least 3 characters.';
    }

    return 'Invalid value.';
  }

  private getUserId(): number {
    return Number(this.authService.currentUser().userId || 2);
  }

  private generateReferenceNumber(): string {
    return `TRF${Date.now()}`;
  }

  private getToday(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private payeeRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const transferType = control.get('transferType')?.value;
      const beneficiaryId = control.get('beneficiaryId')?.value;
      const toAccountNumber = control.get('toAccountNumber')?.value;

      if (transferType === 'beneficiary' && !beneficiaryId) {
        return { beneficiaryRequired: true };
      }

      if (transferType === 'own' && !toAccountNumber) {
        return { accountRequired: true };
      }

      return null;
    };
  }

  private balanceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const accountId = control.get('fromAccountId')?.value;
      const amount = Number(control.get('amount')?.value);
      const account = this.accounts().find(
        item => String(item.id) === String(accountId)
      );

      if (!account || !amount) {
        return null;
      }

      return amount > account.balance ? { insufficientBalance: true } : null;
    };
  }

  private scheduleDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const scheduleType = control.get('scheduleType')?.value;
      const scheduledDate = control.get('scheduledDate')?.value;

      if (scheduleType !== 'scheduled') {
        return null;
      }

      if (!scheduledDate) {
        return { scheduleDateRequired: true };
      }

      const selected = new Date(scheduledDate);
      const today = new Date(this.getToday());
      const maxDate = new Date(this.getToday());
      maxDate.setDate(maxDate.getDate() + 30);

      if (selected < today || selected > maxDate) {
        return { invalidScheduleDate: true };
      }

      return null;
    };
  }
}