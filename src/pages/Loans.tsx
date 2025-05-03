
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { getAllLoans, formatCurrency, formatDate } from "@/utils/dataUtils";
import StatusBadge from "@/components/ui/StatusBadge";
import { useNavigate } from "react-router-dom";

const Loans = () => {
  const loans = getAllLoans();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "defaulted">("all");
  
  const filteredLoans = filter === "all" 
    ? loans 
    : loans.filter(loan => loan.status === filter);

  const calculateProgress = (loan: any) => {
    return (loan.paidInstallments / loan.totalInstallments) * 100;
  };

  return (
    <Layout title="Loans">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-bold">Union Loans</h2>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button 
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-sm ${filter === "all" ? "bg-loan-primary text-white" : "bg-white text-gray-700"}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter("active")}
                className={`px-4 py-2 text-sm ${filter === "active" ? "bg-loan-primary text-white" : "bg-white text-gray-700"}`}
              >
                Active
              </button>
              <button 
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 text-sm ${filter === "completed" ? "bg-loan-primary text-white" : "bg-white text-gray-700"}`}
              >
                Completed
              </button>
              <button 
                onClick={() => setFilter("defaulted")}
                className={`px-4 py-2 text-sm ${filter === "defaulted" ? "bg-loan-primary text-white" : "bg-white text-gray-700"}`}
              >
                Defaulted
              </button>
            </div>
          </div>
          <button className="px-4 py-2 bg-loan-primary text-white rounded-lg text-sm font-medium hover:bg-loan-secondary transition-colors">
            Issue New Loan
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Due
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">Member {loan.memberId.substring(0, 4)}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    {formatCurrency(loan.amount)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(loan.issueDate)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {loan.status === "completed" ? "Completed" : formatDate(loan.nextDueDate)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${loan.status === "defaulted" ? "bg-loan-danger" : "bg-loan-primary"}`}
                        style={{ width: `${calculateProgress(loan)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {loan.paidInstallments} of {loan.totalInstallments} installments
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status={loan.status} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <button 
                      className="text-loan-primary hover:text-loan-secondary font-medium"
                      onClick={() => navigate(`/loans/${loan.id}`)}
                    >
                      View
                    </button>
                    {loan.status === "active" && (
                      <>
                        <span className="px-2 text-gray-300">|</span>
                        <button className="text-loan-primary hover:text-loan-secondary font-medium">
                          Record Payment
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLoans.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No {filter} loans found</p>
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredLoans.length}</span> of{" "}
            <span className="font-medium">{filteredLoans.length}</span> loans
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default Loans;
