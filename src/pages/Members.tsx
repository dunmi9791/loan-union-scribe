
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { getAllMembers, formatCurrency, getMemberLoans, getMemberUnion } from "@/utils/dataUtils";
import StatusBadge from "@/components/ui/StatusBadge";
import { useNavigate } from "react-router-dom";

const Members = () => {
  const members = getAllMembers();
  const navigate = useNavigate();
  
  const getMemberLoanCount = (memberId: string) => {
    return getMemberLoans(memberId).length;
  };

  return (
    <Layout title="Members">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Union Members</h2>
          <button className="px-4 py-2 bg-loan-primary text-white rounded-lg text-sm font-medium hover:bg-loan-secondary transition-colors">
            Register New Member
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Union
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loans
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => {
                const memberUnion = getMemberUnion(member.id);
                return (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-loan-accent flex items-center justify-center">
                          <span className="font-medium text-loan-primary">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{memberUnion?.name}</div>
                      <div className="text-sm text-gray-500">Purse: {formatCurrency(memberUnion?.purse || 0)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.contactNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={member.status} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getMemberLoanCount(member.id)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                      {formatCurrency(member.balance)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button 
                        className="text-loan-primary hover:text-loan-secondary font-medium"
                        onClick={() => navigate(`/members/${member.id}`)}
                      >
                        View
                      </button>
                      <span className="px-2 text-gray-300">|</span>
                      <button className="text-loan-primary hover:text-loan-secondary font-medium">
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{members.length}</span> of{" "}
            <span className="font-medium">{members.length}</span> members
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

export default Members;
