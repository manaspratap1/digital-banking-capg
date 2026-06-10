import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {

  private dashboardService = inject(DashboardService);

  accounts = this.dashboardService.accounts;
  transactions = this.dashboardService.recentTransactions;
  notifications = this.dashboardService.notifications;
  savingsGoals = this.dashboardService.savingsGoals;

  totalBalance = this.dashboardService.totalBalance;
  unreadNotifications = this.dashboardService.unreadNotifications;

  ngOnInit(): void {

    this.dashboardService.loadDashboardData(2).subscribe();

  }
}