import { DashboardService } from "../../services/dashboard.service";
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../notifications/services/notification.service';
import { NotificationType } from '../../../../shared/models/notification.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {

  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  accounts = this.dashboardService.accounts;
  transactions = this.dashboardService.recentTransactions;
  notifications = this.notificationService.notifications;
  savingsGoals = this.dashboardService.savingsGoals;

  totalBalance = this.dashboardService.totalBalance;
  unreadNotifications = this.notificationService.unreadCount;

  ngOnInit(): void {
    const userId = Number(this.authService.currentUser().userId) || 2;
    this.dashboardService.loadDashboardData(userId).subscribe();
  }

  unreadCount() {
    return this.unreadNotifications();
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

  getNotifIcon(type: NotificationType): string {
    return this.notificationService.getIcon(type);
  }
}