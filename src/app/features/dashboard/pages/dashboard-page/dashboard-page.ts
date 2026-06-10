import { Component, inject, OnInit, signal } from '@angular/core';
import { Dashboard } from '../../services/dashboard';
import { QuickActions } from '../../components/quick-actions/quick-actions';
import { RecentTransactions } from '../../components/recent-transactions/recent-transactions';
import { UpcomingBills } from '../../components/upcoming-bills/upcoming-bills';
import { FinancialSnapshot } from '../../components/financial-snapshot/financial-snapshot';
import { AuthService } from '../../../../core/services/auth.service';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  imports: [QuickActions, RecentTransactions, UpcomingBills, FinancialSnapshot, UpperCasePipe],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage
  implements OnInit {

  dashboard = inject(Dashboard);
  private authService = inject(AuthService);

  showBalance = signal(false);

  ngOnInit(): void {
    this.dashboard.loadDashboard();
  }

  userName() {
    return this.authService
      .currentUser()
      .name;
  }

  greeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good Morning';
    }

    if (hour < 17) {
      return 'Good Afternoon';
    }

    return 'Good Evening';
  }

  toggleBalance() {
    this.showBalance.update(value => !value);
  }

}