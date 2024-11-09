import React from "react";

export interface ColumnContent {
  colName: string;
  rowContent: string[];
}

export interface TableProps {
  tableName: string;
  colNames: string[];
  content: ColumnContent[];
}

export default function Table({ tableName, colNames, content }: TableProps) {
  return (
    <div className="flex flex-col w-full space-y-4 p-6 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center">
        <p className="text-xl text-gray-950 font-extrabold">{tableName}</p>
      </div>
      <div className="relative overflow-x-auto rounded-md shadow-md">
        <table className="w-full text-sm text-left text-secondary_text bg-sky-50 table-auto divide-y divide-gray-300 ">
          <thead className="text-gray-950">
            <tr className="divide-x divide-gray-300">
              {colNames.map((col, index) => (
                <th key={index} scope="row" className="px-6 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 divide-dashed">
            {content[0].rowContent.map((_, rowIdx) => (
              <tr
                key={rowIdx}
                className="odd:bg-white even:bg-sky-50 divide-x divide-gray-300 divide-dashed">
                {content.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4">
                    {col.rowContent[rowIdx]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
