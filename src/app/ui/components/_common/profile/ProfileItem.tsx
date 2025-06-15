import React from "react";

const ProfileItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) => {
  return (
    <div className="flex items-start gap-4 bg-gray-50 p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
      <div className="text-primary-darker mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value || "N/A"}</p>
      </div>
    </div>
  );
};

export default ProfileItem;
