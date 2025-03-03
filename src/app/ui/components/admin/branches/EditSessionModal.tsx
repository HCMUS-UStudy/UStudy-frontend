"use client";

import { Button } from "@/app/ui/components/_common/Button";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";

type Session = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
};

const SessionEditModal = ({
  handleSubmit,
  sessions,
  listSessions,
  searchSessions,
  setSearchSessions,
  selectedSessions,
  setSelectedSessions,
  setShowSessionModal,
}: {
  handleSubmit: (e: React.FormEvent) => void;
  sessions: Session[];
  listSessions: Session[];
  searchSessions: Session[];
  setSearchSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  selectedSessions: Session[];
  setSelectedSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  setShowSessionModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleCloseModal = () => () => {
    setShowSessionModal(false);
    setSelectedSessions(sessions);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="flex flex-col bg-white pt-8 pb-4 rounded-xl shadow-lg w-1/4 h-fit max-h-[75vh]">
        <div className="text-xl font-semibold mb-4 text-center text-gray-800">
          Chỉnh sửa ca học
        </div>
        <div className="px-6 mb-2">
          <SearchField
            className="rounded-2xl py-[2px] bg-primary-lighter"
            placeholder="Tìm kiếm ca học..."
            onSearch={(searchTerm) =>
              setSearchSessions(
                listSessions.filter((session) =>
                  session.name.toLowerCase().includes(searchTerm.toLowerCase()),
                ),
              )
            }
          />
        </div>
        <div className="my-2 ml-8 mr-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {searchSessions.map((session, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSessions.some((s) => s.id === session.id)}
                  onChange={() => {
                    // setSelectedSessions((prev) =>
                    //   prev.includes(session)
                    //     ? prev.filter((s) => s.id !== session.id)
                    //     : [...prev, session],
                    // )
                    if (selectedSessions.some((s) => s.id === session.id)) {
                      setSelectedSessions((prev) =>
                        prev.filter((s) => s.id !== session.id),
                      );
                    } else {
                      setSelectedSessions((prev) => [...prev, session]);
                    }
                  }}
                  disabled={sessions?.some((s) => s.id === session.id)}
                  className="h-3 w-3"
                />
                <span className="text-gray-700 text-[16px]">
                  {session.name} ({session.startTime.slice(0, 5)} -{" "}
                  {session.endTime.slice(0, 5)})
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-6 mr-5 gap-4">
          <Button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-sm"
            onClick={handleCloseModal()}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="text-sm"
            onClick={(e) => {
              handleSubmit(e);
              setShowSessionModal(false);
            }}
          >
            Thêm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionEditModal;
