import { Component, inject } from '@angular/core';

import { Finance } from '../../services/finance';

@Component({
  selector: 'app-recent-insights-card',
  imports: [],
  templateUrl: './recent-insights-card.html',
  styleUrl: './recent-insights-card.scss',
})
export class RecentInsightsCard {

  finance = inject(Finance);

}