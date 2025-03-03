import React, { useEffect, useState } from "react";
import { RoomItem } from "@/app/types/type";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { getAvailableRooms } from "@/app/lib/services/room";
import SelectorLoading from "./SelectorLoading";
import { FaCheck } from "react-icons/fa6";
import { useFormContext } from "react-hook-form";
import { CreateClassInputs } from "@/app/(admin)/clerk/classes/create/page";

export default function RoomSelector() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<CreateClassInputs>();
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const selectedBranchId = useSelector(
    (state: RootState) => state.branch.selectedBranchId,
  );
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const classTimes = watch("classTimes");
  useEffect(() => {
    const fetchData = async () => {
      if (
        selectedBranchId === null ||
        classTimes.length === 0 ||
        startDate === "" ||
        endDate === ""
      ) {
        return;
      }
      try {
        setLoading(true);
        const response = await getAvailableRooms(
          selectedBranchId,
          classTimes,
          startDate,
          endDate,
        );
        setRooms(response.data.data.content);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedBranchId, classTimes, startDate, endDate]);
  // const handleSelectRoom = (e: ChangeEvent<HTMLInputElement>) => {
  //   setNewClass((currentClass) => ({
  //     ...currentClass,
  //     roomId: e.target.value,
  //   }));
  //   context.nextStep();
  // };
  return (
    <div className="flex flex-col">
      {selectedBranchId && classTimes.length !== 0 && startDate && endDate && (
        <>
          <h1 className="font-bold">Chọn phòng học</h1>
          <div className="flex flex-wrap gap-4 mt-2">
            {loading ? (
              <SelectorLoading size="sm" numberOfItems={5} />
            ) : (
              <>
                {rooms.map((room) => (
                  <label
                    htmlFor={room.id}
                    key={room.id}
                    className="relative px-3 py-6 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-center h-20 w-20 border-2 border-slate-200 text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
                  >
                    <input
                      type="radio"
                      id={room.id}
                      className="hidden peer"
                      value={room.id}
                      {...register("roomId")}
                    />
                    <span className="peer-checked:text-primary-darkest text-black text-sm peer-checked:font-bold transition-all">
                      {room.name}
                    </span>
                    <FaCheck className="size-16 absolute text-primary-darkest opacity-0 peer-checked:opacity-10 transition-all" />
                  </label>
                ))}
              </>
            )}
          </div>
          <div className="text-error mt-2">{errors.roomId?.message}</div>
        </>
      )}
    </div>
  );
}
