export interface Notification {
  id: string | number;
  userId: number;
  message: string;
  isRead: boolean;
  date: string;
}