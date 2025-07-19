"use client";
import React, { useEffect, useState } from "react";
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
import { getStuClassRegister } from "@/app/lib/services/register";
import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import Pagination from "../../../_common/Pagination";
import Loading from "../../../_common/loading/Loading";
import { useCustomToast } from "@/app/lib/hooks/useToast";

export default function StudentEnrollment({ classId }: { classId: string }) {
  const [multiSelect, setMultiSelect] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [registerPage, setRegisterPage] = useState<number>(1);
  const [classPage, setClassPage] = useState<number>(1);

  // const [loading, setLoading] = useState<boolean>(false);
  // const [trigger, setTrigger] = useState<boolean>(false);
  // const [registerStudents, setRegisterStudents] = useState<RegisterClassItem[]>(
  //   [],
  // );
  // const [classStudents, setClassStudents] = useState<MemberItem[]>([]);
  const handleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const queryClient = useQueryClient();
  const results = useQueries({
    queries: [
      {
        queryKey: ["RegisterStudents", classId, registerPage - 1],
        queryFn: () => getStuClassRegister(classId, registerPage - 1, 5),
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
      },
      {
        queryKey: ["ClassStudents", classId, classPage - 1, "STUDENT"],
        queryFn: () => getListMembers(classId, "", classPage - 1, 5, "STUDENT"),
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
      },
    ],
  });
  const [registerStudents, classStudents] = results;
  const isLoading = results.some((item) => item.status === "pending");

  useEffect(() => {
    if (selectedIds.length === registerStudents.data?.content.length) {
      setSelectAll(true);
    }
  }, [selectedIds, registerStudents]);

  // const handleApprove = async (singleId?: string) => {
  //   try {
  //     setLoading(true);
  //     const response: ApproveResponse = await addMembers(
  //       singleId ? [singleId] : selectedIds,
  //       classId,
  //       "STUDENT",
  //     );
  //     if (response.failedCount > 0) {
  //       const failedMembers = response.failedMembers
  //         .map((member) => `ID: ${member.genId} - ${member.name}`)
  //         .join("\n");
  //       toast.error(`Duyệt không thành công: \n${failedMembers}`, {
  //         position: "bottom-right",
  //         autoClose: 5000,
  //         pauseOnHover: true,
  //       });
  //     } else {
  //       toast.success("Duyệt thành công", {
  //         position: "bottom-right",
  //         autoClose: 3000,
  //         pauseOnHover: false,
  //       });
  //     }
  //     setTrigger((prev) => !prev);
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Thêm không thành công", {
  //       position: "bottom-right",
  //       autoClose: 3000,
  //       pauseOnHover: false,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchData();
  // }, [trigger, fetchData]);

  const { addToast } = useCustomToast();

  const useApproveMutation = useMutation({
    mutationFn: (singleId?: string) => {
      const ids = singleId ? [singleId] : selectedIds;
      return addMembers(ids, classId, "STUDENT");
    },
    onSuccess: (response) => {
      if (response.data.failedCount > 0) {
        const failedMembers = response.data.failedMembers
          .map((member) => `ID: ${member.genId} - ${member.name}`)
          .join("\n");
        addToast.error(`Duyệt không thành công: \n${failedMembers}`);
      } else {
        addToast.success("Duyệt thành công");
      }
      queryClient.invalidateQueries({ queryKey: ["RegisterStudents"] });
      queryClient.invalidateQueries({ queryKey: ["ClassStudents"] });
    },
    onError: () => {
      addToast.error("Thêm không thành công");
    },
  });

  const handleApprove = async (singleId?: string) => {
    useApproveMutation.mutate(singleId);
  };
  return (
    <div className="">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between gap-3 h-10">
            <div className="flex items-center gap-3">
              <div className="text-left font-bold">Danh sách chờ</div>
              {registerStudents.data?.content.length !== 0 && (
                <Button
                  className="text-sm"
                  onClick={() => setMultiSelect((prev) => !prev)}
                >
                  {multiSelect ? "Chọn đơn lẻ" : "Chọn nhiều"}
                </Button>
              )}
              {registerStudents.isFetching && <Loading className="size-6" />}
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

          <Table>
            <TableHeader columns={["Tên", "Email", "Giới tính", "Hành động"]} />
            <TableBody isLoading={isLoading}>
              {registerStudents.data?.content.map((item) => (
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
          <Pagination
            currentPage={registerPage}
            totalPages={registerStudents.data?.totalPages || 1}
            handlePageClick={(page) => setRegisterPage(page)}
            handlePreviousPage={() =>
              setRegisterPage((page) => (page > 1 ? page-- : page))
            }
            handleNextPage={() =>
              setRegisterPage((page) => {
                if (registerStudents.data?.totalPages) {
                  return page < registerStudents.data.totalPages
                    ? page++
                    : page;
                }
                return page;
              })
            }
          />
        </div>
        <div>
          <div className="flex items-center gap-3 text-left text-base font-bold h-10">
            <div>Danh sách lớp</div>
            {classStudents.isFetching && <Loading className="size-6" />}
          </div>
          <Table>
            <TableHeader columns={["Tên", "Email", "Giới tính"]} />
            <TableBody isLoading={isLoading}>
              {classStudents.data?.content.map((item) => (
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
          <Pagination
            currentPage={classPage}
            totalPages={classStudents.data?.totalPages || 1}
            handlePageClick={(page) => setClassPage(page)}
            handlePreviousPage={() =>
              setClassPage((page) => (page > 1 ? page-- : page))
            }
            handleNextPage={() =>
              setClassPage((page) => {
                if (classStudents.data?.totalPages) {
                  return page < classStudents.data.totalPages ? page++ : page;
                }
                return page;
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
