"use client";

import { Input } from "../../_common/text-field/Input";
import { Button } from "../../_common/Button";
import { getSession } from "@/app/lib/services/session";
import { useEffect, useState } from "react";
import { Session } from "@/app/types";

const Modal = ({
  handleCloseModal,
  handleModalInputChange,
  handleSubmitModal,
  newBranch,
  setNewBranch, // Thêm prop để cập nhật newBranch
}: {
  handleCloseModal: () => void;
  handleModalInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitModal: (e: React.FormEvent) => void;
  newBranch: {
    name: string;
    address: string;
    contactNumber: string;
    rooms: string;
    sessions: Session[];
  };
  setNewBranch: React.Dispatch<
    React.SetStateAction<{
      name: string;
      address: string;
      contactNumber: string;
      rooms: string;
      sessions: Session[];
    }>
  >;
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getSession(0, 100);
        response.data.sort((a: Session, b: Session) =>
          a.startTime.localeCompare(b.startTime),
        );
        setSessions(response.data);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      }
    };
    fetchSessions();
  }, []);

  // Hàm xử lý khi chọn/bỏ chọn session
  const handleSessionChange = (session: Session) => {
    const isSelected = newBranch.sessions.some((s) => s.id === session.id);

    if (isSelected) {
      // Bỏ chọn session
      setNewBranch((prev) => ({
        ...prev,
        sessions: prev.sessions.filter((s) => s.id !== session.id),
      }));
    } else {
      // Thêm session được chọn
      setNewBranch((prev) => ({
        ...prev,
        sessions: [...prev.sessions, session],
      }));
    }
  };

  return (
    <div>
      <div
        onClick={handleCloseModal}
        className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-8 rounded-xl shadow-lg w-96 max-w-lg"
        >
          <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">
            Tạo chi nhánh mới
          </h3>
          <form onSubmit={handleSubmitModal} className="flex flex-col gap-4">
            <Input
              name="name"
              label="Tên chi nhánh"
              placeholder="Tên chi nhánh"
              value={newBranch.name}
              onChange={handleModalInputChange}
              required
            />
            <Input
              name="address"
              label="Địa chỉ"
              placeholder="Địa chỉ"
              value={newBranch.address}
              onChange={handleModalInputChange}
              required
            />
            <Input
              name="contactNumber"
              label="Số điện thoại"
              placeholder="Số điện thoại"
              value={newBranch.contactNumber}
              onChange={handleModalInputChange}
              required
            />
            <Input
              name="rooms"
              label="Số phòng học"
              placeholder="Số phòng học"
              value={newBranch.rooms}
              onChange={handleModalInputChange}
              required
            />

            {/* Phần chọn Ca học với checkbox */}
            <div>
              <div className="ml-2 text-sm text-gray-700">Ca học</div>
              <div className="mt-2 flex flex-col gap-2 max-h-40 overflow-y-auto border p-2 rounded-lg">
                {sessions.map((session) => (
                  <label key={session.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newBranch.sessions.some(
                        (s) => s.id === session.id,
                      )}
                      onChange={() => handleSessionChange(session)}
                      className="h-3 w-3"
                    />
                    <span className="text-gray-700 text-[15px]">
                      {session.name} ({session.startTime.slice(0, 5)} -{" "}
                      {session.endTime.slice(0, 5)})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-2 gap-4">
              <Button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-sm"
                onClick={handleCloseModal}
              >
                Hủy
              </Button>
              <Button type="submit" className="text-sm">
                Thêm
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
