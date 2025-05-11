"use client";

import React, { useState } from "react";
import { Button } from "@/app/ui/components/_common/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import { Tab, TabList, TabPanel, Tabs } from "@/app/ui/components/_common/Tabs";
import StudentRegister from "./StudentRegister";
import TeacherRegister from "./TeacherRegister";
import { usePathname, useRouter } from "next/navigation";

interface AccountRegisterModalProps {
  buttonLabel: string;
}

const AccountRegisterModal: React.FC<AccountRegisterModalProps> = ({
  buttonLabel,
}) => {
  const [showModalRe, setShowModalRe] = useState<boolean>(false);
  const handleOpenModal = () => setShowModalRe(true);
  const router = useRouter();
  const pathname = usePathname();

  const onTabChange = () => {
    router.replace(pathname ?? "");
  };

  return (
    <>
      <Button onClick={handleOpenModal} className="pl-6 pr-6 mr-4">
        {buttonLabel}
      </Button>
      <Dialog
        className="min-h-[90vh] min-w-[80vw]"
        isOpen={showModalRe}
        onClose={() => setShowModalRe(false)}
      >
        <DialogHeader>Thông tin người dùng cần xác nhận</DialogHeader>
        <DialogContent>
          <Tabs value="students" onTabChange={() => onTabChange()}>
            <TabList>
              <Tab label="Học viên" value="students" />
              <Tab label="Giáo viên" value="teachers" />
            </TabList>

            <TabPanel value="students">
              <StudentRegister />
            </TabPanel>

            <TabPanel value="teachers">
              <TeacherRegister />
            </TabPanel>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountRegisterModal;
