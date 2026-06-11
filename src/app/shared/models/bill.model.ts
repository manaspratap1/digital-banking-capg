import { BillStatus } from '../enums/bill-status.enum';

export interface Bill {
  id: string | number;
  userId: string | number;

  billerName: string;

  category: string;

  amount: number;

  dueDate: string;

  status: BillStatus;
}
