import { Component, inject } from '@angular/core';

import { Finance } from '../../../finance-insights/services/finance';

@Component({
  selector: 'app-financial-snapshot',
  imports: [],
  templateUrl: './financial-snapshot.html',
  styleUrl: './financial-snapshot.scss',
})
export class FinancialSnapshot {

  finance = inject(Finance);

}