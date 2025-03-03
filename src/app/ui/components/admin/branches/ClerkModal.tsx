"use client";

import { Button } from "@/app/ui/components/_common/Button";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";

type Clerk = {
  id: string;
  genId: string;
  name: string;
  email: string;
  avatar: string;
  gender: string;
};

const ClerkModal = ({
  handleSubmit,
  clerks,
  availableClerks,
  searchClerks,
  setSearchClerks,
  selectedClerks,
  setSelectedClerks,
  setShowClerkModal,
}: {
  handleSubmit: (e: React.FormEvent) => void;
  clerks: Clerk[];
  availableClerks: Clerk[];
  searchClerks: Clerk[];
  setSearchClerks: React.Dispatch<React.SetStateAction<Clerk[]>>;
  selectedClerks: Clerk[];
  setSelectedClerks: React.Dispatch<React.SetStateAction<Clerk[]>>;
  setShowClerkModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleCloseModal = () => () => {
    setShowClerkModal(false);
    setSelectedClerks(clerks);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="flex flex-col bg-white pt-8 pb-4 rounded-xl shadow-lg w-1/3 max-h-[75vh]">
        <div className="text-xl font-semibold mb-4 text-center text-gray-800">
          Chỉnh sửa giáo vụ
        </div>
        <div className="px-6 mb-2">
          <SearchField
            className="rounded-2xl py-[2px] bg-primary-lighter"
            placeholder="Tìm kiếm giáo vụ..."
            onSearch={(searchTerm) =>
              setSearchClerks(
                availableClerks.filter(
                  (clerk) =>
                    clerk.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    clerk.genId.toLowerCase().includes(searchTerm),
                ),
              )
            }
          />
        </div>
        <div className="my-2 ml-8 mr-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {searchClerks.map((clerk, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedClerks.some((c) => c.id === clerk.id)}
                  onChange={() => {
                    if (selectedClerks.some((c) => c.id === clerk.id)) {
                      setSelectedClerks((prev) =>
                        prev.filter((c) => c.id !== clerk.id),
                      );
                    } else {
                      setSelectedClerks((prev) => [...prev, clerk]);
                    }
                  }}
                  className="h-3 w-3"
                />
                <span className="text-gray-700 text-[16px]">
                  {clerk.genId} - {clerk.name}
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
              setShowClerkModal(false);
            }}
          >
            Thêm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClerkModal;
