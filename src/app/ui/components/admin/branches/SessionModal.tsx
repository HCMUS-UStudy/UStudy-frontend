import { Input } from "../../_common/text-field/Input";
import { Button } from "../../_common/Button";

const SessionModal = ({
  session,
  handleInputChange,
  handleCloseModal,
  handleSubmit,
}: {
  session: {
    name: string;
    startTime: string;
    endTime: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCloseModal: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}) => {
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              name="name"
              label="Tên ca học"
              placeholder="Tên ca học"
              value={session.name}
              onChange={handleInputChange}
              required
            />
            <Input
              name="startTime"
              label="Thời gian bắt đầu"
              placeholder="Thời gian bắt đầu"
              value={session.startTime}
              onChange={handleInputChange}
              required
            />
            <Input
              name="endTime"
              label="Thời gian kết thúc"
              placeholder="Thời gian kết thúc"
              value={session.endTime}
              onChange={handleInputChange}
              required
            />

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

export default SessionModal;
