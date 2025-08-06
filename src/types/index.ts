
export interface Union {
  id: string;
  name: string;
  leaderId: string; // Member ID of the union leader
  purse: number; // Union's financial balance
  memberCount: number;
  createdDate: Date;
  status: "active" | "inactive";
}

export interface Member {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  joinDate: Date;
  status: "active" | "inactive";
  balance: number;
  unionId: string; // Reference to the union this member belongs to
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
  // Additional string date properties for display
  dueDateStr?: string;
  paidDateStr?: string | null;
}

export interface Collector {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  assignedMembers: number;
  collectionsToday: number;
  totalCollected: number;
  unionId: string; // Collectors are assigned to specific unions
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
