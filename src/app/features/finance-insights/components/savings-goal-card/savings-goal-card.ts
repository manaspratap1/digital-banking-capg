import { Component, EventEmitter, inject, Output } from '@angular/core';

import { Finance } from '../../services/finance';

@Component({
  selector: 'app-savings-goal-card',
  imports: [],
  templateUrl: './savings-goal-card.html',
  styleUrl: './savings-goal-card.scss',
})
export class SavingsGoalCard {
  finance = inject(Finance);

  @Output() addGoal = new EventEmitter<void>();
}
