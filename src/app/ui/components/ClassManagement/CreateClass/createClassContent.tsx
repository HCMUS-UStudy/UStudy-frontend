import React, { createContext, useContext, useState } from "react";
import { Slider, SliderPage } from "../../slider";
import { TimeItem } from "@/app/types/type";
import GradeSelector from "./GradeSelector";
import CourseSelector from "./CourseSelector";
import DurationSelector from "./DurationSelector";
import FixedScheduleSelector from "./FixedScheduleSelector";
import FlexibleScheduleSelector from "./FlexibleScheduleSelector";
import RoomSelector from "./RoomSelector";
import ClassDescription from "./ClassDescription";

type CreateClassType = {
  gradeId: string;
  courseId: string;
  classTimes: TimeItem[];
  startDate: string;
  endDate: string;
};

interface CreateClassContextType {
  isFixedSchedule: boolean;
  setFixedSchedule: React.Dispatch<React.SetStateAction<boolean>>;
  newClass: CreateClassType;
  setNewClass: React.Dispatch<React.SetStateAction<CreateClassType>>;
}

export const CreateClassContext = createContext<CreateClassContextType | null>(
  null,
);

export const useCreateClassContext = () => {
  const context = useContext(CreateClassContext);
  if (!context) {
    throw new Error("Create Class Context used incorrectly");
  }
  return context;
};

export default function CreateClassContent() {
  const [isFixedSchedule, setFixedSchedule] = useState<boolean>(true);
  const [newClass, setNewClass] = useState<CreateClassType>({
    gradeId: "",
    courseId: "",
    classTimes: [],
    startDate: "",
    endDate: "",
  });
  return (
    <CreateClassContext.Provider
      value={{ isFixedSchedule, setFixedSchedule, newClass, setNewClass }}
    >
      <Slider>
        <SliderPage>
          <GradeSelector />
        </SliderPage>
        <SliderPage>
          <CourseSelector />
        </SliderPage>
        <SliderPage>
          <DurationSelector />
        </SliderPage>
        <SliderPage>
          {isFixedSchedule ? (
            <FixedScheduleSelector />
          ) : (
            <FlexibleScheduleSelector />
          )}
        </SliderPage>
        <SliderPage>
          <RoomSelector />
        </SliderPage>
        <SliderPage>
          <ClassDescription />
        </SliderPage>
      </Slider>
    </CreateClassContext.Provider>
  );
}
