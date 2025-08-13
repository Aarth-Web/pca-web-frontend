import React from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: "blue" | "green" | "red" | "yellow" | "orange" | "indigo";
  isMonetary?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  isMonetary = false,
}) => {
  const colorVariants = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    orange: "bg-orange-100 text-orange-800",
    indigo: "bg-indigo-100 text-indigo-800",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-3 md:p-5">
        <div className="flex items-center">
          <div className={`rounded-full p-2 ${colorVariants[color]}`}>
            {icon}
          </div>
          <div className="ml-3">
            <h3 className="text-xs md:text-sm font-medium text-gray-500">
              {title}
            </h3>
            <div className="font-bold text-lg md:text-xl text-gray-900 mt-1">
              {value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
