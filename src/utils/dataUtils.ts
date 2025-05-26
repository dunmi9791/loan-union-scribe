
import { members, loans, installments, collectors, collectionSummary, unions } from "../data/mockData";
import { Member, Loan, Installment, Collector, Union } from "../types";

// Union utilities
export const getAllUnions = (): Union[] => unions;

export const getUnionById = (id: string): Union | undefined => 
  unions.find(union => union.id === id);

export const getUnionMembers = (unionId: string): Member[] => 
  members.filter(member => member.unionId === unionId);

export const getUnionCollectors = (unionId: string): Collector[] => 
  collectors.filter(collector => collector.unionId === unionId);

export const getUnionLeader = (unionId: string): Member | undefined => {
  const union = getUnionById(unionId);
  return union ? getMemberById(union.leaderId) : undefined;
};

// Member utilities
export const getAllMembers = (): Member[] => members;

export const getMemberById = (id: string): Member | undefined => 
  members.find(member => member.id === id);

export const getMemberLoans = (memberId: string): Loan[] => 
  loans.filter(loan => loan.memberId === memberId);

export const getMemberInstallments = (memberId: string): Installment[] => 
  installments.filter(installment => installment.memberId === memberId);

export const getMemberUnion = (memberId: string): Union | undefined => {
  const member = getMemberById(memberId);
  return member ? getUnionById(member.unionId) : undefined;
};

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

export const getCollectorUnion = (collectorId: string): Union | undefined => {
  const collector = getCollectorById(collectorId);
  return collector ? getUnionById(collector.unionId) : undefined;
};

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
