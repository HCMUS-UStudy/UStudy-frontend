import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader } from "../../../_common/Dialog";
import { Button } from "../../../_common/Button";
import { DaysInWeek, RoomItem, SessionItem } from "@/app/types";
import { FaCheck } from "react-icons/fa6";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../_common/Table";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { getSessionByBranchId } from "@/app/lib/services/session";
import { useAppSelector } from "@/app/store/store";
import { getAvailableRooms } from "@/app/lib/services/room";
import SelectorLoadingHorizon from "../../../_common/loading/SelectorLoadingHorizon";
import { CreateClassInputs } from "./CreateClass";

type OverviewItem = {
  day: DaysInWeek;
  room: RoomItem | null;
  session: SessionItem;
};

export default function DayRoomSessionSelector() {
  const {
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<CreateClassInputs>();
  const daysMapping: Record<DaysInWeek, string> = {
    MONDAY: "Thứ hai",
    TUESDAY: "Thứ ba",
    WEDNESDAY: "Thứ tư",
    THURSDAY: "Thứ năm",
    FRIDAY: "Thứ sáu",
    SATURDAY: "Thứ bảy",
    SUNDAY: "Chủ nhật",
  };
  const { selectedBranchId } = useAppSelector((state) => state.branch);
  const numLessons = watch("numLessons");
  const classTimes = watch("classTimes");
  const startDate = watch("startDate");
  const [isSelecting, setSelecting] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<DaysInWeek | null>(null);
  const [selectedSession, setSelectedSession] = useState<SessionItem | null>(
    null,
  );
  const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(null);

  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loadingSessions, setLoadingSessions] = useState<boolean>(false);
  const [loadingRooms, setLoadingRooms] = useState<boolean>(false);
  const [overview, setOverview] = useState<OverviewItem[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoadingSessions(true);
        if (!selectedBranchId) {
          return;
        }
        const fetchSessions = await getSessionByBranchId(selectedBranchId);
        setSessions(fetchSessions);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingSessions(false);
      }
    };
    fetchSessions();
    return;
  }, [selectedBranchId]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedBranchId || !selectedSession || !selectedDay) {
        return;
      }
      try {
        setLoadingRooms(true);
        const response = await getAvailableRooms(
          selectedBranchId,
          selectedDay,
          selectedSession.id,
          startDate,
          numLessons,
        );
        setRooms(response.content);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
    return;
  }, [selectedBranchId, selectedSession, selectedDay, numLessons, startDate]);

  const handleSelectDaysInWeek = async (day: DaysInWeek) => {
    if (!selectedBranchId) {
      return;
    }
    setSelecting(true);
    setSelectedDay(day);

    const existingDay = overview.find((item) => item.day === day);
    if (existingDay) {
      setSelectedSession(existingDay.session);
      setSelectedRoom(existingDay.room);
    } else {
      setSelectedRoom(null);
      setSelectedSession(null);
    }
  };
  const isDaySelected = (day: string) => {
    return classTimes.some((item) => item.day === day);
  };
  const handleSelectDayRoomSession = () => {
    if (selectedSession === null) {
      toast.error("Vui lòng chọn ca học", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
      return;
    }
    // if (selectedRoom === null) {
    //   toast.error("Vui lòng chọn phòng học", {
    //     position: "bottom-right",
    //     autoClose: 3000,
    //     pauseOnHover: false,
    //   });
    //   return;
    // }
    const _classTimes = [...classTimes];
    const exists = _classTimes.findIndex((item) => item.day === selectedDay);
    if (exists !== -1) {
      _classTimes[exists] = {
        ..._classTimes[exists],
        branchSessionId: selectedSession.id,
        roomId: selectedRoom ? selectedRoom.id : null,
      };
      setOverview((current) => {
        current[exists] = {
          ...current[exists],
          session: selectedSession,
          room: selectedRoom ?? null,
        };
        return current;
      });
    } else {
      if (selectedDay === null) {
        return;
      }
      _classTimes.push({
        day: selectedDay,
        branchSessionId: selectedSession.id,
        roomId: selectedRoom ? selectedRoom.id : null,
      });
      setOverview((current) => [
        ...current,
        {
          day: selectedDay,
          session: selectedSession,
          room: selectedRoom,
        },
      ]);
    }
    setValue("classTimes", _classTimes);
    toast.success("Thêm ngày học thành công !", {
      position: "bottom-right",
      autoClose: 3000,
      pauseOnHover: false,
    });
    setSelecting(false);
  };
  const handleDeleteDay = (day: DaysInWeek) => {
    const _classTimes = [...classTimes];
    setValue(
      "classTimes",
      _classTimes.filter((item) => item.day !== day),
    );
    setOverview((current) => current.filter((item) => item.day !== day));
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <h1 className="font-bold text-sm md:text-base">
          Thành lập thời khóa biểu
        </h1>
        <div className="mt-2">
          <div className="flex flex-wrap gap-2 md:gap-4">
            {Object.entries(daysMapping).map(([key, value]) => (
              <div key={key}>
                <label
                  htmlFor={value}
                  className="relative h-16 w-16 md:h-20 md:w-20  py-6 shrink-0 grow-0 has-[:checked]:border-primary-darker has-[:disabled]:bg-slate-200 has-[:disabled]:hover:border-slate-200 has-[:disabled]:hover:cursor-default flex items-center justify-center border-2 border-slate-200
                         text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    className="hidden peer"
                    id={value}
                    disabled={!(numLessons !== 0 && startDate !== "")}
                    checked={isDaySelected(key)}
                    onChange={() => handleSelectDaysInWeek(key as DaysInWeek)}
                  />
                  <span className="peer-checked:text-primary-darkest text-black text-xs md:text-sm peer-checked:font-bold transition-all">
                    {value}
                  </span>
                  <FaCheck className="size-16 absolute text-primary-darkest opacity-0 peer-checked:opacity-10 transition-all" />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      {classTimes.length !== 0 && (
        <div className="flex flex-col w-full xl:w-1/2">
          <h1 className="font-bold">Thời khóa biểu</h1>
          <div className="mt-2 border border-slate-200 rounded">
            <Table>
              <TableHeader
                columns={["Thứ", "Phòng học", "Ca học", "Hành động"]}
              />
              <TableBody>
                {overview.map((item) => (
                  <TableRow key={item.day}>
                    <TableCell>{daysMapping[item.day]}</TableCell>
                    <TableCell>
                      {item.room ? item.room.name : "Chưa chọn phòng"}
                    </TableCell>
                    <TableCell>
                      {item.session.session.name} -{" "}
                      {item.session.session.startTime.slice(0, -3)} -{" "}
                      {item.session.session.endTime.slice(0, -3)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2 w-full">
                        <button
                          type="button"
                          onClick={() => handleDeleteDay(item.day)}
                        >
                          <FaTrashAlt className="size-4 md:size-5 text-error hover:scale-125 transition-transform" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectDaysInWeek(item.day)}
                        >
                          <FaEdit className="size-4 md:size-5 text-primary-darkest hover:scale-125 transition-transform" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      <span className="text-[13px] text-error">
        {errors.classTimes?.message}
      </span>
      <Dialog
        className="w-2/3 md:w-auto"
        isOpen={isSelecting}
        onClose={() => setSelecting(false)}
      >
        <DialogHeader>
          <div className="text-base">
            Vui lòng chọn phòng học và ca học tương ứng
          </div>
        </DialogHeader>
        <DialogContent>
          <div className="text-base flex flex-col gap-4 px-2">
            <div>
              <h1 className="font-bold text-sm md:text-base">Chọn ca học</h1>
              {loadingSessions ? (
                <SelectorLoadingHorizon numberOfItems={2} />
              ) : (
                <div className="flex flex-col mt-2 overflow-auto gap-2">
                  {sessions.map((session) => (
                    <label
                      key={session.id}
                      htmlFor={session.id}
                      className="relative px-3 py-2 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center border-2 border-slate-200
                         text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
                    >
                      <input
                        type="radio"
                        className="hidden peer"
                        name="sessionSelector"
                        id={session.id}
                        checked={selectedSession?.id === session.id}
                        onChange={() => setSelectedSession(session)}
                      />
                      <span className="peer-checked:text-primary-darkest text-black text-xs md:text-sm peer-checked:font-bold transition-all">
                        {session.session.name} -{" "}
                        {session.session.startTime.slice(0, -3)} -{" "}
                        {session.session.endTime.slice(0, -3)}
                      </span>
                      <FaCheck className="size-6 absolute right-3 text-primary-darkest opacity-0 peer-checked:opacity-70 transition-all" />
                    </label>
                  ))}
                </div>
              )}
            </div>
            {selectedSession !== null && (
              <div>
                <h1 className="font-bold text-sm md:text-base">
                  Chọn phòng học
                </h1>
                {loadingRooms ? (
                  <SelectorLoadingHorizon numberOfItems={2} />
                ) : rooms.length === 0 ? (
                  <div className="text-xs md:text-sm text-primary-darkest mt-2">
                    Chưa có phòng học cho ca này, có thể chọn sau khi tạo lớp
                    học
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    {rooms.map((room) => (
                      <label
                        key={room.id}
                        htmlFor={room.id}
                        className="relative px-3 py-2 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center border-2 border-slate-200
                         text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
                      >
                        <input
                          type="radio"
                          className="hidden peer"
                          id={room.id}
                          name={`roomSelector`}
                          checked={selectedRoom?.id === room.id}
                          onChange={() => setSelectedRoom(room)}
                        />
                        <span className="peer-checked:text-primary-darkest text-black text-xs md:text-sm peer-checked:font-bold transition-all text-center">
                          {room.name}
                        </span>
                        <FaCheck className="size-6 absolute right-3 text-primary-darkest opacity-0 peer-checked:opacity-70 transition-all" />
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2 self-end">
              <button
                type="button"
                className="px-3 py-2 text-xs md:text-sm border bg-slate-200 hover:bg-slate-300 transition-colors rounded-lg"
                onClick={() => setSelecting(false)}
              >
                Hủy
              </button>
              <Button
                className="text-xs md:text-sm"
                onClick={() => handleSelectDayRoomSession()}
                type="button"
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
