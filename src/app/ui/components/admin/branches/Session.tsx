"use client";
import { useEffect, useState } from "react";
import { getSession } from "@/app/lib/services/session";
import { Session } from "@/app/types";
import { Button } from "@/app/ui/components/_common/Button";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
// import { createSession } from "@/app/lib/services/session";
// import { toast } from "react-toastify";
import SessionModal from "./SessionModal";
import Tooltip from "../../_common/Tooltip";

const SessionManagement = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [newSession, setNewSession] = useState<Session>({
  //   id: "",
  //   name: "",
  //   startTime: "",
  //   endTime: "",
  // });
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getSession(0, 100);
        response.content.sort((a: Session, b: Session) =>
          a.startTime.localeCompare(b.startTime),
        );
        setSessions(response.content);
      } catch (error) {
        console.error("Failed to fetch time:", error);
      }
    };
    fetchSessions();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  //   setNewSession({ id: "", name: "", startTime: "", endTime: "" }); // Reset form
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
  //     setSessions((prev) => [...prev, response]);
  //     setNewSession({ id: "", name: "", startTime: "", endTime: "" });
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
      <div className="p-2">
        <div className="flex items-center justify-between ml-2 mb-3">
          <h3 className="text-xl font-semibold">Ca học</h3>
          <Button
            className="px-7 py-2 rounded-xl text-[15px]"
            onClick={handleOpenModal}
          >
            Thêm ca học
          </Button>
        </div>
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-8 py-3 rounded-tl-xl text-left text-sm font-semibold text-gray-600">
                Tên ca học
              </th>
              <th className="px-8 py-3 text-left text-sm font-semibold text-gray-600">
                Thời gian
              </th>
              <th className="px-8 py-3 rounded-tr-xl text-center text-sm font-semibold text-gray-600">
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
                  <button className="text-primary-dark hover:text-primary-darker">
                    <Tooltip text="Chỉnh sửa" position="bottom">
                      <FaEdit className="h-4 w-4" />
                    </Tooltip>
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Tooltip text="Xóa" position="bottom">
                      <FaTrashAlt className="h-4 w-4" />
                    </Tooltip>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <SessionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          // session={newSession}
          // handleInputChange={handleInputChange}
          // handleCloseModal={handleCloseModal}
          // handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default SessionManagement;
