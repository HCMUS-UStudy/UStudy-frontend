"use client";

import { useState, useEffect } from "react";
import { NotificationItem } from "@/app/types";
import { getNotificationDetails } from "@/app/lib/services/notification";
import Loading from "@/app/ui/components/_common/loading/Loading";
import { useParams, useRouter } from "next/navigation";
import { IoReturnUpBack } from "react-icons/io5";
import { useQueryClient } from "@tanstack/react-query";

const SingleNotification = () => {
  const [notification, setNotification] = useState<NotificationItem | null>(
    null,
  );
  const queryClient = useQueryClient();
  const params = useParams();
  const notificationId = params?.notificationId ?? "";
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNotificationDetails(notificationId as string);
      // Invalidate the query to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      setNotification(data);
      setLoading(false);
    };
    fetchData();
  }, [notificationId, queryClient]);

  return (
    <div className="p-6">
      <button
        onClick={() => {
          router.push(`/admin/notifications`);
        }}
        className="flex items-center space-x-2 text-primary-dark hover:text-primary-darkest mb-4"
      >
        <IoReturnUpBack className="text-[22px]" />
        <span>Trở về</span>
      </button>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col space-y-8 p-4">
          <div className="flex flex-col space-y-2">
            <div className="text-primary-darkest text-[26px]">
              {notification?.title}
            </div>
            <div className="flex gap-2">
              <div className="flex gap-1 text-gray-500">
                đăng bởi
                <div className="text-primary-darker">
                  {notification?.sender.name}
                </div>
              </div>
              {"-"}
              <div className="flex gap-1">
                <div className="text-gray-500">
                  {notification?.sendDate
                    ? new Date(notification.sendDate)
                        .toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        .replace("am", "AM")
                        .replace("pm", "PM")
                    : "Unknown date"}
                </div>
              </div>
            </div>
          </div>
          <p>
            {notification?.content.split("\\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
};

export default SingleNotification;
