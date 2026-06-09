import { BillStatus } from "../enums/bill-status.enum";

export interface Bill {
  id: number;
  userId: number;
  category: string;
  amount: number;
  dueDate: string;
  status: BillStatus;
}