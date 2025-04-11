"use client";

// import { MdArrowForwardIos } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getListNotificationByClass } from "@/app/lib/services/notification";
import { NotificationItem } from "@/app/types";

const Notification = ({ classId }: { classId: string }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  // const searchParams = useSearchParams();
  const router = useRouter();

  // Lấy trạng thái từ URL (mặc định là đóng)
  // const showDetailParam = searchParams.get("showDetail") === "true";
  // const [showDetail, setShowDetail] = useState<boolean>(showDetailParam);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getListNotificationByClass(classId);
      setNotifications(data);
    };
    fetchData();
  }, []);

  // const handleToggleDetail = () => {
  //   setShowDetail(!showDetail);
  //   router.push(`?showDetail=${!showDetail}`, { scroll: false });
  // };

  return (
    // <div className="flex flex-col border border-gray-200 shadow-sm rounded-3xl">
    //   <div className="flex justify-between bg-white p-6 px-8 rounded-3xl">
    //     <h2 className="flex items-center text-[22px] font-bold">
    //       📢 Thông báo
    //     </h2>
    //     <div
    //       className={`flex justify-center items-center p-3 bg-gray-50 border border-gray-200 text-primary-darkest
    //       rounded-2xl cursor-pointer h-fit hover:border-primary-darkest transition-transform duration-300 ${
    //         showDetail ? "rotate-90" : ""
    //       }`}
    //       onClick={handleToggleDetail}
    //     >
    //       <MdArrowForwardIos />
    //     </div>
    //   </div>
    //   <div
    //     className={`bg-white ease-in-out overflow-hidden transition-transform origin-top duration-300
    //       rounded-b-3xl
    //       ${showDetail ? "scale-y-100" : "scale-y-0 h-0"}`}
    //   >
    <>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="flex justify-between px-14  py-2 hover:bg-gray-100 items-center"
        >
          <p
            className="text-[17px] text-primary-dark cursor-pointer hover:text-primary-darkest"
            onClick={() => {
              sessionStorage.setItem(
                "scrollPosition",
                window.scrollY.toString(),
              );
              router.push(
                `/teacher/classes/${classId}/notification/${notification.id}`,
              );
            }}
          >
            {notification.title}
          </p>
          <div className="flex flex-col mr-4">
            <p>{notification.sender.name}</p>
            <p>
              {new Date(notification.sendDate).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      ))}
      <div className="text-primary-darker mx-10 my-6 cursor-pointer hover:text-primary-darkest flex items-center">
        <IoIosAdd className="text-[30px] text-purple-800 mb-1" />
        Thêm thông báo
      </div>
    </>
  );
};

export default Notification;
