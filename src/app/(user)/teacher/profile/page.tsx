"use client";

import React from "react";
import ProfileHeader from "@/app/ui/components/_common/profile/ProfileHeader";
import ProfileInfoGrid from "@/app/ui/components/_common/profile/ProfileInfoGrid";
import ProfileLoadingSkeleton from "@/app/ui/components/_common/profile/ProfileLoadingSkeleton";
import { getProfile } from "@/app/lib/services";
import { useQuery } from "@tanstack/react-query";

const TeacherProfilePage: React.FC = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["UserProfile"],
    queryFn: () => getProfile(),
  });

  if (isLoading) {
    return <ProfileLoadingSkeleton />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl shadow-lg">
        <ProfileHeader user={user} />
        <ProfileInfoGrid user={user} />
      </div>
    </div>
  );
};

export default TeacherProfilePage;
