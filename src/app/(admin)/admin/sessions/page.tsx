"use client";

import { useMemo, useState } from "react";
import { getSession } from "@/app/lib/services/session";
import { Button } from "@/app/ui/components/_common/Button";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import SessionModal from "@/app/ui/components/admin/branches/SessionModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import { useSearchParams } from "next/navigation";
import Tooltip from "@/app/ui/components/_common/Tooltip";

const SessionManagement = () => {
  // const [sessions, setSessions] = useState<Session[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [newSession, setNewSession] = useState({
  //   name: "",
  //   startTime: "",
  //   endTime: "",
  // });

  const sessionFilter = useSearchParams().get("SessionFilter") ?? "";

  const { data: _sessions, status } = useQuery({
    queryKey: ["Sessions", sessionFilter],
    queryFn: () => getSession(sessionFilter),
    placeholderData: keepPreviousData,
  });

  const sessions = useMemo(() => {
    return _sessions
      ?.slice()
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [_sessions]);
  // useEffect(() => {
  //   const fetchSessions = async () => {
  //     try {
  //       const response = await getSession(0, 100);
  //       response.data.sort((a: Session, b: Session) =>
  //         a.startTime.localeCompare(b.startTime),
  //       );
  //       setSessions(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch time:", error);
  //     }
  //   };
  //   fetchSessions();
  // }, []);

  // const handleOpenModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  //   setNewSession({ name: "", startTime: "", endTime: "" }); // Reset form
  // };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setNewSession((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await createSession(newSession);
  //     setSessions((prev) => [...prev, response.data]);
  //     setNewSession({ name: "", startTime: "", endTime: "" });
  //     setIsModalOpen(false);
  //     toast.success("Thêm ca học thành công", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       pauseOnHover: false,
  //       closeOnClick: true,
  //     });
  //   } catch (error) {
  //     console.error("Failed to create session:", error);
  //     toast.error("Thêm ca học thất bại", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       pauseOnHover: false,
  //       closeOnClick: true,
  //     });
  //   }
  // };
  return (
    <>
      <div className="px-2">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-semibold">
            Tổng số ca học ({sessions?.length})
          </div>
          <Button className="" onClick={() => setIsModalOpen(true)}>
            Thêm ca học
          </Button>
        </div>
        <SearchField
          className="w-1/3"
          placeholder="Tìm ca học..."
          queryKey="SessionFilter"
        />
        <div className="overflow-x-auto rounded-lg mt-6">
          {/* <table className="min-w-full table-auto border-collapse rounded-lg">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-8 py-3 text-left text-sm font-semibold text-gray-600">
                  Tên ca học
                </th>
                <th className="px-8 py-3 text-left text-sm font-semibold text-gray-600">
                  Thời gian
                </th>
                <th className="px-8 py-3 text-center text-sm font-semibold text-gray-600">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-b border-gray-200">
                  <td className="px-8 py-4 text-sm text-gray-700">
                    {session.name}
                  </td>
                  <td className="px-8 py-4 text-sm text-gray-700">
                    {session.startTime.slice(0, 5)} -{" "}
                    {session.endTime.slice(0, 5)}
                  </td>
                  <td className="px-8 py-4 flex justify-center items-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FaTrashAlt className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> */}
          <Table>
            <TableHeader
              columns={[
                "Tên ca học",
                "Giờ bắt đầu",
                "Giờ kết thúc",
                "Hành động",
              ]}
            />
            <TableBody isLoading={status === "pending"}>
              {sessions?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.startTime}</TableCell>
                  <TableCell>{item.endTime}</TableCell>
                  <TableCell className="flex gap-2 justify-center">
                    <Tooltip text="Chỉnh sửa ca học">
                      <button className="text-blue-600 hover:text-blue-800 transition-all">
                        <FaEdit className="h-5 w-5" />
                      </button>
                    </Tooltip>
                    <Tooltip text="Xóa ca học">
                      <button className="text-red-600 hover:text-red-800 transition-all">
                        <FaTrashAlt className="h-5 w-5" />
                      </button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {isModalOpen && (
        <SessionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default SessionManagement;
