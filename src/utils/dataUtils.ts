
import apiService from "../lib/apiService";
// The legacy odooService has been removed in favour of REST API calls.
import { Member, Loan, Installment, Collector, Union, CollectionSummary } from "../types/index";

// Cache for data to avoid excessive API calls. These caches can be
// invalidated by calling `clearCache()` when data is updated.
let unionsCache: Union[] | null = null;
let membersCache: Member[] | null = null;
let loansCache: Loan[] | null = null;
let installmentsCache: Installment[] | null = null;
let collectorsCache: Collector[] | null = null;
let collectionSummaryCache: CollectionSummary | null = null;

// Helper function to clear cache (useful when data is updated)
export const clearCache = () => {
  unionsCache = null;
  membersCache = null;
  loansCache = null;
  installmentsCache = null;
  collectorsCache = null;
  collectionSummaryCache = null;
};

// Union utilities
export const getAllUnions = async (): Promise<Union[]> => {
  if (!unionsCache) {
    try {
      unionsCache = await apiService.unions.getAll();
    } catch (error) {
      console.error("Error fetching unions:", error);
      unionsCache = [];
    }
  }
  return unionsCache;
};

export const getUnionById = async (id: string): Promise<Union | undefined> => {
  // Try to find in cache first
  if (unionsCache) {
    const cachedUnion = unionsCache.find(union => union.id === id);
    if (cachedUnion) return cachedUnion;
  }
  
  try {
    const union = await apiService.unions.getById(id);
    // Cache the union in case it's requested again
    unionsCache = unionsCache ? [...unionsCache, union] : [union];
    return union;
  } catch (error: any) {
    if (error.name === 'PermissionError' || (error.data && error.data.code === 403)) {
      console.error(`Permission error fetching union with ID ${id}:`, error);
      // Handle permission error specifically if needed
    } else {
      console.error(`Error fetching union with ID ${id}:`, error);
    }
    return undefined;
  }
};

export const getUnionMembers = async (unionId: string): Promise<Member[]> => {
  try {
    // Use REST endpoint to fetch members belonging to a specific union
    return await apiService.unions.getMembers(unionId);
  } catch (error) {
    console.error(`Error fetching members for union with ID ${unionId}:`, error);
    return [];
  }
};

export const getUnionCollectors = async (unionId: string): Promise<Collector[]> => {
  try {
    // Use REST endpoint to fetch collectors belonging to a specific union
    return await apiService.unions.getCollectors(unionId);
  } catch (error) {
    console.error(`Error fetching collectors for union with ID ${unionId}:`, error);
    return [];
  }
};

export const getUnionLeader = async (unionId: string): Promise<Member | undefined> => {
  const union = await getUnionById(unionId);
  return union ? await getMemberById(union.leaderId) : undefined;
};

// Member utilities
export const getAllMembers = async (): Promise<Member[]> => {
  if (!membersCache) {
    try {
      membersCache = await apiService.members.getAll();
    } catch (error) {
      console.error("Error fetching members:", error);
      membersCache = [];
    }
  }
  return membersCache;
};

export const getMemberById = async (id: string): Promise<Member | undefined> => {
  // Try to find in cache first
  if (membersCache) {
    const cachedMember = membersCache.find(member => member.id === id);
    if (cachedMember) return cachedMember;
  }
  
  try {
    const member = await apiService.members.getById(id);
    // Cache the member for future lookups
    membersCache = membersCache ? [...membersCache, member] : [member];
    return member;
  } catch (error: any) {
    if (error.name === 'PermissionError' || (error.data && error.data.code === 403)) {
      console.error(`Permission error fetching member with ID ${id}:`, error);
      // Handle permission error specifically if needed
    } else {
      console.error(`Error fetching member with ID ${id}:`, error);
    }
    return undefined;
  }
};

export const getMemberLoans = async (memberId: string): Promise<Loan[]> => {
  try {
    return await apiService.members.getLoans(memberId);
  } catch (error) {
    console.error(`Error fetching loans for member with ID ${memberId}:`, error);
    return [];
  }
};

export const getMemberInstallments = async (memberId: string): Promise<Installment[]> => {
  try {
    return await apiService.members.getInstallments(memberId);
  } catch (error) {
    console.error(`Error fetching installments for member with ID ${memberId}:`, error);
    return [];
  }
};

export const getMemberUnion = async (memberId: string): Promise<Union | undefined> => {
  const member = await getMemberById(memberId);
  return member ? await getUnionById(member.unionId) : undefined;
};

// Loan utilities
export const getAllLoans = async (): Promise<Loan[]> => {
  if (!loansCache) {
    loansCache = await apiService.loans.getAll();
  }
  return loansCache;
};

export const getLoanById = async (id: string): Promise<Loan | undefined> => {
  // Try to find in cache first
  if (loansCache) {
    const cachedLoan = loansCache.find(loan => loan.id === id);
    if (cachedLoan) return cachedLoan;
  }
  
  try {
    return await apiService.loans.getById(id);
  } catch (error: any) {
    if (error.name === 'PermissionError' || (error.data && error.data.code === 403)) {
      console.error(`Permission error fetching loan with ID ${id}:`, error);
      // Handle permission error specifically if needed
    } else {
      console.error(`Error fetching loan with ID ${id}:`, error);
    }
    return undefined;
  }
};

export const getLoanInstallments = async (loanId: string): Promise<Installment[]> => {
  try {
    return await apiService.loans.getInstallments(loanId);
  } catch (error) {
    console.error(`Error fetching installments for loan with ID ${loanId}:`, error);
    return [];
  }
};

// Installment utilities
export const getAllInstallments = async (): Promise<Installment[]> => {
  if (!installmentsCache) {
    installmentsCache = await apiService.installments.getAll();
  }
  return installmentsCache;
};

export const getInstallmentById = async (id: string): Promise<Installment | undefined> => {
  try {
    return await apiService.installments.getById(id);
  } catch (error: any) {
    if (error.name === 'PermissionError' || (error.data && error.data.code === 403)) {
      console.error(`Permission error fetching installment with ID ${id}:`, error);
      // Handle permission error specifically if needed
    } else {
      console.error(`Error fetching installment with ID ${id}:`, error);
    }
    return undefined;
  }
};

export const getOverdueInstallments = async (): Promise<Installment[]> => {
  try {
    return await apiService.installments.getOverdue();
  } catch (error) {
    console.error("Error fetching overdue installments:", error);
    return [];
  }
};

export const getPendingInstallments = async (): Promise<Installment[]> => {
  try {
    return await apiService.installments.getPending();
  } catch (error) {
    console.error("Error fetching pending installments:", error);
    return [];
  }
};

// Collector utilities
export const getAllCollectors = async (): Promise<Collector[]> => {
  if (!collectorsCache) {
    collectorsCache = await apiService.collectors.getAll();
  }
  return collectorsCache;
};

export const getCollectorById = async (id: string): Promise<Collector | undefined> => {
  try {
    return await apiService.collectors.getById(id);
  } catch (error) {
    console.error(`Error fetching collector with ID ${id}:`, error);
    return undefined;
  }
};

export const getCollectorInstallments = async (collectorId: string): Promise<Installment[]> => {
  try {
    return await apiService.collectors.getInstallments(collectorId);
  } catch (error) {
    console.error(`Error fetching installments for collector with ID ${collectorId}:`, error);
    return [];
  }
};

export const getCollectorUnion = async (collectorId: string): Promise<Union | undefined> => {
  const collector = await getCollectorById(collectorId);
  return collector ? await getUnionById(collector.unionId) : undefined;
};

// Collection summary
export const getCollectionSummary = async (): Promise<CollectionSummary> => {
  if (!collectionSummaryCache) {
    collectionSummaryCache = await apiService.summary.getCollectionSummary();
  }
  return collectionSummaryCache;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: 'NGN',
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
