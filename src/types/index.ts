
export interface Member {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  joinDate: Date;
  status: "active" | "inactive";
  balance: number;
}

export interface Loan {
  id: string;
  memberId: string;
  amount: number;
  issueDate: Date;
  totalInstallments: number;
  paidInstallments: number;
  nextDueDate: Date;
  status: "active" | "completed" | "defaulted";
}

export interface Installment {
  id: string;
  loanId: string;
  memberId: string;
  amount: number;
  dueDate: Date;
  paidDate: Date | null;
  status: "paid" | "pending" | "overdue";
  collectorId: string;
}

export interface Collector {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  assignedMembers: number;
  collectionsToday: number;
  totalCollected: number;
}

export interface CollectionSummary {
  totalLoans: number;
  activeLoans: number;
  completedLoans: number;
  defaultedLoans: number;
  totalAmount: number;
  totalCollected: number;
  pendingAmount: number;
}
