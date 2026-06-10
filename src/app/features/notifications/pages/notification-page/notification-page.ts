import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import {
  Notification,
  NotificationFilter
} from '../../../../shared/models/notification.model';

@Component({
  selector: 'app-notification-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-page.html',
  styleUrl: './notification-page.scss',
})
export class NotificationPage implements OnInit {

  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  readonly isLoading = this.notificationService.isLoading;
  readonly error = this.notificationService.error;
  readonly totalCount = this.notificationService.totalCount;
  readonly unreadCount = this.notificationService.unreadCount;
  readonly importantCount = this.notificationService.importantCount;
  readonly securityCount = this.notificationService.securityCount;

  readonly activeFilter = signal<NotificationFilter>('all');
  readonly searchQuery = signal('');

  readonly filters: { id: NotificationFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'read', label: 'Read' },
    { id: 'security', label: 'Security' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'savings', label: 'Savings' },
    { id: 'system', label: 'System' },
  ];

  readonly displayedNotifications = computed(() =>
    this.notificationService.filterNotifications(
      this.notificationService.notifications(),
      this.activeFilter(),
      this.searchQuery()
    )
  );

  ngOnInit(): void {
    const userId = Number(this.authService.currentUser().userId);
    if (userId) {
      this.notificationService.load(userId);
    }
  }

  setFilter(filter: NotificationFilter): void {
    this.activeFilter.set(filter);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  markAsRead(notification: Notification): void {
    if (notification.isRead) return;
    this.notificationService.markAsRead(notification.id);
  }

  markAllRead(): void {
    this.notificationService.markAllRead();
  }

  deleteNotification(id: string | number): void {
    this.notificationService.deleteNotification(id);
  }

  getIcon(type: Notification['type']): string {
    return this.notificationService.getIcon(type);
  }

  getPriorityLabel(priority: Notification['priority']): string | null {
    return this.notificationService.getPriorityLabel(priority);
  }

  categoryLabel(category: Notification['category']): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
}