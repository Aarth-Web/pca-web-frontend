import React from "react";

interface TableProps {
  headers: string[];
  data: (string | number)[][];
  renderRowActions?: (item: any) => React.ReactNode;
  rawData?: any[];
}

const Table: React.FC<TableProps> = ({
  headers,
  data,
  renderRowActions,
  rawData,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="text-left py-3 px-4 uppercase font-semibold text-sm"
              >
                {header}
              </th>
            ))}
            {renderRowActions && (
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="text-left py-3 px-4">
                  {cell}
                </td>
              ))}
              {renderRowActions && rawData && (
                <td className="text-left py-3 px-4">
                  {renderRowActions(rawData[rowIndex])}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
