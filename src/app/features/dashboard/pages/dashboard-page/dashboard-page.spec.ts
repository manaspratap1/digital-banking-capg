import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { AuthService } from '../../../../core/services/auth.service';
import { Dashboard } from '../../services/dashboard';
import { DashboardPage } from './dashboard-page';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideRouter([]),
        {
          provide: Dashboard,
          useValue: {
            account: signal({
              accountType: 'Savings',
              accountNumber: 'ACC1234',
            }),
            availableBalance: () => 1000,
            monthlyIncome: () => 0,
            monthlyExpense: () => 0,
            pendingBillsCount: () => 0,
            recentTransactions: () => [],
            upcomingBills: () => [],
            loadDashboard: () => undefined,
          },
        },
        {
          provide: AuthService,
          useValue: {
            currentUser: () => ({
              name: 'Test User',
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
