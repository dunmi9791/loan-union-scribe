
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { getAllInstallments, formatCurrency } from "@/utils/dataUtils";
import StatusBadge from "@/components/ui/StatusBadge";

const Schedule = () => {
  const allInstallments = getAllInstallments();
  const [filter, setFilter] = useState<"all" | "pending" | "paid" | "overdue">("all");
  
  // Group installments by month
  const groupedInstallments: Record<string, typeof allInstallments> = {};
  
  allInstallments.forEach(installment => {
    // Filter by status if needed
    if (filter !== "all" && installment.status !== filter) return;
    
    const date = new Date(installment.dueDate);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!groupedInstallments[monthYear]) {
      groupedInstallments[monthYear] = [];
    }
    
    groupedInstallments[monthYear].push(installment);
  });

  // Sort months in chronological order
  const sortedMonths = Object.keys(groupedInstallments).sort();

  // Function to get the month name
  const getMonthName = (monthYear: string) => {
    const [year, month] = monthYear.split('-').map(Number);
    return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <Layout title="Collection Schedule">
      <div className="mb-6">
        <div className="flex space-x-4">
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === "all" 
                ? "bg-loan-primary text-white" 
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === "pending" 
                ? "bg-loan-primary text-white" 
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter("paid")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === "paid" 
                ? "bg-loan-primary text-white" 
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Paid
          </button>
          <button 
            onClick={() => setFilter("overdue")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === "overdue" 
                ? "bg-loan-primary text-white" 
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Overdue
          </button>
        </div>
      </div>

      {sortedMonths.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No installments match the selected filter</p>
        </Card>
      ) : (
        sortedMonths.map(month => (
          <Card key={month} className="p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">{getMonthName(month)}</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Collector
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groupedInstallments[month].map((installment) => (
                    <tr key={installment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(installment.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="font-medium text-gray-900">Member {installment.memberId.substring(0, 4)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        Collector {installment.collectorId.substring(0, 4)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(installment.amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={installment.status} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {installment.paidDate 
                          ? new Date(installment.paidDate).toLocaleDateString() 
                          : '-'
                        }
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {installment.status !== "paid" && (
                          <button className="text-loan-primary hover:text-loan-secondary font-medium">
                            Record Payment
                          </button>
                        )}
                        {installment.status === "paid" && (
                          <button className="text-gray-500 font-medium cursor-default">
                            Completed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))
      )}
    </Layout>
  );
};

export default Schedule;
