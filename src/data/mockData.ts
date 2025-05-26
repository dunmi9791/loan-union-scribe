
import { Member, Loan, Installment, Collector, CollectionSummary, Union } from "../types";

// Helper function to generate random dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random IDs
const generateId = () => Math.random().toString(36).substring(2, 10);

// Generate mock unions first
export const unions: Union[] = [
  {
    id: "union1",
    name: "Downtown Workers Union",
    leaderId: "", // Will be set after generating members
    purse: 25000.50,
    memberCount: 0, // Will be calculated
    createdDate: new Date(2019, 5, 15),
    status: "active"
  },
  {
    id: "union2", 
    name: "Eastside Community Union",
    leaderId: "", // Will be set after generating members
    purse: 18750.75,
    memberCount: 0, // Will be calculated
    createdDate: new Date(2020, 2, 8),
    status: "active"
  },
  {
    id: "union3",
    name: "Industrial Workers Union",
    leaderId: "", // Will be set after generating members
    purse: 32100.25,
    memberCount: 0, // Will be calculated
    createdDate: new Date(2018, 9, 22),
    status: "active"
  }
];

// Generate mock members with union assignments
export const members: Member[] = Array.from({ length: 15 }, (_, i) => {
  const unionId = unions[i % unions.length].id; // Distribute members across unions
  return {
    id: generateId(),
    name: `Member ${i + 1}`,
    contactNumber: `+1${Math.floor(Math.random() * 900000000 + 1000000000)}`,
    email: `member${i + 1}@example.com`,
    joinDate: randomDate(new Date(2020, 0, 1), new Date()),
    status: Math.random() > 0.2 ? "active" : "inactive",
    balance: parseFloat((Math.random() * 5000).toFixed(2)),
    unionId
  };
});

// Set union leaders and member counts
unions[0].leaderId = members.find(m => m.unionId === "union1")?.id || "";
unions[1].leaderId = members.find(m => m.unionId === "union2")?.id || "";
unions[2].leaderId = members.find(m => m.unionId === "union3")?.id || "";

// Calculate member counts for each union
unions.forEach(union => {
  union.memberCount = members.filter(m => m.unionId === union.id).length;
});

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

// Generate mock collectors with union assignments
export const collectors: Collector[] = Array.from({ length: 5 }, (_, i) => {
  const unionId = unions[i % unions.length].id; // Distribute collectors across unions
  return {
    id: generateId(),
    name: `Collector ${i + 1}`,
    contactNumber: `+1${Math.floor(Math.random() * 900000000 + 1000000000)}`,
    email: `collector${i + 1}@union.org`,
    assignedMembers: Math.floor(Math.random() * 10) + 1,
    collectionsToday: Math.floor(Math.random() * 5),
    totalCollected: parseFloat((Math.random() * 20000 + 5000).toFixed(2)),
    unionId
  };
});

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
