import { computed, inject, Injectable, signal } from '@angular/core';

import { ApiService } from '../../../core/services/api.service';
import { Bill } from '../../../shared/models';
import { BillStatus } from '../../../shared/enums/bill-status.enum';

@Injectable({
  providedIn: 'root',
})
export class BillService {

  private api = inject(ApiService);

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

    this.api
      .get<Bill[]>('bills')
      .subscribe(bills => {

        this.bills.set(bills);

      });

  }

  addBill(bill: Bill) {

    return this.api.create(
      'bills',
      bill
    );

  }

  markAsPaid( bill: Bill ) {

    const updatedBill = {
      ...bill,
      status: BillStatus.PAID
    };

    return this.api.update(
      'bills',
      bill.id,
      updatedBill
    );

  }

  deleteBill( billId: number | string) {

    return this.api.delete(
      'bills',
      billId
    );

  }

}