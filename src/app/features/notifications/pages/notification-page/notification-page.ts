import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Notification, NotificationCategory } from '../../../../shared/models/notification.model';

type FilterTab = 'all' | 'unread' | NotificationCategory;

@Component({
  selector: 'app-notification-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-page.html',
  styleUrl: './notification-page.scss',
})
export class NotificationPage implements OnInit {

  protected notificationService = inject(NotificationService);

  activeFilter = signal<FilterTab>('all');

  notifications = this.notificationService.notifications;
  isLoading     = this.notificationService.isLoading;
  unreadCount   = this.notificationService.unreadCount;
  totalCount    = this.notificationService.totalCount;
  transactionAlertsCount = this.notificationService.transactionAlertsCount;
  billRemindersCount     = this.notificationService.billRemindersCount;
  savingsCount           = this.notificationService.savingsCount;

  ngOnInit(): void {
    this.notificationService.load();
  }

  filteredNotifications(): Notification[] {
    return this.notificationService.filterNotifications(this.activeFilter());
  }

  setFilter(filter: FilterTab): void {
    this.activeFilter.set(filter);
  }

  markAsRead(id: string | number): void {
    this.notificationService.markAsRead(id);
  }

  markAllRead(): void {
    this.notificationService.markAllRead();
  }

  deleteNotification(id: string | number, event: Event): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(id);
  }

  trackById(_index: number, item: Notification): string | number {
    return item.id;
  }
}