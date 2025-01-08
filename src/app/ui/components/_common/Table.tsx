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
 *
 * @param children - TableHeader and TableBody
 * @param className - string - custom style for table
 *
 * @example
 * ```tsx
 * <Table>
 *   <TableHeader columns={["Column 1", "Column 2"]} />
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>Row 1, Cell 1</TableCell>
 *       <TableCell>Row 1, Cell 2</TableCell>
 *     </TableRow>
 *     <TableRow>
 *       <TableCell>Row 2, Cell 1</TableCell>
 *       <TableCell>Row 2, Cell 2</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 */
export const Table: React.FC<TableProps> = ({
  children,
  className,
}: TableProps) => {
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
 *
 * @param columns - array of column names
 * @param className - custom style for table header
 *
 * @example
 * ```tsx
 * <TableHeader columns={["Column 1", "Column 2"]} />
 * ```
 */
export const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  className,
}: TableHeaderProps) => {
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
 *
 * @param children - TableRow
 * @param isLoading - boolean default false, if true, show loading animation
 *
 * @example - without loading
 * ```tsx
 * <TableBody>
 *   <TableRow>
 *     <TableCell>Row 1, Cell 1</TableCell>
 *     <TableCell>Row 1, Cell 2</TableCell>
 *   </TableRow>
 *  </TableBody>
 *  ```
 *  @example - with loading
 *  ```tsx
 *  const [isLoading, setIsLoading] = useState(true);
 *  <TableBody isLoading={isLoading}>
 *    <TableRow>
 *      <TableCell>Row 1, Cell 1</TableCell>
 *      <TableCell>Row 1, Cell 2</TableCell>
 *    </TableRow>
 *  </TableBody>
 *  ```
 */
export const TableBody: React.FC<TableBodyProps> = ({
  children,
  isLoading = false,
}: TableBodyProps) => {
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
 *
 * @param children - TableCell
 * @param className - Custom style for table row
 *
 * @example
 * ```tsx
 * <TableRow>
 *   <TableCell>Row 1, Cell 1</TableCell>
 *   <TableCell>Row 1, Cell 2</TableCell>
 * </TableRow>
 * ```
 */
export const TableRow: React.FC<TableRowProps> = ({
  children,
  className,
}: TableRowProps) => {
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
 *
 * @param children - content of cell
 * @param className - custom style for table cell
 * @param props - HTMLTableCellElement props
 *
 * @example
 * ```tsx
 * <TableCell>Row 1, Cell 1</TableCell>
 * ```
 */
export const TableCell: React.FC<TableCellProps> = ({
  children,
  className,
  ...props
}: TableCellProps) => {
  return (
    <td className={cn("px-2 py-3 text-sm text-center", className)} {...props}>
      {children}
    </td>
  );
};
