import React from "react";
import { Card } from "../../_common/Card";
import { useQuery } from "@tanstack/react-query";
import { getListNotification } from "@/app/lib/services";
import { Bell } from "lucide-react";
import { AdminNotificationsLoading } from "../../_common/loading";

export default function Notifications() {
  const { data, status } = useQuery({
    queryKey: ["Notifications"],
    queryFn: () => getListNotification(0, 5),
  });
  return (
    <Card className="p-6 bg-foreground border-2 border-slate-200 transition-all duration-300 hover:bg-primary-lighter hover:shadow-lg hover:border-primary-dark">
      <h3 className="text-lg font-semibold mb-4">Thông báo gần đây</h3>
      {status === "pending" ? (
        <AdminNotificationsLoading />
      ) : (
        <div className="grid grid-cols-1 space-y-4">
          {data?.map((noti, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-2 rounded-lg transition-all duration-300 hover:bg-primary-lighter"
            >
              <div className="p-2 bg-blue-50 rounded-full">
                <Bell className="size-5 text-blue-500" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium w-40 max-w-40 truncate">
                    {noti.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {noti.sender.name}
                  </p>
                  <span className="text-sm text-gray-500">
                    {noti.sendDate.split(" ")[0]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{noti.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
