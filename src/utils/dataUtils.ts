
import { members, loans, installments, collectors, collectionSummary } from "../data/mockData";
import { Member, Loan, Installment, Collector } from "../types";

// Member utilities
export const getAllMembers = (): Member[] => members;

export const getMemberById = (id: string): Member | undefined => 
  members.find(member => member.id === id);

export const getMemberLoans = (memberId: string): Loan[] => 
  loans.filter(loan => loan.memberId === memberId);

export const getMemberInstallments = (memberId: string): Installment[] => 
  installments.filter(installment => installment.memberId === memberId);

// Loan utilities
export const getAllLoans = (): Loan[] => loans;

export const getLoanById = (id: string): Loan | undefined => 
  loans.find(loan => loan.id === id);

export const getLoanInstallments = (loanId: string): Installment[] => 
  installments.filter(installment => installment.loanId === loanId);

// Installment utilities
export const getAllInstallments = (): Installment[] => installments;

export const getInstallmentById = (id: string): Installment | undefined => 
  installments.find(installment => installment.id === id);

export const getOverdueInstallments = (): Installment[] => 
  installments.filter(installment => installment.status === "overdue");

export const getPendingInstallments = (): Installment[] => 
  installments.filter(installment => installment.status === "pending");

// Collector utilities
export const getAllCollectors = (): Collector[] => collectors;

export const getCollectorById = (id: string): Collector | undefined => 
  collectors.find(collector => collector.id === id);

export const getCollectorInstallments = (collectorId: string): Installment[] => 
  installments.filter(installment => installment.collectorId === collectorId);

// Collection summary
export const getCollectionSummary = () => collectionSummary;

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};
