import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Beneficiary } from '../../../../shared/models';

@Component({
  selector: 'app-beneficiary-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './beneficiary-page.html',
  styleUrl: './beneficiary-page.scss',
})
export class BeneficiaryPage implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private authService = inject(AuthService);

  beneficiaries = signal<Beneficiary[]>([]);
  isLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  beneficiaryForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      bankName: ['', Validators.required],
      accountNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{8,18}$')],
      ],
      confirmAccountNumber: ['', Validators.required],
    },
    {
      validators: [
        this.accountNumberMatchValidator(),
        this.duplicateBeneficiaryValidator(),
      ],
    }
  );

  ngOnInit(): void {
    this.loadBeneficiaries();
  }

  loadBeneficiaries(): void {
    this.isLoading.set(true);

    this.api
      .get<Beneficiary[]>('beneficiaries')
      .subscribe({
        next: beneficiaries => {
          const currentUserId = String(this.getUserId());

          this.beneficiaries.set(
            beneficiaries.filter(
              beneficiary =>
                String(beneficiary.userId) === String(currentUserId)
            )
          );
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Unable to load beneficiaries.');
          this.isLoading.set(false);
        },
      });
  }

  addBeneficiary(): void {
    this.beneficiaryForm.markAllAsTouched();
    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.beneficiaryForm.invalid) {
      return;
    }

    const formValue = this.beneficiaryForm.getRawValue();

    const beneficiary: Beneficiary = {
      id: String(Date.now()),
      userId: this.getUserId(),
      name: String(formValue.name),
      bankName: String(formValue.bankName),
      accountNumber: String(formValue.accountNumber),
    };

    this.isLoading.set(true);

    this.api.create<Beneficiary>('beneficiaries', beneficiary).subscribe({
      next: () => {
        this.successMessage.set('Beneficiary added successfully.');
        this.beneficiaryForm.reset();
        this.loadBeneficiaries();
      },
      error: () => {
        this.errorMessage.set('Unable to add beneficiary.');
        this.isLoading.set(false);
      },
    });
  }

  deleteBeneficiary(id: string | number): void {
    this.api.delete('beneficiaries', id).subscribe(() => {
      this.loadBeneficiaries();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.beneficiaryForm.get(fieldName);

    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required.';
    }

    if (control.errors['minlength']) {
      return 'Enter at least 3 characters.';
    }

    if (control.errors['pattern']) {
      return 'Enter a valid account number.';
    }

    return 'Invalid value.';
  }

  private getUserId(): string {
    return String(this.authService.currentUser().userId ?? 2);
  }

  private accountNumberMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const accountNumber = control.get('accountNumber')?.value;
      const confirmAccountNumber = control.get('confirmAccountNumber')?.value;

      if (!accountNumber || !confirmAccountNumber) {
        return null;
      }

      return accountNumber === confirmAccountNumber
        ? null
        : { accountNumberMismatch: true };
    };
  }

  private duplicateBeneficiaryValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const accountNumber = control.get('accountNumber')?.value;

      if (!accountNumber) {
        return null;
      }

      const exists = this.beneficiaries().some(
        beneficiary =>
          String(beneficiary.accountNumber) === String(accountNumber)
      );

      return exists ? { duplicateBeneficiary: true } : null;
    };
  }
}
