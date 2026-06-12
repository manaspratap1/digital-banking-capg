import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import { Finance } from '../../services/finance';
import { FinancePage } from './finance-page';

describe('FinancePage', () => {
  let component: FinancePage;
  let fixture: ComponentFixture<FinancePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancePage],
      providers: [
        provideRouter([]),
        {
          provide: Finance,
          useValue: {
            totalIncome: () => 0,
            totalExpense: () => 0,
            savingsRate: () => 0,
            highestSpendingCategory: () => 'N/A',
            savingsGoals: signal([]),
            getCategorySpending: () => [],
            loadTransactions: () => undefined,
            loadSavingsGoals: () => undefined,
            addSavingsGoal: () => of({}),
          },
        },
        {
          provide: AuthService,
          useValue: {
            currentUser: () => ({
              userId: '1',
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
