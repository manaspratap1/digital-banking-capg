import { Component, inject, OnInit } from '@angular/core';

import { BillService } from '../../services/bill';

import { BillList } from '../../components/bill-list/bill-list';
import { BillForm } from '../../components/bill-form/bill-form';

@Component({
  selector: 'app-bill-page',
  imports: [ BillList, BillForm ],
  templateUrl: './bill-page.html',
  styleUrl: './bill-page.scss',
})
export class BillPage implements OnInit {

  billService = inject(BillService);

  ngOnInit(): void {

    this.billService.loadBills();

  }

}