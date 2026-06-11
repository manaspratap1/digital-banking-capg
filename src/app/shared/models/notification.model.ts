export type NotificationCategory =
  | 'transactions'
  | 'bills'
  | 'savings'
  | 'system';

export interface Notification {
  id: string | number;
  userId: number;

  /** Short heading shown in bold, e.g. "Salary Credited" */
  title: string;

  /** Full message body, e.g. "₹50,000 credited to your account" */
  message: string;

  /** Drives filter tabs and summary card grouping */
  category: NotificationCategory;

  /** Bootstrap Icon class, e.g. "bi-cash-coin" */
  icon: string;

  isRead: boolean;
  date: string;
}