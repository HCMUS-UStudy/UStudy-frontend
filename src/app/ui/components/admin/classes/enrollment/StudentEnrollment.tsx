"use client";
import { ApproveResponse, MemberItem, RegisterClassItem } from "@/app/types";
import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../_common/Table";
import { Button } from "../../../_common/Button";
import { FaCheck, FaPlus } from "react-icons/fa6";
import { addMembers, getListMembers } from "@/app/lib/services/class";
import { toast } from "react-toastify";
import Loading from "../../../_common/loading/Loading";
import { getStuClassRegister } from "@/app/lib/services/register";

// const DummyRegisterStudents = [
//   {
//     id: "1",
//     name: "Nguyễn Văn A",
//     email: "nguyenvana@example.com",
//     gender: "MALE",
//   },
//   {
//     id: "2",
//     name: "Trần Thị B",
//     email: "tranthib@example.com",
//     gender: "FEMALE",
//   },
//   {
//     id: "3",
//     name: "Lê Văn C",
//     email: "levanc@example.com",
//     gender: "MALE",
//   },
//   {
//     id: "4",
//     name: "Phạm Thị D",
//     email: "phamthid@example.com",
//     gender: "FEMALE",
//   },
//   {
//     id: "5",
//     name: "Đỗ Minh E",
//     email: "dominhe@example.com",
//     gender: "OTHER",
//   },
// ];

// const DummyClassStudents = [
//   {
//     id: "101",
//     name: "Mai Anh",
//     email: "maianh@example.com",
//     gender: "FEMALE",
//   },
//   {
//     id: "102",
//     name: "Vũ Hữu Bình",
//     email: "vuhuubinh@example.com",
//     gender: "MALE",
//   },
//   {
//     id: "103",
//     name: "Hoàng Quốc Cường",
//     email: "hoangcuong@example.com",
//     gender: "MALE",
//   },
//   {
//     id: "104",
//     name: "Ngô Thảo Linh",
//     email: "ngothaolinh@example.com",
//     gender: "FEMALE",
//   },
//   {
//     id: "105",
//     name: "Trịnh Minh Khôi",
//     email: "trinhminhkhoi@example.com",
//     gender: "OTHER",
//   },
// ];

export default function StudentEnrollment({ classId }: { classId: string }) {
  const [multiSelect, setMultiSelect] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(false);
  const [registerStudents, setRegisterStudents] = useState<RegisterClassItem[]>(
    [],
  );
  const [classStudents, setClassStudents] = useState<MemberItem[]>([]);
  const handleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchRegisterStudents, fetchClassStudents] = await Promise.all([
        getStuClassRegister(classId, 0, 5),
        getListMembers(classId, "", 0, 5, "STUDENT"),
      ]);
      setRegisterStudents(fetchRegisterStudents.content);
      setClassStudents(fetchClassStudents.content);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [classId]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    if (selectAll) {
      setSelectedIds(registerStudents.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  }, [selectAll, registerStudents]);
  useEffect(() => {
    if (selectedIds.length === registerStudents.length) {
      setSelectAll(true);
    }
  }, [selectedIds, registerStudents]);
  const handleApprove = async (singleId?: string) => {
    try {
      setLoading(true);
      const response: ApproveResponse = await addMembers(
        singleId ? [singleId] : selectedIds,
        classId,
        "STUDENT",
      );
      if (response.failedCount > 0) {
        const failedMembers = response.failedMembers
          .map((member) => `ID: ${member.genId} - ${member.name}`)
          .join("\n");
        toast.error(`Duyệt không thành công: \n${failedMembers}`, {
          position: "bottom-right",
          autoClose: 5000,
          pauseOnHover: true,
        });
      } else {
        toast.success("Duyệt thành công", {
          position: "bottom-right",
          autoClose: 3000,
          pauseOnHover: false,
        });
      }
      setTrigger((prev) => !prev);
    } catch (error) {
      console.log(error);
      toast.error("Thêm không thành công", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [trigger, fetchData]);
  return (
    <div>
      {loading && (
        <div className="absolute h-[62vh] inset-0 flex justify-center items-center bg-black/10 z-20">
          <div className="flex flex-col gap-2">
            <Loading customStyle={{ spinner: "h-16 w-16" }} />
            <div className="text-primary-darker text-lg font-bold">
              Đang tải
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between gap-3 h-10">
            <div className="flex items-center gap-3">
              <div className="text-left font-bold">Danh sách chờ</div>
              {registerStudents.length !== 0 && (
                <Button
                  className="text-sm"
                  onClick={() => setMultiSelect((prev) => !prev)}
                >
                  {multiSelect ? "Chọn đơn lẻ" : "Chọn nhiều"}
                </Button>
              )}
            </div>
            <div className="flex gap-3 text-sm">
              <Button
                className={`transition-all ${multiSelect ? "opacity-100" : "opacity-0"}`}
                onClick={() => setSelectAll((prev) => !prev)}
              >
                Chọn tất cả {selectAll && <FaCheck className="ml-2" />}
              </Button>
              <Button
                className={`transition-all ${multiSelect ? "opacity-100" : "opacity-0"}`}
                onClick={() => handleApprove()}
              >
                Duyệt vào lớp
              </Button>
            </div>
          </div>
          {registerStudents.length !== 0 ? (
            <Table>
              <TableHeader
                columns={["Tên", "Email", "Giới tính", "Hành động"]}
              />
              <TableBody>
                {registerStudents.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>
                      {item.gender === "MALE"
                        ? "Nam"
                        : item.gender === "FEMALE"
                          ? "Nữ"
                          : "Khác"}
                    </TableCell>
                    {multiSelect ? (
                      <TableCell className="flex justify-center">
                        <label className="relative w-5 h-5 border-2 rounded border-primary-darker flex items-center justify-center hover:cursor-pointer hover:bg-primary">
                          <input
                            className="hidden peer"
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => handleSelection(item.id)}
                          />
                          <FaCheck className="absolute size-3 text-primary-darkest opacity-0 peer-checked:opacity-100 transition-all" />
                        </label>
                      </TableCell>
                    ) : (
                      <TableCell>
                        <FaPlus
                          onClick={() => handleApprove(item.id)}
                          className="w-full size-5 text-primary-dark hover:text-primary-darkest hover:cursor-pointer transition-colors"
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex justify-center items-center bg-primary-lighter h-72 border-dashed border-2 border-primary-darkest text-base font-bold text-primary-darkest">
              Không có học sinh đang chờ
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center text-left text-base font-bold h-10">
            Danh sách lớp
          </div>
          {classStudents.length !== 0 ? (
            <Table>
              <TableHeader columns={["Tên", "Email", "Giới tính"]} />
              <TableBody>
                {classStudents.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>
                      {item.gender === "MALE"
                        ? "Nam"
                        : item.gender === "FEMALE"
                          ? "Nữ"
                          : "Khác"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex justify-center items-center bg-primary-lighter h-72 border-dashed border-2 border-primary-darkest text-base font-bold text-primary-darkest">
              Lớp hiện không có học sinh
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
