import { Component, inject } from '@angular/core';

import { Finance } from '../../services/finance';

@Component({
  selector: 'app-spending-summary-card',
  imports: [],
  templateUrl: './spending-summary-card.html',
  styleUrl: './spending-summary-card.scss',
})
export class SpendingSummaryCard {

  finance = inject(Finance);

}