import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SavingsGoalCard } from '../../components/savings-goal-card/savings-goal-card';
import { SpendingChart } from '../../components/spending-chart/spending-chart';
import { SpendingSummaryCard } from '../../components/spending-summary-card/spending-summary-card';
import { RecentInsightsCard } from '../../components/recent-insights-card/recent-insights-card';
import { Finance } from '../../services/finance';
import { SavingsGoal } from '../../../../shared/models';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-finance-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SpendingSummaryCard,
    SpendingChart,
    SavingsGoalCard,
    RecentInsightsCard,
  ],
  templateUrl: './finance-page.html',
  styleUrl: './finance-page.scss',
})
export class FinancePage implements OnInit {
  private fb = inject(FormBuilder);
  finance = inject(Finance);
  private authService = inject(AuthService);

  goalModalOpen = signal(false);
  goalSuccessMessage = signal('');
  goalErrorMessage = signal('');

  goalForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    targetAmount: [0, [Validators.required, Validators.min(1)]],
    currentAmount: [0, [Validators.min(0)]],
  });

  ngOnInit(): void {
    this.finance.loadTransactions();
    this.finance.loadSavingsGoals();
  }

  openGoalModal(): void {
    this.goalSuccessMessage.set('');
    this.goalErrorMessage.set('');
    this.goalForm.reset({
      title: '',
      targetAmount: 0,
      currentAmount: 0,
    });
    this.goalModalOpen.set(true);
  }

  closeGoalModal(): void {
    this.goalModalOpen.set(false);
    this.goalSuccessMessage.set('');
    this.goalErrorMessage.set('');
  }

  submitGoal(): void {
    this.goalForm.markAllAsTouched();
    this.goalSuccessMessage.set('');
    this.goalErrorMessage.set('');

    if (this.goalForm.invalid) {
      return;
    }

    const currentUserId = String(this.authService.currentUser().userId ?? 2);
    const value = this.goalForm.getRawValue();

    const goal: SavingsGoal = {
      id: String(Date.now()),
      userId: currentUserId,
      title: String(value.title),
      targetAmount: Number(value.targetAmount ?? 0),
      currentAmount: Number(value.currentAmount ?? 0),
    };

    this.finance.addSavingsGoal(goal).subscribe({
      next: () => {
        this.finance.loadSavingsGoals();
        this.goalSuccessMessage.set('Savings goal added successfully.');
        this.goalForm.reset({
          title: '',
          targetAmount: 0,
          currentAmount: 0,
        });
      },
      error: () => {
        this.goalErrorMessage.set('Unable to add savings goal.');
      },
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.goalForm.get(fieldName);

    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required.';
    }

    if (control.errors['minlength']) {
      return 'Enter at least 3 characters.';
    }

    if (control.errors['min']) {
      return 'Enter a value greater than zero.';
    }

    return 'Invalid value.';
  }
}
