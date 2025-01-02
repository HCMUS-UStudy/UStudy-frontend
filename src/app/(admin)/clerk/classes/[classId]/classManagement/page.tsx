"use client";
import React, { useEffect, useState } from "react";
import Collapsible from "@/app/ui/components/Collapsible";
import {
  addTeacherToClass,
  getAvailableTeacher,
  getClassById,
  getListChapter,
} from "@/app/lib/api";
import { AllChapter, Classroom, Teacher } from "@/app/types/type";
import { useSpecificNameContext } from "@/app/context/context";
import { IoFileTrayFull, IoWarning } from "react-icons/io5";
import { FaClipboard, FaUserPlus, FaX } from "react-icons/fa6";
import Modal from "@/app/ui/components/modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { revalidatePath } from "next/cache";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/common/Table";

export default function ClassManagement({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = React.use(params);
  const [classData, setClassData] = useState<Classroom | null>(null);
  const { setSpecificName } = useSpecificNameContext();
  const [listChapters, setListChapters] = useState<AllChapter[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<Teacher[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [curr, setCurr] = useState<number>(0);
  const [emptyPage, setEmptyPage] = useState<boolean>(false);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const fetchClass = await getClassById(classId);
        // const fetchTeachers = await getAvailableTeacher(classId);
        setIsLoading(true);
        const [fetchClass, fetchTeachers] = await Promise.all([
          getClassById(classId),
          getAvailableTeacher(classId),
        ]);
        setClassData(fetchClass.data);
        setAvailableTeachers(fetchTeachers.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [classId]);

  useEffect(() => {
    const fetchListChapters = async () => {
      try {
        if (classData?.course.id && classData.grade.id) {
          const response = await getListChapter(
            classData?.course.id,
            classData?.grade.id,
            0,
            10,
          );
          setListChapters(response.data.content);
          //   console.log(response.data.content);
        }
        return;
      } catch (error) {
        console.log(error);
      }
    };
    if (classData?.name !== undefined) {
      setSpecificName(classData?.name);
      console.log(classData);
    }
    fetchListChapters();
  }, [classData, setSpecificName]);

  const handleAddTeacher = async (teacherId: string) => {
    try {
      setIsLoading(true);
      const response = await addTeacherToClass(classId, teacherId);
      if (response.status === 200) {
        toast.success("Thêm giáo viên thành công", {
          position: "bottom-right",
          autoClose: 3000,
        });
        setOpenModal(false);
        revalidatePath(`/clerk/classes`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Thêm giáo viên thất bại", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Collapsible
        title="Thông tin chung"
        primaryColor="blue-500"
        secondaryColor="bg-white"
        defaultChecked
        maxHeight={null}
        className=" border-2 border-slate-100 rounded"
      >
        <div className="grid grid-cols-3 gap-6 py-4 px-10">
          {isLoading ? (
            <>
              <div className="text-gray-700 col-span-2 animate-pulse">
                <div className="font-bold text-sm flex gap-10">
                  <div className="bg-slate-200 w-2/3 rounded-lg text-transparent">
                    Lớp
                  </div>
                </div>
                <div className="w-full h-0.5 bg-blue-300 mt-2"></div>
                <div className="text-sm mt-2 text-gray-600 flex flex-col gap-2">
                  <div className="bg-slate-200 w-1/2 rounded-lg text-transparent">
                    a
                  </div>
                  <div className="bg-slate-200 w-1/2 rounded-lg text-transparent">
                    Phòng:
                  </div>
                  <div className="bg-slate-200 w-1/2 rounded-lg text-transparent">
                    Chi nhánh:{" "}
                  </div>
                </div>
              </div>
              <div className="animate-pulse">
                <h1 className="font-bold text-sm">Giáo viên đứng lớp</h1>
                <div className="w-full h-0.5 bg-blue-300 mt-2"></div>
                <div className="text-sm mt-2 text-gray-600 flex flex-col gap-2">
                  <div className="bg-slate-200 w-1/2 rounded-lg text-transparent">
                    Giáo viên:{" "}
                  </div>
                  <div className="bg-slate-200 w-1/2 rounded-lg text-transparent">
                    Email liên lạc:{" "}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-gray-700 col-span-2">
                <div></div>
                <div className="font-bold text-base flex gap-10">
                  <div>Lớp {classData?.name}</div>
                  <div>Môn: {classData?.course.name}</div>
                  <div></div>
                </div>
                <div className="w-full h-0.5 bg-blue-300 mt-2"></div>
                <div className="text-base mt-2 text-gray-600">
                  <div>
                    <span className="font-bold">{classData?.grade.name}</span>
                  </div>
                  <div>
                    Phòng:{" "}
                    <span className="font-bold">{classData?.room.name}</span>
                  </div>
                  <div>
                    Chi nhánh:{" "}
                    <span className="font-bold">
                      227 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="font-bold text-base">Giáo viên đứng lớp</h1>
                <div className="w-full h-0.5 bg-blue-300 mt-2"></div>
                {classData?.teacher ? (
                  <div className="text-base mt-2 text-gray-600">
                    <div>
                      Giáo viên:{" "}
                      <span className="font-bold">
                        {classData?.teacher?.name}
                      </span>
                    </div>
                    <div>
                      Email liên lạc:{" "}
                      <span className="font-bold">
                        {classData?.teacher?.email}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setEmptyPage(false);
                      setOpenModal(true);
                    }}
                    className=" relative group overflow-hidden transition-all duration-300 bg-red-50 hover:bg-green-100 hover:border-green-700 hover:cursor-pointer px-4 py-3 border-2 border-red-600 rounded-lg text-red-600 mt-4"
                  >
                    <div className="flex items-center gap-3 absolute -translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[400ms] ease-in-out">
                      <FaUserPlus className="size-8 text-green-700" />
                      <span className="font-bold text-green-700">
                        Thêm giáo viên
                      </span>
                    </div>
                    <div className="flex items-center gap-3 group-hover:translate-y-full group-hover:opacity-0 transition-all duration-[400ms] ease-in-out">
                      <IoWarning className="size-8 animate-wiggle-effect transition-all delay-300" />
                      <span className="font-bold">Chưa có giáo viên</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Collapsible>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="flex items-center gap-2 text-lg font-bold text-gray-700 tracking-wider mt-5 pl-5">
            <IoFileTrayFull className="size-8" /> Tài liệu học tập
          </div>
          <div className="px-2.5 py-2 mt-2 bg-white border-2 border-slate-100 rounded-lg">
            <Table className="shadow-none">
              <TableHeader
                columns={["ID", "Tên chương", "Mô tả", "Trạng thái"]}
              />
              <TableBody>
                {listChapters.map((l, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{l.name}</TableCell>
                    <TableCell>{l.description}</TableCell>
                    <TableCell className="font-bold text-blue-800">
                      Đang được sử dụng
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-gray-700 tracking-wider mt-5 pl-5">
            <FaClipboard className="size-8" /> Tình trạng lớp học
          </div>
          <div className="px-2.5 py-2 mt-2 bg-white border-2 border-slate-100 rounded-lg">
            <Table className="shadow-none">
              <TableHeader columns={["ID", "Mô tả", "Trạng thái"]} />
              <TableBody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i} className="cursor-pointer">
                    <TableCell className="font-bold">12038123</TableCell>
                    <TableCell>Quạt hỏng</TableCell>
                    <TableCell>Chưa xử lý</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <Modal isOpen={openModal} className="max-w-[50vw] w-[40vw] px-7 py-5">
        <div className="flex justify-between items-center px-3">
          <h1 className="font-bold text-lg text-center">Chọn giáo viên</h1>
          <FaX
            onClick={() => {
              setEmptyPage(true);
              setOpenModal(false);
            }}
            className="size-5 text-gray-500 hover:text-gray-800 cursor-pointer hover:scale-125"
          />
        </div>

        {emptyPage ? (
          <></>
        ) : (
          <div className="relative overflow-hidden h-[30vh]">
            <div
              className="w-full h-full flex gap-5 transition-all duration-300 ease-in-out"
              style={{ transform: `translateX(${curr * -100}%)` }}
            >
              <table className="table-auto w-[35vw] max-h-[10vh] shrink-0 bg-white select-none mt-2 ">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="py-2.5">ID</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Giới tính</th>
                  </tr>
                </thead>
                <tbody>
                  {availableTeachers.map((t) => (
                    <tr
                      key={t.genId}
                      onClick={() => {
                        setTeacher(t);
                        setCurr(1);
                      }}
                      className="relative group overflow-hidden text-center cursor-pointer hover:bg-blue-50 "
                    >
                      <td className="font-bold px-2 py-2.5 border-b-2 border-slate-100">
                        {t.genId}
                      </td>
                      <td className=" px-2 py-2.5 border-b-2 border-slate-100">
                        {t.name}
                      </td>
                      <td className=" px-2 py-2.5 border-b-2 border-slate-100">
                        {t.email}
                      </td>
                      <td className=" px-2 py-2.5 border-b-2 border-slate-100">
                        {t.gender === "FEMALE" ? "Nữ" : "Nam"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="w-[35vw] shrink-0 h-full flex flex-col justify-between px-3 py-2">
                <div>
                  <table className="table-auto w-full  bg-white select-none mt-2">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="py-2.5">ID</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Giới tính</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="relative group overflow-hidden text-center cursor-pointer hover:bg-blue-50 ">
                        <td className="font-bold px-2 py-2.5 border-b-2 border-slate-100">
                          {teacher?.genId}
                        </td>
                        <td className=" px-2 py-2.5 border-b-2 border-slate-100">
                          {teacher?.name}
                        </td>
                        <td className=" px-2 py-2.5 border-b-2 border-slate-100">
                          {teacher?.email}
                        </td>
                        <td className=" px-2 py-2.5 border-b-2 border-slate-100">
                          {teacher?.gender === "FEMALE" ? "Nữ" : "Nam"}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-3 ml-5">
                    Xác nhận chọn{" "}
                    <span className="font-bold">{teacher?.name}</span> làm giáo
                    viên ?
                  </div>
                </div>
                <div className="self-end flex gap-3 text-base">
                  <button
                    onClick={() => setCurr(0)}
                    type="button"
                    className="px-2.5 py-2 rounded bg-slate-200 hover:bg-slate-300 transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={() => {
                      if (teacher?.id !== undefined) {
                        handleAddTeacher(teacher.id);
                      } else {
                        toast.error("Thêm giáo viên thất bại", {
                          position: "bottom-right",
                          autoClose: 3000,
                        });
                      }
                    }}
                    type="button"
                    className="text-white rounded px-4 py-2.5 bg-gradient-to-tr from-blue-800 via-blue-600 to-blue-800 bg-[length:100%_175%] bg-[0%_100%] hover:bg-[0%_0%] hover:scale-105 transition-all duration-200"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
      <ToastContainer />
    </>
  );
}
