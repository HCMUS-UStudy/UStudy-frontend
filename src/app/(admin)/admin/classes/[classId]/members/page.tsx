"use client";

import AddMember from "@/app/ui/components/admin/classes/addMember/AddMember";
import { getListMembers } from "@/app/lib/services/class";
import { useState, useEffect } from "react";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Loading from "@/app/ui/components/_common/loading/Loading";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/ui/components/_common/Table";
import { useParams } from "next/navigation";
import Pagination from "@/app/ui/components/_common/Pagination";

const MemberPage = () => {
  const searchParams = useSearchParams();
  const { classId } = useParams();

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const memberQuery = useQuery(
    {
      queryKey: ["ListMembers", currentPage],
      refetchOnWindowFocus: false,
      queryFn: () =>
        getListMembers(
          classId,
          searchParams.get("AccountName") ?? "",
          currentPage,
          12,
        ),
    },
    // {
    //   queryKey: ["ListTeachers"],
    //   refetchOnWindowFocus: false,
    //   queryFn: () =>
    //     getListMembers(
    //       classId,
    //       searchParams.get("AccountName") ?? "",
    //       0,
    //       20,
    //       "TEACHER",
    //     ),
    // },
    // {
    //   queryKey: ["ListStudents", currentStudentPage],
    //   refetchOnWindowFocus: false,
    //   queryFn: () =>
    //     getListMembers(
    //       classId,
    //       searchParams.get("AccountName") ?? "",
    //       currentStudentPage,
    //       8,
    //       "STUDENT",
    //     ),
    // },
  );

  const members = memberQuery.data;
  const isLoading = memberQuery.isLoading;

  // const [adminQuery, teacherQuery, studentQuery] = results;
  // const adminList = adminQuery.data?.content ?? [];
  // const teacherList = teacherQuery.data?.content ?? [];
  // const studentList = studentQuery.data?.content ?? [];
  // const isLoading = results.some((item) => item.status === "pending");

  // const adminListWithRole = adminList.map((member) => ({
  //   ...member,
  //   role: "Giáo vụ",
  // }));

  // const teacherListWithRole = teacherList.map((member) => ({
  //   ...member,
  //   role: "Giáo viên",
  // }));
  // const studentListWithRole = studentList.map((member) => ({
  //   ...member,
  //   role: "Học sinh",
  // }));

  const memberListWithRole = members?.content?.map((member) => ({
    ...member,
    role: member.genId.startsWith("0")
      ? "Giáo vụ"
      : member.genId.startsWith("1")
        ? "Giáo viên"
        : "Học sinh",
  }));

  useEffect(() => {
    if (members) {
      setTotalPages(members.totalPages);
    }
  }, [members]);

  // if (isLoading) {
  //   return (
  //     <div className="flex flex-col mt-10">
  //       <Loading />
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col gap-5 px-4 mt-4">
      <div className="flex justify-between gap-10">
        <div className="flex w-1/3">
          <SearchField
            queryKey="AccountName"
            placeholder="Tìm tên thành viên..."
          />
        </div>
        <AddMember buttonLabel="Thêm thành viên" />
      </div>

      {isLoading ? (
        <div className="mt-5">
          <Loading />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader
              columns={[
                "GenId",
                "Tên",
                "Email",
                "Địa chỉ",
                "Ngày sinh",
                "Giới tính",
                "Vai trò",
              ]}
            />
            <TableBody noDataMessage={false}>
              {/* {currentStudentPage === 0 &&
            [...adminListWithRole, ...teacherListWithRole].map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.genId}</TableCell>
                <TableCell>
                  {member.name.length > 18 ? (
                    <button>
                      <Tooltip text={member.name}>
                        {member.name.slice(0, 18)}...
                      </Tooltip>
                    </button>
                  ) : (
                    member.name
                  )}
                </TableCell>
                <TableCell>
                  {member.email?.length > 25 ? (
                    <button>
                      <Tooltip text={member.email}>
                        {member.email.slice(0, 25)}...
                      </Tooltip>
                    </button>
                  ) : (
                    member.email
                  )}
                </TableCell>
                <TableCell>
                  {member.address.length > 30 ? (
                    <button>
                      <Tooltip text={member.address}>
                        {member.address.slice(0, 30)}...
                      </Tooltip>
                    </button>
                  ) : (
                    member.address
                  )}
                </TableCell>
                <TableCell>
                  {new Date(member.birthday).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>{member.gender === "MALE" ? "Nam" : "Nữ"}</TableCell>
                <TableCell>{member.role}</TableCell>
              </TableRow>
            ))} */}
              {memberListWithRole?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.genId}</TableCell>
                  <TableCell>
                    {member.name.length > 18 ? (
                      <button>
                        <Tooltip text={member.name}>
                          {member.name.slice(0, 18)}...
                        </Tooltip>
                      </button>
                    ) : (
                      member.name
                    )}
                  </TableCell>
                  <TableCell>
                    {member.email?.length > 25 ? (
                      <button>
                        <Tooltip text={member.email}>
                          {member.email.slice(0, 25)}...
                        </Tooltip>
                      </button>
                    ) : (
                      member.email
                    )}
                  </TableCell>
                  <TableCell>
                    {member.address.length > 30 ? (
                      <button>
                        <Tooltip text={member.address}>
                          {member.address.slice(0, 30)}...
                        </Tooltip>
                      </button>
                    ) : (
                      member.address
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(member.birthday).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {member.gender === "MALE" ? "Nam" : "Nữ"}
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-2">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage + 1}
                totalPages={totalPages}
                handlePageClick={(page) => setCurrentPage(page - 1)}
                handlePreviousPage={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 0))
                }
                handleNextPage={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MemberPage;
