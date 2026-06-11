import { computed, inject, Injectable, signal } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { Account, Bill, Transaction } from '../../../shared/models';
import { BillStatus } from '../../../shared/enums/bill-status.enum';
import { TransactionType } from '../../../shared/enums/transaction-type.enum';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BillService {

  private api = inject(ApiService);
  private authService = inject(AuthService);

  bills = signal<Bill[]>([]);

  pendingBillsCount = computed(() =>
    this.bills()
      .filter(
        bill =>
          bill.status === BillStatus.PENDING
      )
      .length
  );

  paidBillsCount = computed(() =>
    this.bills()
      .filter(
        bill =>
          bill.status === BillStatus.PAID
      )
      .length
  );

  totalPendingAmount = computed(() =>
    this.bills()
      .filter(
        bill =>
          bill.status === BillStatus.PENDING
      )
      .reduce(
        (sum, bill) =>
          sum + bill.amount,
        0
      )
  );

  loadBills(): void {
    this.api.get<Bill[]>('bills')
      .subscribe(bills => {
        const currentUserId = String(this.authService.currentUser().userId ?? 2);

        this.bills.set(
          bills.filter(
            bill =>
              String(bill.userId) === String(currentUserId)
          )
        );
      });
  }

  addBill(bill: Bill) {

    return this.api.create(
      'bills',
      bill
    );

  }

  markAsPaid(bill: Bill): Observable<unknown> {
    const currentUserId = String(this.authService.currentUser().userId ?? 2);
    const updatedBill = {
      ...bill,
      status: BillStatus.PAID
    };

    return this.api.get<Account[]>('accounts').pipe(
      map(accounts =>
        accounts.find(
          account =>
            String(account.userId) === String(currentUserId)
        )
      ),
      switchMap(account => {
        const billUpdate$ = this.api.update(
          'bills',
          bill.id,
          updatedBill
        );

        if (!account) {
          return billUpdate$;
        }

        const updatedAccount: Account = {
          ...account,
          balance: account.balance - bill.amount
        };

        const billPaymentTransaction: Transaction = {
          id: String(Date.now()),
          accountId: String(account.id),
          beneficiaryId: undefined,
          amount: bill.amount,
          type: TransactionType.DEBIT,
          category: bill.category || 'Bill Payment',
          date: new Date().toISOString().slice(0, 10),
          description: `${bill.billerName} bill payment`,
          referenceNumber: `BILL${Date.now()}`
        };

        return forkJoin([
          billUpdate$,
          this.api.create<Transaction>('transactions', billPaymentTransaction),
          this.api.update<Account>('accounts', account.id, updatedAccount)
        ]);
      })
    );
  }

  deleteBill( billId: number | string) {

    return this.api.delete(
      'bills',
      billId
    );

  }

}
