"use client";

import React, { useEffect, useState } from "react";
import { UserProfile } from "@/app/types";
import { getProfle } from "@/app/lib/services/user";
import ProfileHeader from "@/app/ui/components/_common/profile/ProfileHeader";
import ProfileInfoGrid from "@/app/ui/components/_common/profile/ProfileInfoGrid";
import ProfileLoadingSkeleton from "@/app/ui/components/_common/profile/ProfileLoadingSkeleton";
import { getUserDataFromCookies } from "@/app/lib/action";
import { Child } from "@/app/store/ChildrenSlice";
import { FiUsers, FiMail, FiPhone } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

const MemberProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [defaultRoute, setDefaultRoute] = useState<string>("");
  const { children } = useSelector((state: RootState) => state.children);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const userInfo = await getProfle();
      setUser(userInfo.data);
      const userData = await getUserDataFromCookies();
      console.log("User data from cookies:", userData); // Debug log
      setDefaultRoute(userData?.role.defaultRoute || "");
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
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
          <ProfileHeader user={user} onSuccess={fetchData} />
          <ProfileInfoGrid user={user} />
        </div>
      </div>
    );
  }

  if (defaultRoute === "PARENT") {
    console.log("Rendering parent view with children:", children); // Debug log
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-3xl shadow-lg">
          <ProfileHeader user={user} onSuccess={fetchData} />
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
