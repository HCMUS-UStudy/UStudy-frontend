"use client";

import React, { useEffect, useState } from "react";
import ProfileHeader from "@/app/ui/components/_common/profile/ProfileHeader";
import ProfileInfoGrid from "@/app/ui/components/_common/profile/ProfileInfoGrid";
import ProfileLoadingSkeleton from "@/app/ui/components/_common/profile/ProfileLoadingSkeleton";
import { getUserDataFromCookies } from "@/app/lib/action";
import { Child } from "@/app/store/ChildrenSlice";
import { FiUsers, FiMail, FiPhone } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { getProfile } from "@/app/lib/services";
import { useQuery } from "@tanstack/react-query";
import { useCustomToast } from "@/app/lib/hooks/useToast";

const MemberProfilePage: React.FC = () => {
  const [defaultRoute, setDefaultRoute] = useState<string>("");
  const { children } = useSelector((state: RootState) => state.children);
  const { addToast } = useCustomToast();

  const { data: user, isLoading } = useQuery({
    queryKey: ["UserProfile"],
    queryFn: () => getProfile(),
  });

  const fetchData = async () => {
    try {
      const userData = await getUserDataFromCookies();
      setDefaultRoute(userData?.role.defaultRoute || "");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      addToast.error(e || "Lỗi khi lấy dữ liệu người dùng");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <ProfileLoadingSkeleton />;
  }

  if (defaultRoute === "STUDENT") {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-3xl shadow-lg">
          <ProfileHeader user={user} />
          <ProfileInfoGrid user={user} />
        </div>
      </div>
    );
  }

  if (defaultRoute === "PARENT") {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-3xl shadow-lg">
          <ProfileHeader user={user} />
          <ProfileInfoGrid user={user} />

          {/* Children List Section */}
          <div className="border-t">
            <div className="px-10 py-6">
              <div className="flex items-center gap-2 mb-6">
                <FiUsers className="text-primary text-xl" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Danh sách con
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {children?.map((child: Child) => (
                  <div
                    key={child.id}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-semibold text-lg">
                          {child.name.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {child.name}
                        </h4>
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <FiMail
                              className="text-primary shrink-0"
                              size={14}
                            />
                            <span className="truncate">
                              {child.email || "Không có"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <FiPhone
                              className="text-primary shrink-0"
                              size={14}
                            />
                            <span className="truncate">
                              {child.phone || "Không có"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {(!children || children.length === 0) && (
                <div className="text-center py-6 text-gray-500">
                  Chưa có con nào được liên kết
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MemberProfilePage;
