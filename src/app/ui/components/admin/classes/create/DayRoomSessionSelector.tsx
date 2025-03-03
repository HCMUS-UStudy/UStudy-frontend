import { CreateClassInputs } from "@/app/(admin)/admin/classes/create/page";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader } from "../../../_common/Dialog";
import { Button } from "../../../_common/Button";
import { DaysInWeek, RoomItem, SessionBranchItem } from "@/app/types/type";
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

const dummyRooms: RoomItem[] = [
  { id: "room-1", name: "Phòng A101" },
  { id: "room-2", name: "Phòng B202" },
  { id: "room-3", name: "Phòng C303" },
  { id: "room-4", name: "Phòng D404" },
  { id: "room-5", name: "Phòng E505" },
];

const dummySessions: SessionBranchItem[] = [
  { id: "session-1", name: "7h - 10h" },
  { id: "session-2", name: "10h - 13h" },
  { id: "session-3", name: "13h - 16h" },
  { id: "session-4", name: "16h - 19h" },
  { id: "session-5", name: "19h - 22h" },
];

export default function DayRoomSessionSelector() {
  const {
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<CreateClassInputs>();
  const daysInWeek: Record<DaysInWeek, string> = {
    MONDAY: "Thứ hai",
    TUESDAY: "Thứ ba",
    WEDNESDAY: "Thứ tư",
    THURSDAY: "Thứ năm",
    FRIDAY: "Thứ sáu",
    SATURDAY: "Thứ bảy",
    SUNDAY: "Chủ nhật",
  };
  const classTimes = watch("classTimes");
  const [isSelecting, setSelecting] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<DaysInWeek | null>(null);
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  const handleSelectDaysInWeek = (day: DaysInWeek) => {
    setSelecting(true);
    setSelectedDay(day);

    const existingDay = classTimes.find((item) => item.day === day);
    if (existingDay) {
      setSelectedSession(existingDay.branchSessionId);
      setSelectedRoom(existingDay.roomId);
    } else {
      setSelectedRoom("");
      setSelectedSession("");
    }
  };
  const isDaySelected = (day: string) => {
    return classTimes.some((item) => item.day === day);
  };
  const handleSelectDayRoomSession = () => {
    if (selectedSession === "") {
      toast.error("Vui lòng chọn ca học", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
      return;
    }
    if (selectedRoom === "") {
      toast.error("Vui lòng chọn phòng học", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
      return;
    }
    const _classTimes = [...classTimes];
    const exists = _classTimes.findIndex((item) => item.day === selectedDay);
    if (exists !== -1) {
      _classTimes[exists] = {
        ..._classTimes[exists],
        branchSessionId: selectedSession,
        roomId: selectedRoom,
      };
    } else {
      if (selectedDay === null) {
        return;
      }
      _classTimes.push({
        day: selectedDay,
        branchSessionId: selectedSession,
        roomId: selectedRoom,
      });
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
    toast.success("Xóa lớp học thành công", {
      position: "bottom-right",
      autoClose: 3000,
      pauseOnHover: false,
    });
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <h1 className="font-bold">Thành lập thời khóa biểu</h1>
        <div className="mt-2">
          <div className="flex flex-wrap gap-4">
            {Object.entries(daysInWeek).map(([key, value]) => (
              <div key={key}>
                <label
                  htmlFor={value}
                  className="relative py-6 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-center h-20 w-20 border-2 border-slate-200
                         text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    className="hidden peer"
                    id={value}
                    checked={isDaySelected(key)}
                    onChange={() => handleSelectDaysInWeek(key as DaysInWeek)}
                  />
                  <span className="peer-checked:text-primary-darkest text-black text-sm peer-checked:font-bold transition-all">
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
        <div className="flex flex-col w-1/2">
          <h1 className="font-bold">Thời khóa biểu</h1>
          <div className="mt-2 border border-slate-200 rounded">
            <Table>
              <TableHeader
                columns={["Thứ", "Phòng học", "Ca học", "Hành động"]}
              />
              <TableBody>
                {classTimes.map((item) => (
                  <TableRow key={item.day}>
                    <TableCell>{item.day}</TableCell>
                    <TableCell>{item.roomId}</TableCell>
                    <TableCell>{item.branchSessionId}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2 w-full">
                        <button
                          type="button"
                          onClick={() => handleDeleteDay(item.day)}
                        >
                          <FaTrashAlt className="size-5 text-error hover:scale-125 transition-transform" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectDaysInWeek(item.day)}
                        >
                          <FaEdit className="size-5 text-primary-darkest hover:scale-125 transition-transform" />
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
      <Dialog isOpen={isSelecting} onClose={() => setSelecting(false)}>
        <DialogHeader>
          <div className="text-base">
            Vui lòng chọn phòng học và ca học tương ứng
          </div>
        </DialogHeader>
        <DialogContent>
          <div className="text-base flex flex-col gap-4">
            <div>
              <h1 className="font-bold">Chọn ca học</h1>
              <div className="flex flex-wrap gap-4 mt-2">
                {dummySessions.map((session) => (
                  <label
                    key={session.id}
                    htmlFor={session.id}
                    className="relative py-6 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-center h-20 w-20 border-2 border-slate-200
                         text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
                  >
                    <input
                      type="radio"
                      className="hidden peer"
                      name="sessionSelector"
                      id={session.id}
                      checked={selectedSession === session.id}
                      onChange={() => setSelectedSession(session.id)}
                    />
                    <span className="peer-checked:text-primary-darkest text-black text-sm peer-checked:font-bold transition-all">
                      {session.name}
                    </span>
                    <FaCheck className="size-16 absolute text-primary-darkest opacity-0 peer-checked:opacity-10 transition-all" />
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h1 className="font-bold">Chọn phòng học</h1>
              <div className="flex flex-wrap gap-4 mt-2">
                {dummyRooms.map((room) => (
                  <label
                    key={room.id}
                    htmlFor={room.id}
                    className="relative py-6 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-center h-20 w-20 border-2 border-slate-200
                         text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
                  >
                    <input
                      type="radio"
                      className="hidden peer"
                      id={room.id}
                      name={`roomSelector`}
                      checked={selectedRoom === room.id}
                      onChange={() => setSelectedRoom(room.id)}
                    />
                    <span className="peer-checked:text-primary-darkest text-black text-sm peer-checked:font-bold transition-all text-center">
                      {room.name}
                    </span>
                    <FaCheck className="size-16 absolute text-primary-darkest opacity-0 peer-checked:opacity-10 transition-all" />
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2 self-end">
              <button
                type="button"
                className="px-3 py-2 border bg-slate-200 hover:bg-slate-300 transition-colors rounded-lg"
                onClick={() => setSelecting(false)}
              >
                Hủy
              </button>
              <Button
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
