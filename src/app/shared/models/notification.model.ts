export interface Notification {
  id: string | number;
  userId: string | number;
  message: string;
  isRead: boolean;
  date: string;
}
