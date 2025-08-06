import React, { useState, useEffect } from "react";
import { getCollectionSummary, formatCurrency, getOverdueInstallments, getPendingInstallments } from "../utils/dataUtils";
import Layout from "../components/layout/Layout";
import StatCard from "../components/ui/StatCard";
import { Coins, Users, Calendar, FileText } from "lucide-react";
import { Card } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../components/ui/StatusBadge";
import { CollectionSummary, Installment } from "@/types/index";

const Dashboard = () => {
  const [summary, setSummary] = useState<CollectionSummary>({
    totalLoans: 0,
    activeLoans: 0,
    completedLoans: 0,
    defaultedLoans: 0,
    totalAmount: 0,
    totalCollected: 0,
    pendingAmount: 0
  });
  const [overdueInstallments, setOverdueInstallments] = useState<Installment[]>([]);
  const [pendingInstallments, setPendingInstallments] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const summaryData = await getCollectionSummary();
        setSummary(summaryData);
        
        const overdueData = await getOverdueInstallments();
        setOverdueInstallments(overdueData);
        
        const pendingData = await getPendingInstallments();
        setPendingInstallments(pendingData.slice(0, 5)); // Get only 5 for display
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const collectionProgress = summary.totalAmount > 0 
    ? (summary.totalCollected / summary.totalAmount) * 100
    : 0;
  
  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="text-center py-10">
          <p>Loading dashboard data...</p>
        </div>
      </Layout>
    );
  }
  
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
          
          {pendingInstallments.length > 0 ? (
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
                        {installment.dueDateStr || new Date(installment.dueDate).toLocaleDateString()}
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
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No pending installments</p>
            </div>
          )}
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
                    const dueDate = new Date(installment.dueDate);
                    
                    const daysOverdue = Math.floor(
                      (new Date().getTime() - dueDate.getTime()) / 
                      (1000 * 3600 * 24)
                    );
                    
                    return (
                      <tr key={installment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          {installment.dueDateStr || new Date(installment.dueDate).toLocaleDateString()}
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