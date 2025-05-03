
import React from "react";
import { getCollectionSummary, formatCurrency, getOverdueInstallments, getPendingInstallments } from "@/utils/dataUtils";
import Layout from "@/components/layout/Layout";
import StatCard from "@/components/ui/StatCard";
import { Coins, Users, Calendar, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import StatusBadge from "@/components/ui/StatusBadge";

const Dashboard = () => {
  const summary = getCollectionSummary();
  const overdueInstallments = getOverdueInstallments();
  const pendingInstallments = getPendingInstallments().slice(0, 5); // Get only 5 for display
  const navigate = useNavigate();
  
  const collectionProgress = (summary.totalCollected / summary.totalAmount) * 100;
  
  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Collection"
          value={formatCurrency(summary.totalCollected)}
          icon={<Coins className="h-6 w-6 text-loan-primary" />}
          change={`${collectionProgress.toFixed(1)}% of total`}
          changeType={collectionProgress > 70 ? "positive" : "neutral"}
        />
        <StatCard
          title="Active Loans"
          value={summary.activeLoans}
          icon={<FileText className="h-6 w-6 text-loan-primary" />}
          change={`${summary.totalLoans} total loans`}
          changeType="neutral"
        />
        <StatCard
          title="Pending Amount"
          value={formatCurrency(summary.pendingAmount)}
          icon={<Calendar className="h-6 w-6 text-loan-primary" />}
          change={`${summary.defaultedLoans} defaulted loans`}
          changeType={summary.defaultedLoans > 0 ? "negative" : "neutral"}
        />
        <StatCard
          title="Overdue Installments"
          value={overdueInstallments.length}
          icon={<Users className="h-6 w-6 text-loan-primary" />}
          change="Requires attention"
          changeType={overdueInstallments.length > 0 ? "negative" : "positive"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Upcoming Collections</h2>
            <button 
              className="text-sm text-loan-primary hover:underline"
              onClick={() => navigate('/schedule')}
            >
              View All
            </button>
          </div>
          
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
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingInstallments.map((installment) => (
                  <tr key={installment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(installment.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      Member {installment.memberId.substring(0, 4)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                      {formatCurrency(installment.amount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status="pending" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Overdue Collections</h2>
            <button 
              className="text-sm text-loan-primary hover:underline"
              onClick={() => navigate('/schedule')}
            >
              View All
            </button>
          </div>
          
          {overdueInstallments.length > 0 ? (
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
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days Overdue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {overdueInstallments.slice(0, 5).map((installment) => {
                    const daysOverdue = Math.floor(
                      (new Date().getTime() - new Date(installment.dueDate).getTime()) / 
                      (1000 * 3600 * 24)
                    );
                    
                    return (
                      <tr key={installment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          {new Date(installment.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          Member {installment.memberId.substring(0, 4)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium">
                          {formatCurrency(installment.amount)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-loan-danger font-medium">
                            {daysOverdue} days
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No overdue installments</p>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
