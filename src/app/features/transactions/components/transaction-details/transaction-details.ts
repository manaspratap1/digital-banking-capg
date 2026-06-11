import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Transaction } from '../../../../shared/models';
import { TransactionType } from '../../../../shared/enums/transaction-type.enum';

@Component({
  selector: 'app-transaction-details',
  imports: [CommonModule],
  templateUrl: './transaction-details.html',
  styleUrl: './transaction-details.scss',
})
export class TransactionDetails {
  @Input() visible = false;
  @Input() transaction: Transaction | null = null;

  @Output() close =
    new EventEmitter<void>();

  readonly transactionType =
    TransactionType;

  closePanel(): void {
    this.close.emit();
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
