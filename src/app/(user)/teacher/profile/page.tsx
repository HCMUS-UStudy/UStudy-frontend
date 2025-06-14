"use client";

import React, { useEffect, useState } from "react";
import { UserProfile } from "@/app/types";
import { getProfle } from "@/app/lib/services/user";
import ProfileHeader from "@/app/ui/components/_common/profile/ProfileHeader";
import ProfileInfoGrid from "@/app/ui/components/_common/profile/ProfileInfoGrid";
import ProfileLoadingSkeleton from "@/app/ui/components/_common/profile/ProfileLoadingSkeleton";

const TeacherProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const userInfo = await getProfle();
      setUser(userInfo.data);
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl shadow-lg">
        <ProfileHeader user={user} onSuccess={fetchData} />
        <ProfileInfoGrid user={user} />
      </div>
    </div>
  );
};

export default TeacherProfilePage;
