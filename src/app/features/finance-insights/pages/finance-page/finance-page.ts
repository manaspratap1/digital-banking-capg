import { Component, inject, OnInit } from '@angular/core';

import { SpendingSummaryCard } from '../../components/spending-summary-card/spending-summary-card';
import { SpendingChart } from '../../components/spending-chart/spending-chart';
import { SavingsGoalCard } from '../../components/savings-goal-card/savings-goal-card';

import { Finance } from '../../services/finance';
import { RecentInsightsCard } from '../../components/recent-insights-card/recent-insights-card';

@Component({
  selector: 'app-finance-page',
  imports: [ SpendingSummaryCard, SpendingChart, SavingsGoalCard, RecentInsightsCard ],
  templateUrl: './finance-page.html',
  styleUrl: './finance-page.scss',
})
export class FinancePage implements OnInit {

  finance = inject(Finance);

  ngOnInit(): void {

    this.finance.loadTransactions();

    this.finance.loadSavingsGoals();

  }

}