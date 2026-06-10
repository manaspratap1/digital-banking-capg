import { Component, inject } from '@angular/core';

import { Dashboard } from '../../services/dashboard';

@Component({
  selector: 'app-upcoming-bills',
  imports: [],
  templateUrl: './upcoming-bills.html',
  styleUrl: './upcoming-bills.scss',
})
export class UpcomingBills {

  dashboard = inject(Dashboard);

}