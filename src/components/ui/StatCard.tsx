
import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeType = "neutral",
  className,
}) => {
  return (
    <div className={cn("bg-white p-6 rounded-lg shadow-sm border border-gray-100", className)}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          
          {change && (
            <p className={cn(
              "text-xs font-medium mt-2",
              changeType === "positive" && "text-loan-success",
              changeType === "negative" && "text-loan-danger",
              changeType === "neutral" && "text-gray-500"
            )}>
              {change}
            </p>
          )}
        </div>
        
        {icon && (
          <div className="bg-loan-accent p-3 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
