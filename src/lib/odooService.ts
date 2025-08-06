import axios from "./axiosConfig";
import { Member, Loan, Installment, Collector, CollectionSummary, Union } from "../types/index";

// Get environment variables with fallbacks
const getEnv = (key: string, fallback: string): string => {
  // Try to get from window.ENV (for production builds)
  if (window.ENV && window.ENV[key]) {
    return window.ENV[key];
  }

  // Try to get from import.meta.env (for development)
  // @ts-ignore - Vite specific
  if (import.meta.env && import.meta.env[key]) {
    // @ts-ignore - Vite specific
    return import.meta.env[key];
  }

  // Fallback value
  return fallback;
};

// Get Odoo configuration from environment variables
const ODOO_URL = "/web";
const ODOO_DB = "ranchi";

/**
 * Logs in to Odoo using provided credentials.
 * @param username The Odoo login/username
 * @param password The Odoo password
 * @returns Odoo session result or throws error
 */
async function login(username: string, password: string) {
  const response = await axios.post(`${ODOO_URL}/session/authenticate`, {
    jsonrpc: "2.0",
    method: "call",
    params: {
      db: ODOO_DB,
      login: username,
      password,
    },
  });

  return response.data.result; // contains uid, name, session_id etc.
}

/**
 * Logs out from Odoo (optional based on frontend state)
 */
async function logout() {
  await axios.post(`${ODOO_URL}/web/session/destroy`, {
    jsonrpc: "2.0",
    method: "call",
    params: {},
  });
}

/**
 * Generic function to call Odoo models using RPC
 * @param model The Odoo model name
 * @param method The method to call on the model
 * @param args Arguments for the method
 * @param kwargs Keyword arguments for the method
 * @returns The result from the Odoo server
 */
async function callOdoo(model: string, method: string, args: any[] = [], kwargs: any = {}) {
  try {
    const response = await axios.post(`${ODOO_URL}/jsonrpc`, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        model,
        method,
        args,
        kwargs,
        context: {},
      },
    });

    if (response.data.error) {
      throw new Error(response.data.error.message || "Unknown Odoo error");
    }

    return response.data.result;
  } catch (error) {
    console.error("Error calling Odoo:", error);
    throw error;
  }
}

/**
 * Fetch all unions from Odoo
 * @returns Array of Union objects
 */
async function fetchUnions(): Promise<Union[]> {
  const result = await callOdoo(
    "loan.union",
    "search_read",
    [[]],
    {
      fields: ["id", "name", "leader_id", "purse", "member_count", "create_date", "status"]
    }
  );
  
  return result.map((union: any) => ({
    id: union.id.toString(),
    name: union.name,
    leaderId: union.leader_id ? union.leader_id[0].toString() : "",
    purse: union.purse,
    memberCount: union.member_count,
    createdDate: new Date(union.create_date),
    status: union.status
  }));
}

/**
 * Fetch a specific union by ID
 * @param id Union ID
 * @returns Union object or undefined
 */
async function fetchUnionById(id: string): Promise<Union | undefined> {
  const result = await callOdoo(
    "loan.union",
    "search_read",
    [[["id", "=", parseInt(id)]]],
    {
      fields: ["id", "name", "leader_id", "purse", "member_count", "create_date", "status"]
    }
  );
  
  if (result.length === 0) return undefined;
  
  const union = result[0];
  return {
    id: union.id.toString(),
    name: union.name,
    leaderId: union.leader_id ? union.leader_id[0].toString() : "",
    purse: union.purse,
    memberCount: union.member_count,
    createdDate: new Date(union.create_date),
    status: union.status
  };
}

/**
 * Fetch all members from Odoo
 * @returns Array of Member objects
 */
async function fetchMembers(): Promise<Member[]> {
  const result = await callOdoo(
    "loan.member",
    "search_read",
    [[]],
    {
      fields: ["id", "name", "contact_number", "email", "join_date", "status", "balance", "union_id"]
    }
  );
  
  return result.map((member: any) => ({
    id: member.id.toString(),
    name: member.name,
    contactNumber: member.contact_number,
    email: member.email,
    joinDate: new Date(member.join_date),
    status: member.status,
    balance: member.balance,
    unionId: member.union_id ? member.union_id[0].toString() : ""
  }));
}

/**
 * Fetch a specific member by ID
 * @param id Member ID
 * @returns Member object or undefined
 */
async function fetchMemberById(id: string): Promise<Member | undefined> {
  const result = await callOdoo(
    "loan.member",
    "search_read",
    [[["id", "=", parseInt(id)]]],
    {
      fields: ["id", "name", "contact_number", "email", "join_date", "status", "balance", "union_id"]
    }
  );
  
  if (result.length === 0) return undefined;
  
  const member = result[0];
  return {
    id: member.id.toString(),
    name: member.name,
    contactNumber: member.contact_number,
    email: member.email,
    joinDate: new Date(member.join_date),
    status: member.status,
    balance: member.balance,
    unionId: member.union_id ? member.union_id[0].toString() : ""
  };
}

/**
 * Fetch all loans from Odoo
 * @returns Array of Loan objects
 */
async function fetchLoans(): Promise<Loan[]> {
  const result = await callOdoo(
    "loan.loan",
    "search_read",
    [[]],
    {
      fields: ["id", "member_id", "amount", "issue_date", "total_installments", "paid_installments", "next_due_date", "status"]
    }
  );
  
  return result.map((loan: any) => ({
    id: loan.id.toString(),
    memberId: loan.member_id ? loan.member_id[0].toString() : "",
    amount: loan.amount,
    issueDate: new Date(loan.issue_date),
    totalInstallments: loan.total_installments,
    paidInstallments: loan.paid_installments,
    nextDueDate: new Date(loan.next_due_date),
    status: loan.status
  }));
}

/**
 * Fetch a specific loan by ID
 * @param id Loan ID
 * @returns Loan object or undefined
 */
async function fetchLoanById(id: string): Promise<Loan | undefined> {
  const result = await callOdoo(
    "loan.loan",
    "search_read",
    [[["id", "=", parseInt(id)]]],
    {
      fields: ["id", "member_id", "amount", "issue_date", "total_installments", "paid_installments", "next_due_date", "status"]
    }
  );
  
  if (result.length === 0) return undefined;
  
  const loan = result[0];
  return {
    id: loan.id.toString(),
    memberId: loan.member_id ? loan.member_id[0].toString() : "",
    amount: loan.amount,
    issueDate: new Date(loan.issue_date),
    totalInstallments: loan.total_installments,
    paidInstallments: loan.paid_installments,
    nextDueDate: new Date(loan.next_due_date),
    status: loan.status
  };
}

/**
 * Fetch all installments from Odoo
 * @returns Array of Installment objects
 */
async function fetchInstallments(): Promise<Installment[]> {
  const result = await callOdoo(
    "loan.installment",
    "search_read",
    [[]],
    {
      fields: ["id", "loan_id", "member_id", "amount", "due_date", "paid_date", "status", "collector_id"]
    }
  );
  
  return result.map((installment: any) => {
    // Store the original date strings as additional properties
    const mappedInstallment = {
      id: installment.id.toString(),
      loanId: installment.loan_id ? installment.loan_id[0].toString() : "",
      memberId: installment.member_id ? installment.member_id[0].toString() : "",
      amount: installment.amount,
      dueDate: new Date(installment.due_date),
      paidDate: installment.paid_date ? new Date(installment.paid_date) : null,
      status: installment.status,
      collectorId: installment.collector_id ? installment.collector_id[0].toString() : "",
      // Add original date strings for display purposes
      dueDateStr: installment.due_date,
      paidDateStr: installment.paid_date || null
    };
    
    return mappedInstallment;
  });
}

/**
 * Fetch all collectors from Odoo
 * @returns Array of Collector objects
 */
async function fetchCollectors(): Promise<Collector[]> {
  const result = await callOdoo(
    "loan.collector",
    "search_read",
    [[]],
    {
      fields: ["id", "name", "contact_number", "email", "assigned_members", "collections_today", "total_collected", "union_id"]
    }
  );
  
  return result.map((collector: any) => ({
    id: collector.id.toString(),
    name: collector.name,
    contactNumber: collector.contact_number,
    email: collector.email,
    assignedMembers: collector.assigned_members,
    collectionsToday: collector.collections_today,
    totalCollected: collector.total_collected,
    unionId: collector.union_id ? collector.union_id[0].toString() : ""
  }));
}

/**
 * Fetch collection summary from Odoo
 * @returns CollectionSummary object
 */
async function fetchCollectionSummary(): Promise<CollectionSummary> {
  const result = await callOdoo(
    "loan.collection.summary",
    "get_summary",
    [],
    {}
  );
  
  return {
    totalLoans: result.total_loans,
    activeLoans: result.active_loans,
    completedLoans: result.completed_loans,
    defaultedLoans: result.defaulted_loans,
    totalAmount: result.total_amount,
    totalCollected: result.total_collected,
    pendingAmount: result.pending_amount
  };
}

const odooService = {
  login,
  logout,
  fetchUnions,
  fetchUnionById,
  fetchMembers,
  fetchMemberById,
  fetchLoans,
  fetchLoanById,
  fetchInstallments,
  fetchCollectors,
  fetchCollectionSummary
};

export default odooService;
