export type NotificationCategory =
  | 'transactions'
  | 'security'
  | 'savings'
  | 'system';

export type NotificationType =
  | 'salary_credited'
  | 'transfer_success'
  | 'bill_due'
  | 'savings_progress'
  | 'low_balance'
  | 'login_alert'
  | 'kyc_reminder'
  | 'investment_update';

export type NotificationPriority = 'normal' | 'high' | 'critical';

export type NotificationFilter =
  | 'all'
  | 'unread'
  | 'read'
  | 'security'
  | 'transactions'
  | 'savings'
  | 'system';

export interface Notification {
  id: string | number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  isRead: boolean;
  date: string;
  /** true when generated client-side (API notifications array was empty) */
  isLocal?: boolean;
}