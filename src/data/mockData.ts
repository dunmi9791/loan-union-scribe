
import { Member, Loan, Installment, Collector, CollectionSummary } from "../types";

// Helper function to generate random dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random IDs
const generateId = () => Math.random().toString(36).substring(2, 10);

// Generate mock members
export const members: Member[] = Array.from({ length: 15 }, (_, i) => ({
  id: generateId(),
  name: `Member ${i + 1}`,
  contactNumber: `+1${Math.floor(Math.random() * 900000000 + 1000000000)}`,
  email: `member${i + 1}@example.com`,
  joinDate: randomDate(new Date(2020, 0, 1), new Date()),
  status: Math.random() > 0.2 ? "active" : "inactive",
  balance: parseFloat((Math.random() * 5000).toFixed(2))
}));

// Generate mock loans
export const loans: Loan[] = members.slice(0, 12).map((member, i) => {
  const loanAmount = parseFloat((Math.random() * 10000 + 2000).toFixed(2));
  const paidInstallments = Math.floor(Math.random() * 20);
  const issueDate = randomDate(new Date(2021, 0, 1), new Date(2023, 11, 31));
  
  let status: "active" | "completed" | "defaulted" = "active";
  if (paidInstallments >= 20) status = "completed";
  else if (Math.random() > 0.8) status = "defaulted";
  
  // Calculate next due date
  const nextDueDate = new Date(issueDate);
  nextDueDate.setMonth(nextDueDate.getMonth() + paidInstallments + 1);
  
  return {
    id: generateId(),
    memberId: member.id,
    amount: loanAmount,
    issueDate,
    totalInstallments: 20,
    paidInstallments,
    nextDueDate,
    status
  };
});

// Generate mock collectors
export const collectors: Collector[] = Array.from({ length: 5 }, (_, i) => ({
  id: generateId(),
  name: `Collector ${i + 1}`,
  contactNumber: `+1${Math.floor(Math.random() * 900000000 + 1000000000)}`,
  email: `collector${i + 1}@union.org`,
  assignedMembers: Math.floor(Math.random() * 10) + 1,
  collectionsToday: Math.floor(Math.random() * 5),
  totalCollected: parseFloat((Math.random() * 20000 + 5000).toFixed(2))
}));

// Generate mock installments
export const installments: Installment[] = [];
loans.forEach(loan => {
  const installmentAmount = loan.amount / 20;
  for (let i = 0; i < 20; i++) {
    const dueDate = new Date(loan.issueDate);
    dueDate.setMonth(dueDate.getMonth() + i + 1);
    
    let status: "paid" | "pending" | "overdue" = "pending";
    let paidDate: Date | null = null;
    
    if (i < loan.paidInstallments) {
      status = "paid";
      paidDate = new Date(dueDate);
      // Some payments might be a bit late
      if (Math.random() > 0.7) {
        paidDate.setDate(paidDate.getDate() + Math.floor(Math.random() * 5));
      } else {
        paidDate.setDate(paidDate.getDate() - Math.floor(Math.random() * 3));
      }
    } else if (dueDate < new Date()) {
      status = "overdue";
    }
    
    installments.push({
      id: generateId(),
      loanId: loan.id,
      memberId: loan.memberId,
      amount: parseFloat(installmentAmount.toFixed(2)),
      dueDate,
      paidDate,
      status,
      collectorId: collectors[Math.floor(Math.random() * collectors.length)].id
    });
  }
});

// Generate collection summary
export const collectionSummary: CollectionSummary = {
  totalLoans: loans.length,
  activeLoans: loans.filter(loan => loan.status === "active").length,
  completedLoans: loans.filter(loan => loan.status === "completed").length,
  defaultedLoans: loans.filter(loan => loan.status === "defaulted").length,
  totalAmount: parseFloat(loans.reduce((sum, loan) => sum + loan.amount, 0).toFixed(2)),
  totalCollected: parseFloat(loans.reduce((sum, loan) => sum + (loan.amount / 20 * loan.paidInstallments), 0).toFixed(2)),
  pendingAmount: parseFloat(loans.reduce((sum, loan) => sum + (loan.amount / 20 * (20 - loan.paidInstallments)), 0).toFixed(2))
};
