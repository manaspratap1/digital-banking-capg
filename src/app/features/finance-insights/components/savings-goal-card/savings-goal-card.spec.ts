import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsGoalCard } from './savings-goal-card';

describe('SavingsGoalCard', () => {
  let component: SavingsGoalCard;
  let fixture: ComponentFixture<SavingsGoalCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingsGoalCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SavingsGoalCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
