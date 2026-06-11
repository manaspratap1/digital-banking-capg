import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

import {
  MonthlyStatement,
  StatementMonthOption,
  TransactionService,
} from '../../services/transaction';
import { Transaction } from '../../../../shared/models';
import { TransactionType } from '../../../../shared/enums/transaction-type.enum';

@Component({
  selector: 'app-statement-view',
  imports: [CommonModule],
  templateUrl: './statement-view.html',
  styleUrl: './statement-view.scss',
})
export class StatementViewComponent {
  private transactionService =
    inject(TransactionService);

  private transactionData =
    signal<Transaction[]>([]);

  private activeMonth =
    signal('');

  readonly transactionType =
    TransactionType;

  @Input() visible = false;
  @Input() accountNumber =
    'Account unavailable';
  @Input() currentBalance = 0;

  @Output() close =
    new EventEmitter<void>();

  @Output() selectedMonthChange =
    new EventEmitter<string>();

  readonly statementMonths =
    computed<StatementMonthOption[]>(() =>
      this.transactionService.getStatementMonths(
        this.transactionData()
      )
    );

  readonly statement =
    computed<MonthlyStatement | null>(() =>
      this.transactionService.buildMonthlyStatement(
        this.transactionData(),
        this.activeMonth(),
        this.currentBalance
      )
    );

  constructor() {
    effect(() => {
      const months = this.statementMonths();
      const activeMonth = this.activeMonth();

      if (months.length === 0) {
        if (activeMonth) {
          this.activeMonth.set('');
        }

        return;
      }

      const monthExists = months.some(
        month => month.value === activeMonth
      );

      if (!monthExists) {
        this.updateActiveMonth(
          months[0].value,
          true
        );
      }
    });
  }

  @Input() set selectedMonth(
    value: string
  ) {
    this.activeMonth.set(value ?? '');
  }

  @Input() set transactions(
    value: Transaction[] | null
  ) {
    this.transactionData.set(value ?? []);
  }

  currentMonth(): string {
    return this.activeMonth();
  }

  onMonthChange(event: Event): void {
    const value =
      (event.target as HTMLSelectElement)
        .value;

    this.updateActiveMonth(value, true);
  }

  closeModal(): void {
    this.close.emit();
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  private updateActiveMonth(
    month: string,
    emitChange: boolean
  ): void {
    this.activeMonth.set(month);

    if (emitChange) {
      this.selectedMonthChange.emit(month);
    }
  }
}
