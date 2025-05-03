
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { getAllCollectors, formatCurrency } from "@/utils/dataUtils";
import { useNavigate } from "react-router-dom";

const Collectors = () => {
  const collectors = getAllCollectors();
  const navigate = useNavigate();

  return (
    <Layout title="Collectors">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Loan Collectors</h2>
          <button className="px-4 py-2 bg-loan-primary text-white rounded-lg text-sm font-medium hover:bg-loan-secondary transition-colors">
            Add New Collector
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collectors.map((collector) => (
            <div key={collector.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-loan-accent rounded-full flex items-center justify-center text-loan-primary font-bold text-lg">
                      {collector.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">{collector.name}</h3>
                      <p className="text-gray-500 text-sm">{collector.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Contact:</span>
                    <span className="text-gray-900 text-sm font-medium">{collector.contactNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Assigned Members:</span>
                    <span className="text-gray-900 text-sm font-medium">{collector.assignedMembers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Collections Today:</span>
                    <span className="text-gray-900 text-sm font-medium">{collector.collectionsToday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Total Collected:</span>
                    <span className="text-loan-primary text-sm font-medium">{formatCurrency(collector.totalCollected)}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button 
                    className="px-4 py-2 bg-loan-accent text-loan-primary rounded text-sm font-medium hover:bg-loan-primary hover:text-white transition-colors"
                    onClick={() => navigate(`/collectors/${collector.id}`)}
                  >
                    View Details
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                    Assign Members
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Layout>
  );
};

export default Collectors;
