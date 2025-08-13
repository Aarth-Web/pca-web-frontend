import React from "react";

// Define the props for the responsive table component
interface ResponsiveTableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

/**
 * A responsive table component that looks good on both desktop and mobile screens
 */
const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  headers,
  children,
  className = "",
}) => {
  return (
    <div className={`overflow-hidden shadow sm:rounded-lg ${className}`}>
      {/* Desktop version */}
      <div className="hidden sm:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    index === headers.length - 1 ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {children}
          </tbody>
        </table>
      </div>

      {/* Mobile version (cards) */}
      <div className="sm:hidden">
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  );
};

export default ResponsiveTable;
