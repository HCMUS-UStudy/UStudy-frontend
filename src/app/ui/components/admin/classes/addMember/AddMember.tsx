"use client";

import React, { useState } from "react";
import { Button } from "@/app/ui/components/_common/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import { Tab, TabList, TabPanel, Tabs } from "@/app/ui/components/_common/Tabs";
import MemberList from "./MemberList";

interface AddMemberProps {
  buttonLabel: string;
}

const AddMember: React.FC<AddMemberProps> = ({ buttonLabel }) => {
  const [showModalRe, setShowModalRe] = useState<boolean>(false);
  const handleOpenModal = () => setShowModalRe(true);

  // const { data: memberList } = useQuery({
  //   queryKey: [
  //     "ListMembersToAdd",
  //     role,
  //     currentPage,
  //     searchParams?.get("AccountName") ?? "",
  //   ],
  //   refetchOnWindowFocus: false,
  //   queryFn: () => getFreeUsers(classId as string, 10, role, currentPage),
  // });

  const onTabChange = () => {
    // if (pathname) {
    //   router.replace(pathname);
    // }
    // switch (tab) {
    //   case "students":
    //     setRole("STUDENT");
    //   case "teachers":
    //     setRole("TEACHER");
    //   case "admins":
    //     setRole("ADMIN");
    //   default:
    //     setRole("STUDENT");
    // }
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
              <Tab label="Giáo vụ" value="admins" />
            </TabList>

            <TabPanel value="students">
              <MemberList
                onClose={() => setShowModalRe(false)}
                role={"STUDENT"}
              />
            </TabPanel>

            <TabPanel value="teachers">
              <MemberList
                onClose={() => setShowModalRe(false)}
                role={"TEACHER"}
              />
            </TabPanel>

            <TabPanel value="admins">
              <MemberList
                onClose={() => setShowModalRe(false)}
                role={"ADMIN"}
              />
            </TabPanel>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddMember;
