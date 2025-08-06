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

/**
 * Extract the useful payload from an axios response.
 *
 * Our backends sometimes wrap the data in an object under a `result` property
 * (e.g. `{ result: [...] }`) along with other metadata such as a status code
 * or message. In other cases the payload is returned directly as the response
 * body. This helper centralises the logic so each API call can reliably
 * retrieve the underlying data regardless of the response shape.
 *
 * @param response The axios response object
 * @returns The extracted data payload
 */
const extractData = (response: any) => {
  const data = response?.data;
  if (data && typeof data === 'object' && 'result' in data) {
    return (data as any).result;
  }
  return data;
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
    // Extract payload from response; some backends wrap results under `result`
    const data = extractData(response);
    return (Array.isArray(data) ? data : [data]).map((union: any) => ({
      id: String(union.id),
      name: union.name,
      leaderId: union.leaderId != null ? String(union.leaderId) : "",
      purse: union.purse,
      memberCount: union.memberCount,
      createdDate: union.createdDate ? new Date(union.createdDate) : new Date(),
      status: union.status
    }));
  },
  
  // Get a single union by ID
  getById: async (unionId: string): Promise<Union> => {
    const response = await axios.get(`${API_BASE_URL}/unions/${unionId}`);
    const raw = extractData(response);
    const union = Array.isArray(raw) ? raw[0] : raw;
    
    return {
      id: String(union.id),
      name: union.name,
      leaderId: union.leaderId != null ? String(union.leaderId) : "",
      purse: union.purse,
      memberCount: union.memberCount,
      createdDate: union.createdDate ? new Date(union.createdDate) : new Date(),
      status: union.status
    };
  },
  
  // Create a new union
  create: async (union: Omit<Union, 'id'>): Promise<Union> => {
    const response = await axios.post(`${API_BASE_URL}/unions`, union);
    // Some backends return the created record directly while others wrap it
    // in an array or under a `result` property. Use the helper to normalise.
    const payload = extractData(response);
    const record: any = Array.isArray(payload) ? payload[0] : payload;

    return {
      id: record.id != null ? String(record.id) : "",
      name: record.name,
      leaderId: record.leaderId != null ? String(record.leaderId) : "",
      purse: record.purse,
      memberCount: record.memberCount,
      createdDate: record.createdDate ? new Date(record.createdDate) : new Date(),
      status: record.status
    };
  },
  
  // Update an existing union
  update: async (unionId: string, union: Partial<Union>): Promise<Union> => {
    const response = await axios.put(`${API_BASE_URL}/unions/${unionId}`, union);
    const payload = extractData(response);
    const record: any = Array.isArray(payload) ? payload[0] : payload;

    return {
      id: record.id != null ? String(record.id) : "",
      name: record.name,
      leaderId: record.leaderId != null ? String(record.leaderId) : "",
      purse: record.purse,
      memberCount: record.memberCount,
      createdDate: record.createdDate ? new Date(record.createdDate) : new Date(),
      status: record.status
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
    const data = extractData(response);

    return (Array.isArray(data) ? data : [data]).map((member: any) => ({
      id: String(member.id ?? member.memberId),
      name: member.name,
      contactNumber: member.contactNumber,
      email: member.email,
      joinDate: member.joinDate ? new Date(member.joinDate) : new Date(),
      status: member.status,
      balance: member.balance,
      unionId: String(member.unionId ?? unionId)
    }));
  },
  
  // Get collectors and summary stats for a union
  getCollectors: async (unionId: string): Promise<Collector[]> => {
    const response = await axios.get(`${API_BASE_URL}/unions/${unionId}/collectors`);
    const data = extractData(response);

    return (Array.isArray(data) ? data : [data]).map((collector: any) => ({
      id: collector.id != null ? String(collector.id) : "",
      name: collector.name,
      contactNumber: collector.contactNumber,
      email: collector.email,
      assignedMembers: collector.assignedMembers,
      collectionsToday: collector.collectionsToday,
      totalCollected: collector.totalCollected,
      unionId: collector.unionId != null ? String(collector.unionId) : String(unionId)
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
    const data = extractData(response);

    return (Array.isArray(data) ? data : [data]).map((member: any) => ({
      id: String(member.id ?? member.memberId),
      name: member.name,
      contactNumber: member.contactNumber,
      email: member.email,
      joinDate: member.joinDate ? new Date(member.joinDate) : new Date(),
      status: member.status,
      balance: member.balance,
      unionId: member.unionId != null ? String(member.unionId) : ""
    }));
  },
  
  // Get a single member by ID
  getById: async (memberId: string): Promise<Member> => {
    const response = await axios.get(`${API_BASE_URL}/members/${memberId}`);
    const payload = extractData(response);
    const member = Array.isArray(payload) ? payload[0] : payload;

    return {
      id: member.id != null ? String(member.id) : "",
      name: member.name,
      contactNumber: member.contactNumber,
      email: member.email,
      joinDate: member.joinDate ? new Date(member.joinDate) : new Date(),
      status: member.status,
      balance: member.balance,
      unionId: member.unionId != null ? String(member.unionId) : ""
    };
  },
  
  // Create a new member
  create: async (member: Omit<Member, 'id'>): Promise<Member> => {
    const response = await axios.post(`${API_BASE_URL}/members`, member);
    const payload = extractData(response);
    const record: any = Array.isArray(payload) ? payload[0] : payload;

    return {
      id: record.id != null ? String(record.id) : "",
      name: record.name,
      contactNumber: record.contactNumber,
      email: record.email,
      joinDate: record.joinDate ? new Date(record.joinDate) : new Date(),
      status: record.status,
      balance: record.balance,
      unionId: record.unionId != null ? String(record.unionId) : ""
    };
  },
  
  // Update an existing member
  update: async (memberId: string, member: Partial<Member>): Promise<Member> => {
    const response = await axios.put(`${API_BASE_URL}/members/${memberId}`, member);
    const payload = extractData(response);
    const record: any = Array.isArray(payload) ? payload[0] : payload;

    return {
      id: record.id != null ? String(record.id) : "",
      name: record.name,
      contactNumber: record.contactNumber,
      email: record.email,
      joinDate: record.joinDate ? new Date(record.joinDate) : new Date(),
      status: record.status,
      balance: record.balance,
      unionId: record.unionId != null ? String(record.unionId) : ""
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
    const data = extractData(response);

    return (Array.isArray(data) ? data : [data]).map((loan: any) => ({
      id: String(loan.id),
      memberId: String(loan.memberId ?? memberId),
      amount: loan.amount,
      issueDate: loan.issueDate ? new Date(loan.issueDate) : new Date(),
      totalInstallments: loan.totalInstallments,
      paidInstallments: loan.paidInstallments,
      nextDueDate: loan.nextDueDate ? new Date(loan.nextDueDate) : new Date(),
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
    const data = extractData(response);

    return (Array.isArray(data) ? data : [data]).map((installment: any) => ({
      id: String(installment.id),
      loanId: installment.loanId != null ? String(installment.loanId) : "",
      memberId: installment.memberId != null ? String(installment.memberId) : String(memberId),
      amount: installment.amount,
      dueDate: installment.dueDate ? new Date(installment.dueDate) : new Date(),
      paidDate: installment.paidDate ? new Date(installment.paidDate) : null,
      status: installment.status,
      collectorId: installment.collectorId != null ? String(installment.collectorId) : ""
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
    const data = extractData(response);

    return (Array.isArray(data) ? data : [data]).map((loan: any) => ({
      id: String(loan.id),
      memberId: loan.memberId != null ? String(loan.memberId) : "",
      amount: loan.amount,
      issueDate: loan.issueDate ? new Date(loan.issueDate) : new Date(),
      totalInstallments: loan.totalInstallments,
      paidInstallments: loan.paidInstallments,
      nextDueDate: loan.nextDueDate ? new Date(loan.nextDueDate) : new Date(),
      status: loan.status
    }));
  },
  
  // Get a single loan by ID
  getById: async (loanId: string): Promise<Loan> => {
    const response = await axios.get(`${API_BASE_URL}/loans/${loanId}`);
    const payload = extractData(response);
    const loan = Array.isArray(payload) ? payload[0] : payload;

    return {
      id: loan.id != null ? String(loan.id) : "",
      memberId: loan.memberId != null ? String(loan.memberId) : "",
      amount: loan.amount,
      issueDate: loan.issueDate ? new Date(loan.issueDate) : new Date(),
      totalInstallments: loan.totalInstallments,
      paidInstallments: loan.paidInstallments,
      nextDueDate: loan.nextDueDate ? new Date(loan.nextDueDate) : new Date(),
      status: loan.status
    };
  },
  
  // Create a new loan
  create: async (loan: Omit<Loan, 'id'>): Promise<Loan> => {
    const response = await axios.post(`${API_BASE_URL}/loans`, loan);
    const payload = extractData(response);
    const record: any = Array.isArray(payload) ? payload[0] : payload;

    return {
      id: record.id != null ? String(record.id) : "",
      memberId: record.memberId != null ? String(record.memberId) : "",
      amount: record.amount,
      issueDate: record.issueDate ? new Date(record.issueDate) : new Date(),
      totalInstallments: record.totalInstallments,
      paidInstallments: record.paidInstallments,
      nextDueDate: record.nextDueDate ? new Date(record.nextDueDate) : new Date(),
      status: record.status
    };
  },
  
  // Update an existing loan
  update: async (loanId: string, loan: Partial<Loan>): Promise<Loan> => {
    const response = await axios.put(`${API_BASE_URL}/loans/${loanId}`, loan);
    const payload = extractData(response);
    const record: any = Array.isArray(payload) ? payload[0] : payload;

    return {
      id: record.id != null ? String(record.id) : "",
      memberId: record.memberId != null ? String(record.memberId) : "",
      amount: record.amount,
      issueDate: record.issueDate ? new Date(record.issueDate) : new Date(),
      totalInstallments: record.totalInstallments,
      paidInstallments: record.paidInstallments,
      nextDueDate: record.nextDueDate ? new Date(record.nextDueDate) : new Date(),
      status: record.status
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
    const data = extractData(response);

    return (Array.isArray(data) ? data : [data]).map((installment: any) => ({
      id: String(installment.id),
      loanId: installment.loanId != null ? String(installment.loanId) : String(loanId),
      memberId: installment.memberId != null ? String(installment.memberId) : "",
      amount: installment.amount,
      dueDate: installment.dueDate ? new Date(installment.dueDate) : new Date(),
      paidDate: installment.paidDate ? new Date(installment.paidDate) : null,
      status: installment.status,
      collectorId: installment.collectorId != null ? String(installment.collectorId) : ""
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
    const data = extractData(response);

    return (Array.isArray(data) ? data : [data]).map((installment: any) => ({
      id: String(installment.id),
      loanId: installment.loanId != null ? String(installment.loanId) : "",
      memberId: installment.memberId != null ? String(installment.memberId) : "",
      amount: installment.amount,
      dueDate: installment.dueDate ? new Date(installment.dueDate) : new Date(),
      paidDate: installment.paidDate ? new Date(installment.paidDate) : null,
      status: installment.status,
      collectorId: installment.collectorId != null ? String(installment.collectorId) : ""
    }));
  },
  
  // Get a single installment by ID
  getById: async (installmentId: string): Promise<Installment> => {
    const response = await axios.get(`${API_BASE_URL}/installments/${installmentId}`);
    const payload = extractData(response);
    const installment = Array.isArray(payload) ? payload[0] : payload;

    return {
      id: installment.id != null ? String(installment.id) : "",
      loanId: installment.loanId != null ? String(installment.loanId) : "",
      memberId: installment.memberId != null ? String(installment.memberId) : "",
      amount: installment.amount,
      dueDate: installment.dueDate ? new Date(installment.dueDate) : new Date(),
      paidDate: installment.paidDate ? new Date(installment.paidDate) : null,
      status: installment.status,
      collectorId: installment.collectorId != null ? String(installment.collectorId) : ""
    };
  },
  
  // Create a new installment
  create: async (installment: Omit<Installment, 'id'>): Promise<Installment> => {
    const response = await axios.post(`${API_BASE_URL}/installments`, installment);
    const payload = extractData(response);
    const record: any = Array.isArray(payload) ? payload[0] : payload;

    return {
      id: record.id != null ? String(record.id) : "",
      loanId: record.loanId != null ? String(record.loanId) : "",
      memberId: record.memberId != null ? String(record.memberId) : "",
      amount: record.amount,
      dueDate: record.dueDate ? new Date(record.dueDate) : new Date(),
      paidDate: record.paidDate ? new Date(record.paidDate) : null,
      status: record.status,
      collectorId: record.collectorId != null ? String(record.collectorId) : ""
    };
  },
  
  // Update an existing installment
  update: async (installmentId: string, installment: Partial<Installment>): Promise<Installment> => {
    const response = await axios.put(`${API_BASE_URL}/installments/${installmentId}`, installment);
    const payload = extractData(response);
    const record: any = Array.isArray(payload) ? payload[0] : payload;

    return {
      id: record.id != null ? String(record.id) : "",
      loanId: record.loanId != null ? String(record.loanId) : "",
      memberId: record.memberId != null ? String(record.memberId) : "",
      amount: record.amount,
      dueDate: record.dueDate ? new Date(record.dueDate) : new Date(),
      paidDate: record.paidDate ? new Date(record.paidDate) : null,
      status: record.status,
      collectorId: record.collectorId != null ? String(record.collectorId) : ""
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
    const response = await axios.get(`${API_BASE_URL}/installments/overdue${queryParams}`);
    const data = extractData(response);

    return (Array.isArray(data) ? data : [data]).map((installment: any) => ({
      id: String(installment.id),
      loanId: installment.loanId != null ? String(installment.loanId) : "",
      memberId: installment.memberId != null ? String(installment.memberId) : "",
      amount: installment.amount,
      dueDate: installment.dueDate ? new Date(installment.dueDate) : new Date(),
      paidDate: installment.paidDate ? new Date(installment.paidDate) : null,
      status: installment.status,
      collectorId: installment.collectorId != null ? String(installment.collectorId) : ""
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
    const response = await axios.get(`${API_BASE_URL}/installments/pending${queryParams}`);
    const data = extractData(response);

    return (Array.isArray(data) ? data : [data]).map((installment: any) => ({
      id: String(installment.id),
      loanId: installment.loanId != null ? String(installment.loanId) : "",
      memberId: installment.memberId != null ? String(installment.memberId) : "",
      amount: installment.amount,
      dueDate: installment.dueDate ? new Date(installment.dueDate) : new Date(),
      paidDate: installment.paidDate ? new Date(installment.paidDate) : null,
      status: installment.status,
      collectorId: installment.collectorId != null ? String(installment.collectorId) : ""
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
    // Prefix with API_BASE_URL to match the rest of the endpoints
    const response = await axios.get(`${API_BASE_URL}/collectors${queryParams}`);
    const data = extractData(response);

    return (Array.isArray(data) ? data : [data]).map((collector: any) => ({
      id: collector.id != null ? String(collector.id) : "",
      name: collector.name,
      contactNumber: collector.contactNumber,
      email: collector.email,
      assignedMembers: collector.assignedMembers,
      collectionsToday: collector.collectionsToday,
      totalCollected: collector.totalCollected,
      unionId: collector.unionId != null ? String(collector.unionId) : ""
    }));
  },
  
  // Get a single collector by ID
  getById: async (collectorId: string): Promise<Collector> => {
    const response = await axios.get(`${API_BASE_URL}/collectors/${collectorId}`);
    const payload = extractData(response);
    const collector: any = Array.isArray(payload) ? payload[0] : payload || {};

    return {
      id: collector.id != null ? String(collector.id) : "",
      name: collector.name,
      contactNumber: collector.contactNumber,
      email: collector.email,
      assignedMembers: collector.assignedMembers,
      collectionsToday: collector.collectionsToday,
      totalCollected: collector.totalCollected,
      unionId: collector.unionId != null ? String(collector.unionId) : ""
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
    const data = extractData(response);

    return (Array.isArray(data) ? data : [data]).map((installment: any) => ({
      id: String(installment.id),
      loanId: installment.loanId != null ? String(installment.loanId) : "",
      memberId: installment.memberId != null ? String(installment.memberId) : "",
      amount: installment.amount,
      dueDate: installment.dueDate ? new Date(installment.dueDate) : new Date(),
      paidDate: installment.paidDate ? new Date(installment.paidDate) : null,
      status: installment.status,
      collectorId: installment.collectorId != null ? String(installment.collectorId) : ""
    }));
  }
};

// Summary API endpoints
const summaryApi = {
  // Get collection summary
  getCollectionSummary: async (): Promise<CollectionSummary> => {
    const response = await axios.get(`${API_BASE_URL}/summary/collection`);
    const payload = extractData(response);
    const summary: any = Array.isArray(payload) ? payload[0] : payload;

    return {
      totalLoans: summary.totalLoans ?? 0,
      activeLoans: summary.activeLoans ?? 0,
      completedLoans: summary.completedLoans ?? 0,
      defaultedLoans: summary.defaultedLoans ?? 0,
      totalAmount: summary.totalAmount ?? 0,
      totalCollected: summary.totalCollected ?? 0,
      pendingAmount: summary.pendingAmount ?? 0
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