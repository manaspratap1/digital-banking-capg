import { TransactionType } from "../enums/transaction-type.enum";

export interface Transaction {
  id: string | number;
  accountId: number;
  beneficiaryId?: number;

  amount: number;
  type: TransactionType;

  category: string;
  date: string;
  description: string;

  referenceNumber: string;
}