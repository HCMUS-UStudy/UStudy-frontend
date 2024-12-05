import React from "react";
import ModalAccount from "@/app/ui/components/modalAccount-Ad";
import UserTable from "@/app/ui/components/accountTable";
import AccountRegisterModal from "@/app/ui/components/accountRegister";
import { SearchField } from "@/app/ui/components/input";

export default async function AccountPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  // const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log("Search")
  // };

  // const handleSearchSubmit = () => {
  //   console.log("Search query submitted:", searchQuery);
  // };

  // const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   console.log("Selected filter:", event.target.value);
  // }

  return (
    <>
      <div className="h-screen">
        <h2 className="text-3xl font-bold tracking-tight my-4">
          Quản lý tài khoản người dùng
        </h2>
        <h2 className="text-xl tracking-tight mb-6">
          Tìm tất cả người dùng của nền tảng tại đây
        </h2>

        <div className="flex items-center justify-between mt-8 mr-6">
          <h2 className="text-2xl font-bold">Tổng số người dùng ({100})</h2>
          {/* <form
          onSubmit={handleSearchSubmit}
          className="flex items-center space-x-4 w-full md:w-96 lg:w-[30rem]">
          <div className="flex items-center w-full border-2 border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-l-full focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition ease-in-out"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r-full bg-white text-black hover:bg-slate-100 focus:ring-2 focus:ring-blue-300">
              <FaSearch className="h-5 w-5" />
            </button>
          </div>
          <select
            onChange={handleFilterChange}
            className="ml-4 border-2 border-gray-300 rounded-full px-4 py-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all">
            <option value="">Lọc</option>
            <option value="student">Học viên</option>
            <option value="parents">Phụ huynh</option>
            <option value="teacher">Giáo viên</option>
            <option value="staff">Giáo vụ</option>
          </select>
        </form> */}
        </div>

        <div className="flex justify-between items-center space-x-4 mt-6">
          <SearchField className="w-[200px]" placeholder="Tìm theo tên người dùng..." />
          <div className="flex items-center space-x-4 pr-6">
            <AccountRegisterModal buttonLabel="Duyệt đăng ký" />
            <ModalAccount buttonLabel="Tạo người dùng" />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto mt-6 max-h-[400px] mr-6">
          <UserTable searchQuery={query} />
        </div>
      </div>

    </>
  );
};