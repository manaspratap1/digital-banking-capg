export interface SavingsGoal {
  id: string | number;
  userId: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
}