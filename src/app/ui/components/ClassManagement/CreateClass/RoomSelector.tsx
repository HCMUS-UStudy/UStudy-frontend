import React, { ChangeEvent, useEffect, useState } from "react";
import { useSlider } from "../../slider";
import { useCreateClassContext } from "./createClassContent";
import { RoomItem } from "@/app/types/type";
import { useSelector } from "react-redux";
import { BranchRootState } from "@/app/store/store";
import { getAvailableRooms } from "@/app/lib/services/room";
import SelectorLoading from "./SelectorLoading";
import { FaCheck } from "react-icons/fa6";

export default function RoomSelector() {
  const context = useSlider();
  const { setNewClass, newClass } = useCreateClassContext();
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const branchId = useSelector(
    (state: BranchRootState) => state.branch.selectedBranchId,
  );
  useEffect(() => {
    const fetchData = async () => {
      if (
        branchId === null ||
        newClass.classTimes.length === 0 ||
        newClass.startDate === "" ||
        newClass.endDate === ""
      ) {
        return;
      }
      try {
        setLoading(true);
        const response = await getAvailableRooms(
          branchId,
          newClass.classTimes,
          newClass.startDate,
          newClass.endDate,
        );
        console.log(response);
        setRooms(response.data.data.content);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [branchId, newClass.classTimes, newClass.startDate, newClass.endDate]);
  const handleSelectRoom = (e: ChangeEvent<HTMLInputElement>) => {
    setNewClass((currentClass) => ({
      ...currentClass,
      roomId: e.target.value,
    }));
    context.nextStep();
  };
  return (
    <div className="flex flex-col">
      <h1 className="text-center font-medium text-lg">Chọn phòng học</h1>
      <div className="grid grid-cols-3 divide-x-2 divide-slate-200 mt-4">
        <div className="col-span-2 flex flex-wrap gap-4 px-10">
          {loading ? (
            <SelectorLoading />
          ) : (
            <>
              {rooms.map((room) => (
                <label
                  htmlFor={room.id}
                  key={room.id}
                  className="relative px-4 py-6 shrink-0 grow-0 has-[:checked]:border-blue-400 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
                >
                  <input
                    type="radio"
                    name="selectRoom"
                    id={room.id}
                    className="hidden peer"
                    value={room.id}
                    onChange={handleSelectRoom}
                  />
                  <span className="peer-checked:text-blue-600 text-black transition-colors">
                    {room.name}
                  </span>
                  <FaCheck className="size-20 absolute text-blue-600 opacity-0 peer-checked:opacity-10 transition-all" />
                </label>
              ))}
            </>
          )}
        </div>
        <div className="flex flex-col gap-2 px-3">
          <button
            onClick={context.nextStep}
            type="button"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-800 transition-colors text-white text-sm rounded"
          >
            Tiếp theo
          </button>
          <button
            onClick={context.prevStep}
            type="button"
            className="px-6 py-3 bg-slate-400 hover:bg-slate-500 transition-colors text-white text-sm rounded"
          >
            Trở lại
          </button>
        </div>
      </div>
    </div>
  );
}
