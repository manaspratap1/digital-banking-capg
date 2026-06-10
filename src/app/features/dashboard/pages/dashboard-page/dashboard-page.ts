import { DashboardService } from "../../services/dashboard.service";
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

  today = new Date();
  showNotifPanel = false;

  ngOnInit(): void {
    this.dashboardService.loadDashboardData(2).subscribe();
  }

  unreadCount() {
    return this.unreadNotifications();
  }

  toggleNotifPanel() {
    this.showNotifPanel = !this.showNotifPanel;
  }

  onQuickAction(action: string) {
    console.log(action);
  }

  recentTransactions() {
    return this.transactions();
  }

  savingsProgress() {
    return this.savingsGoals().map(goal => ({
      ...goal,
      name: goal.title,
      progressPercent:
        goal.targetAmount > 0
          ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
          : 0
    }));
  }

  getCategoryIcon(category: string): string {
    switch (category?.toLowerCase()) {
      case 'food': return '🍔';
      case 'shopping': return '🛍️';
      case 'travel': return '✈️';
      case 'salary': return '💰';
      default: return '📌';
    }
  }

  getNotifIcon(isRead: boolean): string {
    return isRead ? '✓' : '🔔';
  }
}

