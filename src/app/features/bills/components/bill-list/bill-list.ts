import { Component, inject } from '@angular/core';

import { BillService } from '../../services/bill';
import { Bill } from '../../../../shared/models';

@Component({
  selector: 'app-bill-list',
  imports: [],
  templateUrl: './bill-list.html',
  styleUrl: './bill-list.scss',
})
export class BillList {

  billService = inject(BillService);

  markAsPaid( bill: Bill): void {

    this.billService
      .markAsPaid(bill)
      .subscribe(() => {

        this.billService.loadBills();

      });

  }

  deleteBill( billId: number | string ): void {

    this.billService
      .deleteBill(billId)
      .subscribe(() => {

        this.billService.loadBills();

      });

  }

}