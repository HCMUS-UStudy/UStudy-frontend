import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_common/Card";
import { BsPerson } from "react-icons/bs";
import Image from "next/image";
import { Contact } from "./Contacts";

interface Props {
  contacts: Contact;
}

export const ContactList = ({ contacts }: Props) => {
  return (
    <Card className="h-full shadow-md bg-white border flex flex-col">
      <CardHeader className="h-[80px]">
        <CardTitle className="flex items-center text-primary-dark text-sm lg:text-base">
          <BsPerson className="mr-2 hidden lg:flex" />
          Danh sách giáo viên
        </CardTitle>
        <CardDescription className="text-gray-500 text-xs lg:text-sm">
          Chọn giáo viên để nhắn tin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 py-2 flex-1 max-h-[79vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        {/* {contacts.map((c) => (
          <div
            key={c.id}
            className={`flex items-center p-3 border rounded cursor-pointer transition-all duration-200 ease-in-out hover:shadow-sm ${
              selectedTeacher === c.name
                ? "border-primary-dark bg-primary-lighter"
                : "hover:bg-gray-50"
            }`}
            onClick={() => {
              setSelectedTeacher(c.name);
            }}
          >
            <div className="relative size-8 lg:size-11 mr-3">
              <div className="size-8 lg:size-11 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100 flex items-center justify-center">
                {c.avatar ? (
                  <Image
                    width={36}
                    height={36}
                    src={c.avatar}
                    alt={c.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BsPerson size={24} className="text-primary-dark" />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-md"></span>
            </div>
            <div className="text-xs lg:text-sm">
              <p className="font-semibold text-primary-dark">{c.name}</p>
              <p className="text-xs text-gray-500">{c.subject}</p>
              <p className="text-xs text-gray-400">{c.lastActive}</p>
            </div>
          </div>
        ))} */}
      </CardContent>
    </Card>
  );
};
