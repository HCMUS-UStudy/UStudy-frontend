import { getSessionByBranchId } from "@/app/lib/services/session";
import { BranchRootState } from "@/app/store/store";
import { SessionItem, SessionTimeItem } from "@/app/types/type";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { useSelector } from "react-redux";
import SelectorLoading from "./SelectorLoading";
import { useFormContext } from "react-hook-form";
import { CreateClassInputs } from "@/app/(admin)/clerk/classes/create/page";

type DAYS_IN_WEEK =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export default function SessionSelector() {
  const {
    setValue,
    setError,
    formState: { errors },
    clearErrors,
  } = useFormContext<CreateClassInputs>();
  const daysInWeek = new Map<string, string>([
    ["MONDAY", "Thứ hai"],
    ["TUESDAY", "Thứ ba"],
    ["WEDNESDAY", "Thứ tư"],
    ["THURSDAY", "Thứ năm"],
    ["FRIDAY", "Thứ sáu"],
    ["SATURDAY", "Thứ bảy"],
    ["SUNDAY", "Chủ nhật"],
  ]);
  const { selectedBranchId } = useSelector(
    (state: BranchRootState) => state.branch,
  );
  const [selectedDays, setSelectedDays] = useState<SessionTimeItem[]>([]);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const handleSelectDaysInWeek = (key: DAYS_IN_WEEK) => {
    setSelectedDays((days) => {
      const isSelected = days.some((item) => item.day === key);
      if (isSelected) {
        return days.filter((item) => item.day !== key);
      } else {
        return [
          ...days,
          {
            day: key,
            branchSessionId: "",
          },
        ];
      }
    });
  };
  const handleSelectSession = (branchSessionId: string) => {
    setSelectedDays((days) => {
      return days.map((day) => ({
        ...day,
        branchSessionId: branchSessionId,
      }));
    });
  };
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    console.log(selectedBranchId);
    const fetchSessions = async () => {
      try {
        if (selectedBranchId === null) {
          return;
        }
        setLoading(true);
        const response = await getSessionByBranchId(selectedBranchId);
        setSessions(response.data.data);
        // console.log(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [selectedBranchId]);
  useEffect(() => {
    if (sessions.length === 0) {
      return;
    }
    if (selectedDays.length !== 0) {
      setValue("classTimes", selectedDays);
      clearErrors("classTimes");
    } else {
      setError("classTimes", {
        type: "manual",
        message: "Vui lòng chọn đầy đủ thứ và ca học",
      });
    }
  }, [selectedDays, sessions.length, setError, setValue, clearErrors]);
  useEffect(() => {
    if (sessions.length === 0) {
      setError("classTimes", {
        type: "manual",
        message: "Chưa có ca học cho chi nhánh này",
      });
    } else {
      clearErrors("classTimes");
    }
  }, [sessions, setError, clearErrors]);
  return (
    <div>
      <div className="flex flex-col">
        <h1 className="font-bold">Thành lập thời khóa biểu</h1>
        <div className="mt-2">
          <div className="flex flex-wrap gap-4">
            {Array.from(daysInWeek.entries()).map(([key, value]) => (
              <label
                key={key}
                htmlFor={value}
                className="relative py-6 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-center h-20 w-20 border-2 border-slate-200
                     text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
              >
                <input
                  type="checkbox"
                  className="hidden peer"
                  id={value}
                  onChange={() => handleSelectDaysInWeek(key as DAYS_IN_WEEK)}
                />
                <span className="peer-checked:text-primary-darkest text-black text-sm peer-checked:font-bold transition-all">
                  {value}
                </span>
                <FaCheck className="size-16 absolute text-primary-darkest opacity-0 peer-checked:opacity-10 transition-all" />
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-2">
        <h1 className="font-bold">Chọn ca học hiện có</h1>
        <div className="mt-2">
          <div className="flex flex-wrap gap-4">
            {loading ? (
              <SelectorLoading size="sm" numberOfItems={5} />
            ) : (
              <>
                {sessions.map((session) => (
                  <label
                    key={session.id}
                    htmlFor={session.id}
                    className="relative py-6 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-center h-20 w-20 border-2 border-slate-200
                 text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
                  >
                    <input
                      type="radio"
                      name="SessionSelector"
                      className="hidden peer"
                      id={session.id}
                      onChange={() => handleSelectSession(session.id)}
                    />
                    <span className="peer-checked:text-primary-darkest text-black text-sm peer-checked:font-bold transition-all text-center">
                      <div>{session.session.name.split(" ")[0]}</div>
                      <div>{session.session.name.split(" ")[1]}</div>
                    </span>
                    <FaCheck className="size-16 absolute text-primary-darkest opacity-0 peer-checked:opacity-10 transition-all" />
                  </label>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <span className="mt-2 text-error">{errors.classTimes?.message}</span>
    </div>
  );
}
