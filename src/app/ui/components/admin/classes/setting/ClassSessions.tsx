import { Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { daysInWeekMap } from "@/app/lib/utils";
import { classSessions, UpdateSchedule } from "@/app/types";
import { memo } from "react";

interface Props {
  classSessions: classSessions[];
  handleUpdateSchedule: ({
    classId,
    data,
  }: {
    classId: string;
    data: UpdateSchedule;
  }) => void;
}

const ClassSession = ({ classSessions, handleUpdateSchedule }: Props) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lịch học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {classSessions.map((session) => (
              <Card
                key={session.id}
                // onClick={() => setIsSelectingRoom(true)}
                className="relative hover:bg-primary-lighter hover:border-primary-dark transition-colors cursor-pointer group"
              >
                <div className="absolute flex justify-center items-center w-full h-full group-hover:bg-primary-light/40 transition-all">
                  <Edit className="size-8 md:size-10 text-primary-darkest opacity-0 group-hover:opacity-100 transition-all" />
                </div>

                <CardContent className=" pt-6 transition-colors text-sm md:text-base">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Ngày trong tuần:</span>
                      <span>{daysInWeekMap[session.day]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Ca học:</span>
                      <span>{session.session.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Giờ học:</span>
                      <span>
                        {session.session.startTime.slice(0, 5)} -{" "}
                        {session.session.endTime.slice(0, 5)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Phòng học:</span>
                      {session.room ? (
                        <span>{session.room.name}</span>
                      ) : (
                        <span className="text-sm text-error">
                          Chưa có phòng học
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {/* <div>
                          <Tooltip text="Thêm ca học mới" position="top">
                            <Plus
                              className="size-10 border-2 border-slate-200 hover:border-primary p-1 text-gray-700 hover:text-primary-darker rounded-lg cursor-pointer hover:bg-primary-lighter transition-all"
                              // onClick={() => setIsAddingSession(true)}
                            />
                          </Tooltip>
                        </div> */}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default memo(ClassSession);
