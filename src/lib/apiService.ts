import axios from "./axiosConfig";
import { Member, Loan, Installment, Collector, CollectionSummary, Union } from "../types/index";

// Base URL for API endpoints
const API_BASE_URL = "/api";

// Helper function to build query parameters for GET requests
const buildQueryParams = (options?: {
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  filter?: Record<string, string>;
}): string => {
  if (!options) return '';
  
  const params = new URLSearchParams();
  
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.offset) params.append('offset', options.offset.toString());
  if (options.sort) params.append('sort', options.sort);
  if (options.order) params.append('order', options.order);
  
  if (options.filter) {
    const filterString = Object.entries(options.filter)
      .map(([key, value]) => `${key}=${value}`)
      .join(',');
    
    if (filterString) params.append('filter', filterString);
  }
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

// Union API endpoints
const unionApi = {
  // Get all unions
  getAll: async (options?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: Record<string, string>;
  }): Promise<Union[]> => {
    const queryParams = buildQueryParams(options);
    const response = await axios.get(`${API_BASE_URL}/unions${queryParams}`);
    
    return response.data.map((union: any) => ({
      id: union.id.toString(),
      name: union.name,
      leaderId: union.leaderId.toString(),
      purse: union.purse,
      memberCount: union.memberCount,
      createdDate: new Date(union.createdDate),
      status: union.status
    }));
  },
  
  // Get a single union by ID
  getById: async (unionId: string): Promise<Union> => {
    const response = await axios.get(`${API_BASE_URL}/unions/${unionId}`);
    const union = response.data;
    
    return {
      id: union.id.toString(),
      name: union.name,
      leaderId: union.leaderId.toString(),
      purse: union.purse,
      memberCount: union.memberCount,
      createdDate: new Date(union.createdDate),
      status: union.status
    };
  },
  
  // Create a new union
  create: async (union: Omit<Union, 'id'>): Promise<Union> => {
    const response = await axios.post(`${API_BASE_URL}/unions`, union);
    const newUnion = response.data;
    
    return {
      id: newUnion.id.toString(),
      name: newUnion.name,
      leaderId: newUnion.leaderId.toString(),
      purse: newUnion.purse,
      memberCount: newUnion.memberCount,
      createdDate: new Date(newUnion.createdDate),
      status: newUnion.status
    };
  },
  
  // Update an existing union
  update: async (unionId: string, union: Partial<Union>): Promise<Union> => {
    const response = await axios.put(`${API_BASE_URL}/unions/${unionId}`, union);
    const updatedUnion = response.data;
    
    return {
      id: updatedUnion.id.toString(),
      name: updatedUnion.name,
      leaderId: updatedUnion.leaderId.toString(),
      purse: updatedUnion.purse,
      memberCount: updatedUnion.memberCount,
      createdDate: new Date(updatedUnion.createdDate),
      status: updatedUnion.status
    };
  },
  
  // Delete a union
  delete: async (unionId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/unions/${unionId}`);
  },
  
  // Get all members of a union
  getMembers: async (unionId: string, options?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: Record<string, string>;
  }): Promise<Member[]> => {
    const queryParams = buildQueryParams(options);
    const response = await axios.get(`${API_BASE_URL}/unions/${unionId}/members${queryParams}`);
    
    return response.data.map((member: any) => ({
      id: member.id.toString(),
      name: member.name,
      contactNumber: member.contactNumber,
      email: member.email,
      joinDate: new Date(member.joinDate),
      status: member.status,
      balance: member.balance,
      unionId: member.unionId.toString()
    }));
  },
  
  // Get collectors and summary stats for a union
  getCollectors: async (unionId: string): Promise<Collector[]> => {
    const response = await axios.get(`${API_BASE_URL}/unions/${unionId}/collectors`);
    
    return response.data.map((collector: any) => ({
      id: collector.id.toString(),
      name: collector.name,
      contactNumber: collector.contactNumber,
      email: collector.email,
      assignedMembers: collector.assignedMembers,
      collectionsToday: collector.collectionsToday,
      totalCollected: collector.totalCollected,
      unionId: collector.unionId.toString()
    }));
  }
};

// Member API endpoints
const memberApi = {
  // Get all members
  getAll: async (options?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: Record<string, string>;
  }): Promise<Member[]> => {
    const queryParams = buildQueryParams(options);
    const response = await axios.get(`${API_BASE_URL}/members${queryParams}`);
    
    return response.data.map((member: any) => ({
      id: member.id.toString(),
      name: member.name,
      contactNumber: member.contactNumber,
      email: member.email,
      joinDate: new Date(member.joinDate),
      status: member.status,
      balance: member.balance,
      unionId: member.unionId.toString()
    }));
  },
  
  // Get a single member by ID
  getById: async (memberId: string): Promise<Member> => {
    const response = await axios.get(`${API_BASE_URL}/members/${memberId}`);
    const member = response.data;
    
    return {
      id: member.id.toString(),
      name: member.name,
      contactNumber: member.contactNumber,
      email: member.email,
      joinDate: new Date(member.joinDate),
      status: member.status,
      balance: member.balance,
      unionId: member.unionId.toString()
    };
  },
  
  // Create a new member
  create: async (member: Omit<Member, 'id'>): Promise<Member> => {
    const response = await axios.post(`${API_BASE_URL}/members`, member);
    const newMember = response.data;
    
    return {
      id: newMember.id.toString(),
      name: newMember.name,
      contactNumber: newMember.contactNumber,
      email: newMember.email,
      joinDate: new Date(newMember.joinDate),
      status: newMember.status,
      balance: newMember.balance,
      unionId: newMember.unionId.toString()
    };
  },
  
  // Update an existing member
  update: async (memberId: string, member: Partial<Member>): Promise<Member> => {
    const response = await axios.put(`${API_BASE_URL}/members/${memberId}`, member);
    const updatedMember = response.data;
    
    return {
      id: updatedMember.id.toString(),
      name: updatedMember.name,
      contactNumber: updatedMember.contactNumber,
      email: updatedMember.email,
      joinDate: new Date(updatedMember.joinDate),
      status: updatedMember.status,
      balance: updatedMember.balance,
      unionId: updatedMember.unionId.toString()
    };
  },
  
  // Delete a member
  delete: async (memberId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/members/${memberId}`);
  },
  
  // Get all loans belonging to a member
  getLoans: async (memberId: string, options?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: Record<string, string>;
  }): Promise<Loan[]> => {
    const queryParams = buildQueryParams(options);
    const response = await axios.get(`${API_BASE_URL}/members/${memberId}/loans${queryParams}`);
    
    return response.data.map((loan: any) => ({
      id: loan.id.toString(),
      memberId: loan.memberId.toString(),
      amount: loan.amount,
      issueDate: new Date(loan.issueDate),
      totalInstallments: loan.totalInstallments,
      paidInstallments: loan.paidInstallments,
      nextDueDate: new Date(loan.nextDueDate),
      status: loan.status
    }));
  },
  
  // Get all installments for a member
  getInstallments: async (memberId: string, options?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: Record<string, string>;
  }): Promise<Installment[]> => {
    const queryParams = buildQueryParams(options);
    const response = await axios.get(`${API_BASE_URL}/members/${memberId}/installments${queryParams}`);
    
    return response.data.map((installment: any) => ({
      id: installment.id.toString(),
      loanId: installment.loanId.toString(),
      memberId: installment.memberId.toString(),
      amount: installment.amount,
      dueDate: new Date(installment.dueDate),
      paidDate: installment.paidDate ? new Date(installment.paidDate) : null,
      status: installment.status,
      collectorId: installment.collectorId.toString()
    }));
  }
};

// Loan API endpoints
const loanApi = {
  // Get all loans
  getAll: async (options?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: Record<string, string>;
  }): Promise<Loan[]> => {
    const queryParams = buildQueryParams(options);
    const response = await axios.get(`${API_BASE_URL}/loans${queryParams}`);
    
    return response.data.map((loan: any) => ({
      id: loan.id.toString(),
      memberId: loan.memberId.toString(),
      amount: loan.amount,
      issueDate: new Date(loan.issueDate),
      totalInstallments: loan.totalInstallments,
      paidInstallments: loan.paidInstallments,
      nextDueDate: new Date(loan.nextDueDate),
      status: loan.status
    }));
  },
  
  // Get a single loan by ID
  getById: async (loanId: string): Promise<Loan> => {
    const response = await axios.get(`${API_BASE_URL}/loans/${loanId}`);
    const loan = response.data;
    
    return {
      id: loan.id.toString(),
      memberId: loan.memberId.toString(),
      amount: loan.amount,
      issueDate: new Date(loan.issueDate),
      totalInstallments: loan.totalInstallments,
      paidInstallments: loan.paidInstallments,
      nextDueDate: new Date(loan.nextDueDate),
      status: loan.status
    };
  },
  
  // Create a new loan
  create: async (loan: Omit<Loan, 'id'>): Promise<Loan> => {
    const response = await axios.post(`${API_BASE_URL}/loans`, loan);
    const newLoan = response.data;
    
    return {
      id: newLoan.id.toString(),
      memberId: newLoan.memberId.toString(),
      amount: newLoan.amount,
      issueDate: new Date(newLoan.issueDate),
      totalInstallments: newLoan.totalInstallments,
      paidInstallments: newLoan.paidInstallments,
      nextDueDate: new Date(newLoan.nextDueDate),
      status: newLoan.status
    };
  },
  
  // Update an existing loan
  update: async (loanId: string, loan: Partial<Loan>): Promise<Loan> => {
    const response = await axios.put(`${API_BASE_URL}/loans/${loanId}`, loan);
    const updatedLoan = response.data;
    
    return {
      id: updatedLoan.id.toString(),
      memberId: updatedLoan.memberId.toString(),
      amount: updatedLoan.amount,
      issueDate: new Date(updatedLoan.issueDate),
      totalInstallments: updatedLoan.totalInstallments,
      paidInstallments: updatedLoan.paidInstallments,
      nextDueDate: new Date(updatedLoan.nextDueDate),
      status: updatedLoan.status
    };
  },
  
  // Delete a loan
  delete: async (loanId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/loans/${loanId}`);
  },
  
  // Get all installments for a loan
  getInstallments: async (loanId: string, options?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: Record<string, string>;
  }): Promise<Installment[]> => {
    const queryParams = buildQueryParams(options);
    const response = await axios.get(`${API_BASE_URL}/loans/${loanId}/installments${queryParams}`);
    
    return response.data.map((installment: any) => ({
      id: installment.id.toString(),
      loanId: installment.loanId.toString(),
      memberId: installment.memberId.toString(),
      amount: installment.amount,
      dueDate: new Date(installment.dueDate),
      paidDate: installment.paidDate ? new Date(installment.paidDate) : null,
      status: installment.status,
      collectorId: installment.collectorId.toString()
    }));
  }
};

// Installment API endpoints
const installmentApi = {
  // Get all installments
  getAll: async (options?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: Record<string, string>;
  }): Promise<Installment[]> => {
    const queryParams = buildQueryParams(options);
    const response = await axios.get(`${API_BASE_URL}/installments${queryParams}`);
    
    return response.data.map((installment: any) => ({
      id: installment.id.toString(),
      loanId: installment.loanId.toString(),
      memberId: installment.memberId.toString(),
      amount: installment.amount,
      dueDate: new Date(installment.dueDate),
      paidDate: installment.paidDate ? new Date(installment.paidDate) : null,
      status: installment.status,
      collectorId: installment.collectorId.toString()
    }));
  },
  
  // Get a single installment by ID
  getById: async (installmentId: string): Promise<Installment> => {
    const response = await axios.get(`${API_BASE_URL}/installments/${installmentId}`);
    const installment = response.data;
    
    return {
      id: installment.id.toString(),
      loanId: installment.loanId.toString(),
      memberId: installment.memberId.toString(),
      amount: installment.amount,
      dueDate: new Date(installment.dueDate),
      paidDate: installment.paidDate ? new Date(installment.paidDate) : null,
      status: installment.status,
      collectorId: installment.collectorId.toString()
    };
  },
  
  // Create a new installment
  create: async (installment: Omit<Installment, 'id'>): Promise<Installment> => {
    const response = await axios.post(`${API_BASE_URL}/installments`, installment);
    const newInstallment = response.data;
    
    return {
      id: newInstallment.id.toString(),
      loanId: newInstallment.loanId.toString(),
      memberId: newInstallment.memberId.toString(),
      amount: newInstallment.amount,
      dueDate: new Date(newInstallment.dueDate),
      paidDate: newInstallment.paidDate ? new Date(newInstallment.paidDate) : null,
      status: newInstallment.status,
      collectorId: newInstallment.collectorId.toString()
    };
  },
  
  // Update an existing installment
  update: async (installmentId: string, installment: Partial<Installment>): Promise<Installment> => {
    const response = await axios.put(`${API_BASE_URL}/installments/${installmentId}`, installment);
    const updatedInstallment = response.data;
    
    return {
      id: updatedInstallment.id.toString(),
      loanId: updatedInstallment.loanId.toString(),
      memberId: updatedInstallment.memberId.toString(),
      amount: updatedInstallment.amount,
      dueDate: new Date(updatedInstallment.dueDate),
      paidDate: updatedInstallment.paidDate ? new Date(updatedInstallment.paidDate) : null,
      status: updatedInstallment.status,
      collectorId: updatedInstallment.collectorId.toString()
    };
  },
  
  // Delete an installment
  delete: async (installmentId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/installments/${installmentId}`);
  },
  
  // Get all overdue installments
  getOverdue: async (options?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: Record<string, string>;
  }): Promise<Installment[]> => {
    const queryParams = buildQueryParams(options);
    const response = await axios.get(`/installments/overdue${queryParams}`);
    
    return response.data.map((installment: any) => ({
      id: installment.id.toString(),
      loanId: installment.loanId.toString(),
      memberId: installment.memberId.toString(),
      amount: installment.amount,
      dueDate: new Date(installment.dueDate),
      paidDate: installment.paidDate ? new Date(installment.paidDate) : null,
      status: installment.status,
      collectorId: installment.collectorId.toString()
    }));
  },
  
  // Get all pending installments
  getPending: async (options?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: Record<string, string>;
  }): Promise<Installment[]> => {
    const queryParams = buildQueryParams(options);
    const response = await axios.get(`/installments/pending${queryParams}`);
    
    return response.data.map((installment: any) => ({
      id: installment.id.toString(),
      loanId: installment.loanId.toString(),
      memberId: installment.memberId.toString(),
      amount: installment.amount,
      dueDate: new Date(installment.dueDate),
      paidDate: installment.paidDate ? new Date(installment.paidDate) : null,
      status: installment.status,
      collectorId: installment.collectorId.toString()
    }));
  }
};

// Collector API endpoints
const collectorApi = {
  // Get all collectors
  getAll: async (options?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: Record<string, string>;
  }): Promise<Collector[]> => {
    const queryParams = buildQueryParams(options);
    const response = await axios.get(`${API_BASE_URL}/collectors${queryParams}`);
    
    return response.data.map((collector: any) => ({
      id: collector.id.toString(),
      name: collector.name,
      contactNumber: collector.contactNumber,
      email: collector.email,
      assignedMembers: collector.assignedMembers,
      collectionsToday: collector.collectionsToday,
      totalCollected: collector.totalCollected,
      unionId: collector.unionId.toString()
    }));
  },
  
  // Get a single collector by ID
  getById: async (collectorId: string): Promise<Collector> => {
    const response = await axios.get(`${API_BASE_URL}/collectors/${collectorId}`);
    const collector = response.data;
    
    return {
      id: collector.id.toString(),
      name: collector.name,
      contactNumber: collector.contactNumber,
      email: collector.email,
      assignedMembers: collector.assignedMembers,
      collectionsToday: collector.collectionsToday,
      totalCollected: collector.totalCollected,
      unionId: collector.unionId.toString()
    };
  },
  
  // Get all installments assigned to a collector
  getInstallments: async (collectorId: string, options?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: Record<string, string>;
  }): Promise<Installment[]> => {
    const queryParams = buildQueryParams(options);
    const response = await axios.get(`${API_BASE_URL}/collectors/${collectorId}/installments${queryParams}`);
    
    return response.data.map((installment: any) => ({
      id: installment.id.toString(),
      loanId: installment.loanId.toString(),
      memberId: installment.memberId.toString(),
      amount: installment.amount,
      dueDate: new Date(installment.dueDate),
      paidDate: installment.paidDate ? new Date(installment.paidDate) : null,
      status: installment.status,
      collectorId: installment.collectorId.toString()
    }));
  }
};

// Summary API endpoints
const summaryApi = {
  // Get collection summary
  getCollectionSummary: async (): Promise<CollectionSummary> => {
    const response = await axios.get(`${API_BASE_URL}/summary/collection`);
    const summary = response.data;
    
    return {
      totalLoans: summary.totalLoans,
      activeLoans: summary.activeLoans,
      completedLoans: summary.completedLoans,
      defaultedLoans: summary.defaultedLoans,
      totalAmount: summary.totalAmount,
      totalCollected: summary.totalCollected,
      pendingAmount: summary.pendingAmount
    };
  }
};

// Authentication API endpoints
const authApi = {
  // Login to the system
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(`/web/session/authenticate`, {
        jsonrpc: "2.0",
        method: "call",
        params: {
          db: "ranchi",
          login: username,
          password,
        },
      });
      
      if (response.data.error) {
        throw new Error(response.data.error.message || "Authentication failed");
      }
      
      return response.data.result;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  // Logout from the system
  logout: async () => {
    try {
      await axios.post(`/web/session/destroy`, {
        jsonrpc: "2.0",
        method: "call",
        params: {},
      });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
};

// Export all API endpoints
const apiService = {
  auth: authApi,
  unions: unionApi,
  members: memberApi,
  loans: loanApi,
  installments: installmentApi,
  collectors: collectorApi,
  summary: summaryApi
};

export default apiService;