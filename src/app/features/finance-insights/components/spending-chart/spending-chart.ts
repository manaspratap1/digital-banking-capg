import { Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Finance } from '../../services/finance';

@Component({
  selector: 'app-spending-chart',
  imports: [BaseChartDirective],
  templateUrl: './spending-chart.html',
  styleUrl: './spending-chart.scss',
})
export class SpendingChart {

  finance = inject(Finance);

  pieChartType: ChartType = 'pie';

  hasData(): boolean {
    return this.finance.getCategorySpending().length > 0;
  }

  get pieChartData():
    ChartConfiguration<'pie'>['data'] {

    const spendingData =
      this.finance.getCategorySpending();

    return {

      labels:
        spendingData.map(
          item => item[0]
        ),

      datasets: [
        {
          data:
            spendingData.map(
              item => item[1]
            )
        }
      ]

    };

  }

}
