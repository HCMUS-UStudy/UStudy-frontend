import RoomsAdminPage from "@/app/ui/components/admin/rooms/RoomsAdminPage";
import RoomNumber from "@/app/ui/components/admin/rooms/RoomNumber";
import AddRoomModal from "@/app/ui/components/admin/rooms/AddRoomModal";
import { SearchField } from "@/app/ui/components/_common/text-field";

export default async function RoomPage(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  return (
    <div className="px-2">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between ">
        <RoomNumber searchQuery={query} />
        <div className="flex items-center">
          <AddRoomModal buttonLabel="Tạo phòng học" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 gap-2 md:gap-14">
        <SearchField
          className="w-full bg-primary-lighter"
          placeholder="Tìm kiếm phòng học..."
        />
      </div>

      <div className="overflow-x-auto mt-6 max-h-[400px]">
        <RoomsAdminPage searchQuery={query} />
      </div>
    </div>
  );
}
