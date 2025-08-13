import React from "react";

// Define the props for a single data item
interface DataItem {
  label: string;
  value: React.ReactNode;
  isFullWidth?: boolean;
}

interface ResponsiveTableRowProps {
  data: DataItem[];
  mobileView?: React.ReactNode; // Custom mobile layout if needed
  desktopView?: React.ReactNode; // Custom desktop layout if needed
}

/**
 * A responsive table row component that adapts to different screen sizes
 */
const ResponsiveTableRow: React.FC<ResponsiveTableRowProps> = ({
  data,
  mobileView,
  desktopView,
}) => {
  // For desktop view, just return the data as table cells
  if (desktopView) {
    return <>{desktopView}</>;
  }

  const desktopRow = (
    <tr className="hover:bg-gray-50">
      {data.map((item, index) => (
        <td
          key={index}
          className={`px-4 py-2 whitespace-nowrap text-xs ${
            index === data.length - 1 ? "text-right" : ""
          }`}
        >
          {item.value}
        </td>
      ))}
    </tr>
  );

  // For mobile view, create a card-like layout
  if (mobileView) {
    return (
      <>
        <div className="sm:hidden">{mobileView}</div>
        <div className="hidden sm:table-row">{desktopRow}</div>
      </>
    );
  }

  const mobileCard = (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
      {data.map((item, index) => (
        <div
          key={index}
          className={`
            ${
              item.isFullWidth
                ? "my-2"
                : "grid grid-cols-2 gap-1 items-center my-1"
            }
            ${
              index === data.length - 1
                ? "mt-2 pt-2 border-t border-gray-100"
                : ""
            }
          `}
        >
          {!item.isFullWidth && (
            <div className="text-xs font-medium text-gray-500">
              {item.label}:
            </div>
          )}
          <div className={`text-sm ${item.isFullWidth ? "font-medium" : ""}`}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="sm:hidden">{mobileCard}</div>
      <div className="hidden sm:table-row">{desktopRow}</div>
    </>
  );
};

export default ResponsiveTableRow;
