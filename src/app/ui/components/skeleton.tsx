import React from "react";

export const TableSkeleton = () => {
  const renderRows = () => {
    const rows: React.ReactNode[] = [];
    for (let i = 0; i < 5; i++) {
      rows.push(
        <tr key={i} className="transition-all ">
          <td className="px-3 py-4 text-sm text-gray-700 text-center">
            <div className="bg-slate-300 h-2 rounded-full"></div>
          </td>
          <td className="px-6 py-4 text-sm text-gray-700 text-center">
            {" "}
            <div className="bg-slate-300 h-2 rounded-full"></div>
          </td>
          <td className="px-6 py-4 text-sm text-gray-700 text-center">
            {" "}
            <div className="bg-slate-300 h-2 rounded-full"></div>
          </td>
          <td className="px-6 py-4 text-sm text-gray-700 text-center">
            {" "}
            <div className="bg-slate-300 h-2 rounded-full"></div>
          </td>
          <td className="px-6 py-4 text-sm text-gray-700 text-center">
            {" "}
            <div className="bg-slate-300 h-2 rounded-full"></div>
          </td>
          <td className="px-6 py-4 text-sm text-gray-700 text-center">
            {" "}
            <div className="bg-slate-300 h-2 rounded-full"></div>
          </td>
          <td className="px-6 py-4 text-sm text-gray-700 text-center">
            {" "}
            <div className="bg-slate-300 h-2 rounded-full"></div>
          </td>
        </tr>,
      );
    }
    return rows;
  };
  return (
    <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-lg h-80 max-h-80">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
            ID
          </th>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center w-[150px]">
            Tên lớp
          </th>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
            Phòng
          </th>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
            Ngày bắt đầu
          </th>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
            Ngày kết thúc
          </th>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
            Tên chi nhánh
          </th>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
            Địa chỉ
          </th>
        </tr>
      </thead>
      <tbody className="animate-pulse">
        {/* {classes.content.map((c, i) => {})} */}
        {renderRows()}
      </tbody>
    </table>
  );
};
