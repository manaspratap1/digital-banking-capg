export interface SavingsGoal {
  id: string | number;
  userId: number | string;
  title: string;
  targetAmount: number;
  currentAmount: number;
}