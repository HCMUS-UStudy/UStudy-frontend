"use client";
import { getAllClasses } from "@/app/lib/api";
import { ClassItem } from "@/app/types/type";
import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/ui/components/common/Button";
import Pagination from "@/app/ui/components/common/Pagination";

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

export function ClassesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const [totalPages, setTotalPages] = useState<number>(0);
  // let displays: ClassItem[] = [];
  useEffect(() => {
    const fetchData = async () => {
      let filteredData: ClassItem[] = [];
      setIsLoading(true);
      try {
        const response = await getAllClasses(query, currentPage - 1);
        filteredData = response.content.map((item) => ({
          id: item.id,
          name: item.name,
          course: {
            name: item.course.name,
          },
          room: {
            name: item.room.name,
          },
          fee: item.fee,
          grade: {
            name: item.grade.name,
          },
        }));
        setTotalPages(response.totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setClasses(filteredData);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, query]);
  // console.log(classes);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      currentPage--;
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  const handlePageClick = (page: number) => {
    currentPage = page;
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <Table>
        <TableHeader
          columns={["ID", "Tên lớp", "Môn học", "Khối", "Phòng", "Học phí", ""]}
          className="bg-gray-100"
        />
        <TableBody isLoading={isLoading}>
          {classes.map((c, i) => (
            <TableRow key={i}>
              <TableCell className="w-20">{i + 1}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.course.name}</TableCell>
              <TableCell>{c.grade.name}</TableCell>
              <TableCell>{c.room.name}</TableCell>
              <TableCell>{c.fee} VNĐ</TableCell>
              <TableCell className="p-0 w-32">
                <Button
                  onClick={() =>
                    router.push(`/clerk/classes/${c.id}/classManagement`)
                  }
                  type="button"
                  variant="outlined"
                >
                  Xem lớp
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageClick={(page) => handlePageClick(page)}
        handlePreviousPage={handlePrevClick}
        handleNextPage={handleNextClick}
      />
    </div>
  );
}
