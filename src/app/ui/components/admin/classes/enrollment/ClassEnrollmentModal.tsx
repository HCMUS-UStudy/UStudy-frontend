"use client";
import React, { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import { ClassDetail } from "@/app/types";
import { Tab, TabList, TabPanel, Tabs } from "../../../_common/Tabs";
import { getClassById } from "@/app/lib/services/class";
import Loading from "../../../_common/loading/Loading";
import StudentEnrollment from "./StudentEnrollment";
import TeacherEnrollment from "./TeacherEnrollment";
import { ArrowRightCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const MemoizedStudentEnrollment = memo(StudentEnrollment);
const MemoizedTeacherEnrollment = memo(TeacherEnrollment);

export default function ClassEnrollmentModal({
  classId,
  isOpen,
  onClose,
}: {
  classId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  // const [loading, setLoading] = useState<boolean>(false);
  // const [classDetail, setClassDetail] = useState<ClassDetail>();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const fetchClassDetail = await getClassById(classId);
  //       setClassDetail(fetchClassDetail);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   if (isOpen) {
  //     fetchData();
  //   }
  // }, [classId, isOpen]);
  const { data: classDetail, status } = useQuery<ClassDetail>({
    queryKey: ["classDetail", classId],
    queryFn: () => getClassById(classId),
  });
  return (
    <>
      <Dialog
        className="min-h-[90vh] min-w-[80vw] m-4"
        isOpen={isOpen}
        onClose={onClose}
      >
        <DialogHeader>Thông tin học viên, giáo viên cần duyệt</DialogHeader>
        <div className="flex items-center gap-4 px-4 py-2 border shadow bg-white">
          <div className="flex-shrink-0">
            <ArrowRightCircle size={30} className="text-primary-darker" />
          </div>
          <div>
            {status === "pending" ? (
              <Loading className="size-6" />
            ) : (
              <h2 className="text-lg font-bold text-gray-900">
                {classDetail?.name || ""}
                {classDetail?.description
                  ? ` - ${classDetail.description}`
                  : ""}
              </h2>
            )}
          </div>
        </div>
        <DialogContent>
          <Tabs value="student">
            <TabList>
              <Tab label="Học viên" value="student" />
              <Tab label="Giáo viên" value="teacher" />
            </TabList>

            <TabPanel className="relative" value="student">
              <MemoizedStudentEnrollment classId={classId} />
            </TabPanel>

            <TabPanel className="relative" value="teacher">
              <MemoizedTeacherEnrollment classId={classId} />
            </TabPanel>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
