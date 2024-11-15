"use client";
import React, { useActionState, useState } from "react";
import Button from "./button";
import { Input, SearchField } from "./input";
import Pagination from "./pagination";
import { FaChevronDown } from "react-icons/fa6";
import { CircleX } from "lucide-react";
import Modal from "./modal";
import { createClass, CreateClassFormState } from "@/app/lib/action";

export default function CoursesComponent(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isSelectingSubject, setIsSelectingSubject] = useState<boolean>(false);
  const [subjectForCreateClass, setSubjectForCreateClass] =
    useState<string>("");
  const subjects: string[] = ["Toán", "Lý", "Hóa", "Sinh", "Văn", "Anh"];
  const initialState: CreateClassFormState = { message: null, errors: {} };
  const [state, action, isPending] = useActionState(createClass, initialState);
  const sampleClasses = [
    {
      ID: 1,
      MaLop: "T1",
      TenLop: "Toán 1",
      SiSo: 30,
      NgayBatDau: "2024-01-10",
      NgayKetThuc: "2024-05-20",
    },
    {
      ID: 2,
      MaLop: "TC1",
      TenLop: "Toán Chuyên 1",
      SiSo: 25,
      NgayBatDau: "2024-02-01",
      NgayKetThuc: "2024-06-15",
    },
    {
      ID: 3,
      MaLop: "L1",
      TenLop: "Lý 1",
      SiSo: 28,
      NgayBatDau: "2024-01-15",
      NgayKetThuc: "2024-05-30",
    },
    {
      ID: 4,
      MaLop: "LC1",
      TenLop: "Lý Chuyên 1",
      SiSo: 20,
      NgayBatDau: "2024-03-01",
      NgayKetThuc: "2024-07-10",
    },
    {
      ID: 5,
      MaLop: "H1",
      TenLop: "Hóa 1",
      SiSo: 32,
      NgayBatDau: "2024-01-20",
      NgayKetThuc: "2024-06-25",
    },
  ];

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight my-4">
        Quản lý lớp học
      </h2>

      <div className="relative flex items-center justify-between mt-6 mr-6">
        <div className="flex gap-3 items-center space-x-4 w-full md:w-96 lg:w-[30rem]">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="ml-4 border-2 bg-sky-100 border-gray-300 rounded-full px-6 py-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all">
            <option value="">Tất cả các khối</option>
            <option value="">Khối 10</option>
            <option value="">Khối 11</option>
            <option value="">Khối 12</option>
          </select>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="ml-4 border-2 bg-sky-100 border-gray-300 rounded-full px-6 py-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all">
            <option value="">Tất cả các môn</option>
            <option value="">Toán</option>
            <option value="">Lý</option>
            <option value="">Hóa</option>
            <option value="">Văn</option>
            <option value="">Anh</option>
            <option value="">Sinh</option>
          </select>
          <SearchField
            className="w-[200px]"
            placeholder="Tìm theo tên lớp..."
          />
        </div>

        <Button
          onClick={() => {
            setIsOpenModal(true);
          }}
          type="button"
          className="pl-6 pr-6">
          Thêm lớp học
        </Button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto mt-6 mr-6">
        <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                ID
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center ">
                Mã lớp
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center w-[150px]">
                Tên lớp
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Sỉ số
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Ngày bắt đầu
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Ngày kết thúc
              </th>
            </tr>
          </thead>
          <tbody>
            {sampleClasses.map((c, i) => (
              <tr
                key={i}
                className="hover:bg-gray-50 transition-all duration-200">
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {c.ID}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {c.MaLop}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 ">{c.TenLop}</td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {c.SiSo}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {c.NgayBatDau}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {c.NgayKetThuc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination className="flex justify-end mt-5" totalPages={3} />
      </div>
      <Modal
        modalName="ModalCreateClass"
        isOpen={isOpenModal}
        className="h-fit pb-6">
        <div className="flex flex-col relative">
          <CircleX
            onClick={() => {
              setIsOpenModal(false);
            }}
            className="absolute top-4 right-6 bg-clip-padding w-[8%] h-auto opacity-50 hover:opacity-100 transition duration-200 bg-white cursor-pointer"
          />
          <h1 className="mx-auto mt-5 font-bold text-2xl text-gray-700">
            Tạo lớp học
          </h1>
          <form
            action={action}
            className=" mx-6 mt-10 flex flex-col gap-2 md:gap-5">
            <Input
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Tên lớp"
              name="className"></Input>

            <Input
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Giáo viên"
              name="teacher"
            />
            <button
              type="button"
              onClick={() => {
                setIsSelectingSubject(true);
              }}
              className="w-[25%] flex justify-between items-center text-sm border-gray-400 border-2 px-2.5 py-1.5 rounded-lg bg-white hover:bg-gray-200 transition-colors">
              {subjectForCreateClass === "" ? (
                <span>Môn học</span>
              ) : (
                <span className="font-bold">{subjectForCreateClass}</span>
              )}
              <FaChevronDown />
              <input
                type="text"
                name="subject"
                value={subjectForCreateClass}
                readOnly
                className="hidden"
              />
            </button>

            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </div>
              <input
                type="date"
                id="default-datepicker"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                placeholder="Select date"
              />
            </div>

            <Input
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Mô tả"
              name="description"
            />
            <Input
              type="number"
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Học phí"
              name="fee"
            />
            <Button isPending={isPending} type="submit" className="mt-5">
              {isPending ? "Đang tạo..." : "Tạo lớp học"}
            </Button>
          </form>
        </div>
      </Modal>
      <Modal
        onClose={() => {
          setIsSelectingSubject(false);
        }}
        modalName="ModalSelectSubject"
        isOpen={isSelectingSubject}
        className="w-[25vw] py-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 text-center">
            Chọn môn học
          </h1>
          <div className="grid grid-cols-3 gap-2 mx-8 mt-4">
            {subjects.map((s, i) => (
              <div
                onClick={() => {
                  setSubjectForCreateClass(s);
                  setIsSelectingSubject(false);
                }}
                key={i}
                className="font-bold border-2 rounded-lg border-sky-500 py-1 text-sm  text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer">
                {s}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
