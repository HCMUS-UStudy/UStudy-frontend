const DeletePopup = ({
  onDelete,
  onCancel,
}: {
  onDelete: () => void;
  onCancel: () => void;
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
      <p>Bạn có chắc chắn muốn xóa không?</p>
      <div className="flex justify-end gap-4 mt-6">
        <button
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          onClick={onCancel}
        >
          Hủy
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          onClick={onDelete}
        >
          Xóa
        </button>
      </div>
    </div>
  </div>
);

export default DeletePopup;
