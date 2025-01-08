"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { cn } from "@/app/lib/utils";

// custom table
interface TableContextProps {
  columns: string[];
  setColumns: (columns: string[]) => void;
}

const TableContext = createContext<TableContextProps | undefined>(undefined);

const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};

interface TableProviderProps {
  children: React.ReactNode;
}

const TableProvider: React.FC<TableProviderProps> = ({ children }) => {
  const [columns, setColumns] = useState<string[]>([]);

  return (
    <TableContext.Provider value={{ columns, setColumns }}>
      {children}
    </TableContext.Provider>
  );
};

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Table component
 * @param children - TableHeader and TableBody
 * @param className - string - custom style for table
 */
export const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <TableProvider>
      <table
        className={cn(
          "min-w-full table-auto border-collapse bg-white rounded-lg shadow-md",
          className,
        )}
      >
        {children}
      </table>
    </TableProvider>
  );
};

interface TableHeaderProps {
  columns: string[];
  className?: string;
}

/**
 * TableHeader component
 * @param columns - array of column names
 * @param className
 */
export const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  className,
}) => {
  const { setColumns } = useTableContext();
  useEffect(() => {
    setColumns(columns);
  }, [columns, setColumns]);

  return (
    <thead className={className}>
      <tr className="border-b-2 border-slate-200">
        {columns.map((col, index) => (
          <th key={index} className="py-3">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
};

interface TableBodyProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

/**
 * TableBody component
 * @param children - TableRow
 * @param isLoading - boolean default false, if true, show loading animation
 */
export const TableBody: React.FC<TableBodyProps> = ({
  children,
  isLoading = false,
}) => {
  const { columns } = useTableContext();

  if (isLoading) {
    return (
      <tbody className="animate-pulse z-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i} className="hover:bg-transparent">
            {columns.map((_, index) => (
              <TableCell key={index}>
                <div className="bg-slate-300 h-2 rounded-full"></div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </tbody>
    );
  }

  return <tbody>{children}</tbody>;
};

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * TableRow component
 * @param children - TableCell
 * @param className
 */
export const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return (
    <tr
      className={cn(
        "hover:bg-blue-50 transition-all duration-200 border-b-2 border-slate-100",
        className,
      )}
    >
      {children}
    </tr>
  );
};

interface TableCellProps extends React.HTMLProps<HTMLTableCellElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * TableCell component
 * @param children - content of cell
 * @param className - string
 * @param props - HTMLTableCellElement props
 */
export const TableCell: React.FC<TableCellProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <td className={cn("px-2 py-3 text-sm text-center", className)} {...props}>
      {children}
    </td>
  );
};
