"use client";
import React, { memo, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import EnrollmentTitle from "./EnrollmentTitle";
import { ClassDetail } from "@/app/types";
import { Tab, TabList, TabPanel, Tabs } from "../../../_common/Tabs";
import { getClassById } from "@/app/lib/services/class";
import Loading from "../../../_common/loading/Loading";
import StudentEnrollment from "./StudentEnrollment";
import TeacherEnrollment from "./TeacherEnrollment";

const MemoizedTitle = memo(EnrollmentTitle);
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
  const [loading, setLoading] = useState<boolean>(false);
  const [classDetail, setClassDetail] = useState<ClassDetail>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchClassDetail = await getClassById(classId);
        setClassDetail(fetchClassDetail);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen) {
      fetchData();
    }
  }, [classId, isOpen]);
  return (
    <>
      <Dialog
        className="min-h-[90vh] min-w-[80vw] m-4"
        isOpen={isOpen}
        onClose={onClose}
      >
        <DialogHeader>Thông tin học viên, giáo viên cần duyệt</DialogHeader>
        <MemoizedTitle classDetail={classDetail} />
        <DialogContent>
          {loading ? (
            <Loading />
          ) : (
            <>
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
