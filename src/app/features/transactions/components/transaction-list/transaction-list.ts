import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Transaction } from '../../../../shared/models';
import { TransactionType } from '../../../../shared/enums/transaction-type.enum';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
})
export class TransactionList {
  @Input() transactions: Transaction[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() transactionSelect =
    new EventEmitter<Transaction>();

  readonly transactionType =
    TransactionType;

  selectTransaction(
    transaction: Transaction
  ): void {
    this.transactionSelect.emit(transaction);
  }
}
