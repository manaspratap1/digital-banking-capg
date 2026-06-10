import { Component, inject } from '@angular/core';

import { Admin } from '../../services/admin';

@Component({
  selector: 'app-transactions-table',
  imports: [],
  templateUrl: './transactions-table.html',
  styleUrl: './transactions-table.scss',
})
export class TransactionsTable {

  admin =
    inject(Admin);

}