import { Component, inject } from '@angular/core';

import { Dashboard } from '../../services/dashboard';

@Component({
  selector: 'app-recent-transactions',
  imports: [],
  templateUrl: './recent-transactions.html',
  styleUrl: './recent-transactions.scss',
})
export class RecentTransactions {

  dashboard = inject(Dashboard);

}