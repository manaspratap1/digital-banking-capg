export interface Bill {
  id: number;
  userId: number;
  category: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending';
}