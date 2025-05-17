"use client";

import React, { useState } from "react";
import { Button } from "@/app/ui/components/_common/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import { Tab, TabList, TabPanel, Tabs } from "@/app/ui/components/_common/Tabs";
import StudentList from "./StudentList";
// import TeacherRegister from "./TeacherRegister";
import { usePathname, useRouter } from "next/navigation";

interface AddMemberProps {
  buttonLabel: string;
}

const AddMember: React.FC<AddMemberProps> = ({ buttonLabel }) => {
  const [showModalRe, setShowModalRe] = useState<boolean>(false);
  const handleOpenModal = () => setShowModalRe(true);
  const router = useRouter();
  const pathname = usePathname();

  const onTabChange = () => {
    router.replace(pathname);
  };

  return (
    <>
      <Button onClick={handleOpenModal}>{buttonLabel}</Button>
      <Dialog
        className="min-h-[90vh] w-4/5"
        isOpen={showModalRe}
        onClose={() => setShowModalRe(false)}
      >
        <DialogHeader>Thêm thành viên</DialogHeader>
        <DialogContent>
          <Tabs value="students" onTabChange={() => onTabChange()}>
            <TabList>
              <Tab label="Học viên" value="students" />
              <Tab label="Giáo viên" value="teachers" />
            </TabList>

            <TabPanel value="students">
              <StudentList />
            </TabPanel>

            {/* <TabPanel value="teachers">
              <TeacherRegister />
            </TabPanel> */}
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddMember;
