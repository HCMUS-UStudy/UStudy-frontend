"use client";

import { IoIosAdd, IoMdMore } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  getListNotificationByClass,
  deleteClassNotiForUser,
} from "@/app/lib/services/notification";
import { NotificationItem, UserData } from "@/app/types";
import { useParams } from "next/navigation";
import Image from "next/image";
import NotificationModal from "@/app/ui/components/user/teacher/NotificationModal";
import Checkbox from "@/app/ui/components/_common/Checkbox";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import { RiDeleteBinLine } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { getUserDataFromCookies } from "@/app/lib/action";
import Loading from "@/app/ui/components/_common/loading/Loading";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { Button } from "@/app/ui/components/_common/Button";
import EmptyListOrTable from "@/app/ui/components/_common/EmptyListOrTable";

const Notification = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  // const params = useParams<{ classId: string }>();
  // const classId = params?.classId as string;

  const params = useParams<{ classId: string }>();
  const classId = params?.classId as string;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [popupId, setPopupId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [updatingNotification, setUpdatingNotification] =
    useState<NotificationItem | null>(null);
  const [deleteItem, setShowDeleteModal] = useState<string[]>([]);

  const [userData, setUserData] = useState<UserData | null>(null);
  const { addToast } = useCustomToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserDataFromCookies();
      setUserData(data);
    };
    fetchUserData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const data = await getListNotificationByClass(classId as string);
      setNotifications(
        data.sort(
          (a: NotificationItem, b: NotificationItem) =>
            new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime(),
        ),
      );
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchData();
  }, [classId, isOpen, fetchData]);

  const handleDelete = useCallback(
    async (ids: string[]) => {
      try {
        await deleteClassNotiForUser(classId, ids);
        fetchData();
        addToast.success("Xóa thông báo thành công");
      } catch {
        addToast.error("Xóa thông báo thất bại");
      }
    },
    [classId, fetchData, addToast],
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setPopupId(null);
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (popupId) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [popupId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-5">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col px-3">
      <div className="flex items-center justify-between my-4 mx-1">
        <Button onClick={() => setIsOpen(true)}>
          <IoIosAdd className="hidden sm:flex text-[19px]" /> Thêm thông báo
        </Button>
        {/* <div
          className="gap-1 cursor-pointer hover:bg-primary-lighter
        flex items-center border border-gray-300 w-fit rounded-xl p-2"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <IoIosAdd className="hidden sm:flex text-[19px]" />
          <span className="text-[13px] sm:text-[15px] text-gray-700">
            Thêm thông báo
          </span>
        </div> */}
        <div className="flex items-center px-2 w-fit text-[14px] sm:text-[15px] gap-3">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-4">
              <span
                className="text-red-500 hover:text-red-700 cursor-pointer hidden sm:flex"
                onClick={() => {
                  setShowDeleteModal(selectedIds);
                }}
              >
                Xóa
              </span>
              <span
                className="text-primary-darker hover:text-primary-darkest cursor-pointer hidden sm:flex"
                onClick={() => {
                  setSelectedIds([]);
                }}
              >
                Hủy chọn
              </span>
              <div className="sm:hidden flex items-center">
                <Tooltip text="Xóa">
                  <RiDeleteBinLine
                    className="text-[20px] text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => {
                      setShowDeleteModal(selectedIds);
                    }}
                  />
                </Tooltip>
              </div>
              <div className="sm:hidden flex items-center">
                <Tooltip text="Hủy chọn">
                  <RxCross1
                    className="text-[17px] text-primary-darker
                  hover:text-primary-darkest cursor-pointer"
                    onClick={() => {
                      setSelectedIds([]);
                    }}
                  />
                </Tooltip>
              </div>
            </div>
          )}
          {notifications.length > selectedIds.length &&
            notifications.some(
              (item) => item.sender.genId === userData?.genId,
            ) && (
              <span
                className="text-primary-darker hover:text-primary-darkest cursor-pointer"
                onClick={() => {
                  setSelectedIds(
                    notifications
                      .filter((item) => item.sender.genId === userData?.genId)
                      .map((item) => item.id),
                  );
                }}
              >
                Chọn tất cả
              </span>
            )}
        </div>
      </div>
      {notifications.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-primary-dark text-white">
              <th className="pl-4 py-2 rounded-tl-lg"></th>
              <th className="text-left text-[14px] sm:text-[16px] text-nowrap px-3 py-2 w-4/9 lg:w-2/3 xl:w-3/4">
                Tiêu đề
              </th>
              <th className="rounded-tr-lg text-left text-[14px] sm:text-[16px] px-3 py-2">
                Thông tin
              </th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr
                key={notification.id}
                className={`cursor-pointer border border-primary-light ${
                  popupId === notification.id
                    ? !notification.read
                      ? "bg-primary-lighter"
                      : ""
                    : !notification.read
                      ? "bg-primary-lighter hover:bg-primary-light"
                      : "hover:bg-primary-lighter"
                }`}
                onClick={() => {
                  if (!notification.read) {
                    notification.read = true;
                  }
                  router.push(
                    `/admin/classes/${classId}/notifications/${notification.id}`,
                  );
                }}
              >
                <td className="pl-4 py-3">
                  {notification.sender.genId === userData?.genId && (
                    <div
                      className="flex cursor-pointer items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Tooltip text="Chọn">
                        <Checkbox
                          checked={selectedIds.includes(notification.id)}
                          onChange={(checked) => {
                            if (checked) {
                              setSelectedIds((prev) => [
                                ...prev,
                                notification.id,
                              ]);
                            } else {
                              setSelectedIds((prev) =>
                                prev.filter((id) => id !== notification.id),
                              );
                            }
                          }}
                        />
                      </Tooltip>
                    </div>
                  )}
                </td>
                <td className="px-3 py-3 text-left text-primary-darkest">
                  <span className="text-[13px] sm:text-[15px]">
                    {notification.title}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src={notification.sender.avatar}
                        alt="notification"
                        width={35}
                        height={35}
                        className="rounded-full w-6 h-6 sm:w-8 sm:h-8"
                      />
                      <div className="flex flex-col">
                        <div className="text-[12px] sm:text-[14px]">
                          {notification.sender.name}
                        </div>
                        <div className="text-[12px] sm:text-[14px]">
                          {new Date(notification.sendDate).toLocaleString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </div>
                    </div>

                    {notification.sender.genId === userData?.genId && (
                      <div className="relative ml-auto">
                        <div
                          className="flex items-center text-gray-600 text-[17px]
                          sm:text-[19px] cursor-pointer hover:bg-gray-300 rounded-full"
                        >
                          <Tooltip text="Tùy chọn">
                            <IoMdMore
                              onClick={(e) => {
                                e.stopPropagation();
                                setPopupId(
                                  notification.id === popupId
                                    ? null
                                    : notification.id,
                                );
                              }}
                            />
                          </Tooltip>
                        </div>
                        {popupId === notification.id && (
                          <div
                            className="absolute right-0 mt-1 w-28 bg-white border border-gray-300
                            rounded-lg shadow-lg z-10 overflow-auto"
                            onClick={(e) => e.stopPropagation()}
                            ref={dropdownRef}
                          >
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                setUpdatingNotification(notification);
                                setIsOpen(true);
                                setPopupId(null);
                              }}
                            >
                              Chỉnh sửa
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              onClick={() => {
                                setShowDeleteModal([notification.id]);
                                setPopupId(null);
                              }}
                            >
                              Xóa
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <EmptyListOrTable />
        </>
      )}
      {isOpen && (
        <NotificationModal
          notification={updatingNotification}
          classId={classId}
          onClose={(value: boolean) => {
            setIsOpen(value);
          }}
        />
      )}

      {deleteItem.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-md sm:text-lg font-bold mb-4">Xác nhận xóa</h2>
            <p className="text-[14px] sm:text-[16px]">
              Bạn có chắc chắn muốn xóa tài liệu này không?
            </p>
            <div className="flex justify-end gap-4 mt-6 text-[13px] sm:text-[15px]">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowDeleteModal([])}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => {
                  handleDelete(deleteItem);
                  setShowDeleteModal([]);
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
