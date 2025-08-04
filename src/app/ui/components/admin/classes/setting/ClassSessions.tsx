import { Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { daysInWeekMap } from "@/app/lib/utils";
import { ClassDetail, UpdateSchedule } from "@/app/types";
import { memo, useState } from "react";
import { Input, ReadonlyTextField } from "../../../_common/text-field";
import { Button } from "../../../_common/Button";
import { Dialog, DialogContent, DialogHeader } from "../../../_common/Dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSchedule } from "@/app/lib/services";
import { usePathname } from "next/navigation";
import { useCustomToast } from "@/app/lib/hooks/useToast";

interface Props {
  classDetail: ClassDetail;
}

const ClassSession = ({ classDetail }: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const pathname = usePathname();
  const classId = pathname?.split("/")[3] || "";
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [updatedSchedule, setUpdatedSchedule] = useState<UpdateSchedule>({
    startDate: classDetail.startDate,
    numLessons: classDetail.numLessons,
    classSessions: [],
  });
  const { addToast } = useCustomToast();
  const queryClient = useQueryClient();
  const updateScheduleMutation = useMutation({
    mutationFn: (data: UpdateSchedule) => updateSchedule({ classId, data }),
    onError: () => {
      addToast.error("Cập nhật lịch học thất bại");
    },
    onSuccess: () => {
      addToast.success("Cập nhật lịch học thành công");
      queryClient.invalidateQueries({ queryKey: ["ClassDetails"] });
      setIsEditing(false);
      setIsOpen(false);
    },
  });
  const handleUpdateSchedule = () => {
    updateScheduleMutation.mutate(updatedSchedule);
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-5 items-center">
            <div>Lịch học</div>
            <div className="flex gap-3">
              {isEditing ? (
                <Input
                  label="Số buổi học"
                  type="number"
                  className="placeholder:font-normal"
                  value={updatedSchedule.numLessons}
                  onChange={(e) =>
                    setUpdatedSchedule((prev) => ({
                      ...prev,
                      numLessons: Number(e.target.value),
                    }))
                  }
                  placeholder="Nhập số buổi học..."
                />
              ) : (
                <ReadonlyTextField
                  label=""
                  text={`${classDetail.numLessons} buổi học`}
                />
              )}
              {isEditing ? (
                <>
                  <Button
                    onClick={() => {
                      handleUpdateSchedule();
                    }}
                    isPending={updateScheduleMutation.status === "pending"}
                  >
                    Hoàn tất
                  </Button>
                </>
              ) : (
                <>
                  {/* <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button> */}
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {classDetail.classSessions.map((session) => (
              <Card
                key={session.id}
                onClick={() => {
                  if (isEditing) {
                    setIsOpen(true);
                  }
                }}
                className={`relative border-2 hover:shadow-none ${isEditing && "hover:bg-primary-lighter hover:border-primary-dark hover:shadow-md cursor-pointer"} transition-colors  group`}
              >
                <div
                  className={`absolute flex justify-center items-center w-full h-full ${isEditing && "group-hover:bg-primary-light/40"} transition-all`}
                >
                  <Edit
                    className={`size-8 md:size-10 text-primary-darkest opacity-0 ${isEditing && "group-hover:opacity-100"} transition-all`}
                  />
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
          </div>
        </CardContent>
      </Card>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DialogHeader>Chỉnh sửa lịch học</DialogHeader>
        <DialogContent>
          <form action=""></form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(ClassSession);
