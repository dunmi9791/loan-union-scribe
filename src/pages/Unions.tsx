
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { getAllUnions, formatCurrency, getUnionMembers, getUnionLeader, getUnionCollectors } from "@/utils/dataUtils";
import StatusBadge from "@/components/ui/StatusBadge";
import { Building2, Users, User, Coins } from "lucide-react";

const Unions = () => {
  const unions = getAllUnions();

  return (
    <Layout title="Unions">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Union Management</h2>
          <button className="px-4 py-2 bg-loan-primary text-white rounded-lg text-sm font-medium hover:bg-loan-secondary transition-colors">
            Create New Union
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unions.map((union) => {
            const members = getUnionMembers(union.id);
            const leader = getUnionLeader(union.id);
            const collectors = getUnionCollectors(union.id);

            return (
              <Card key={union.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-loan-accent rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-loan-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{union.name}</h3>
                      <StatusBadge status={union.status} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Coins className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Purse</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(union.purse)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Members</span>
                    </div>
                    <span className="font-medium">{members.length}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Collectors</span>
                    </div>
                    <span className="font-medium">{collectors.length}</span>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Union Leader:</div>
                    <div className="font-medium text-gray-900">
                      {leader ? leader.name : "Not assigned"}
                    </div>
                    {leader && (
                      <div className="text-sm text-gray-500">{leader.email}</div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    Created: {new Date(union.createdDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                  <button className="text-loan-primary hover:text-loan-secondary font-medium text-sm">
                    View Details
                  </button>
                  <button className="text-loan-primary hover:text-loan-secondary font-medium text-sm">
                    Edit Union
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Unions;
