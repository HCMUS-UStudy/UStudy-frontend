import { FiMail, FiPhone, FiUser, FiCalendar, FiMapPin } from "react-icons/fi";
import ProfileItem from "./ProfileItem";
import { UserProfile } from "@/app/types";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? "Invalid Date"
    : date.toLocaleDateString("en-GB");
};

const ProfileInfoGrid = ({ user }: { user: UserProfile | null }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-6 sm:px-10 py-6 bg-white">
      <ProfileItem
        icon={<FiMail size={20} />}
        label="Địa chỉ email"
        value={user?.email}
      />
      <ProfileItem
        icon={<FiPhone size={20} />}
        label="Số điện thoại"
        value={user?.phone}
      />
      <ProfileItem
        icon={<FiUser size={20} />}
        label="Giới tính"
        value={
          user?.gender === "MALE"
            ? "Nam"
            : user?.gender === "FEMALE"
              ? "Nữ"
              : ""
        }
      />
      <ProfileItem
        icon={<FiCalendar size={20} />}
        label="Ngày sinh"
        value={user?.birthday ? formatDate(user.birthday) : undefined}
      />
      <ProfileItem
        icon={<FiMapPin size={20} />}
        label="Địa chỉ"
        value={user?.address}
      />
    </div>
  );
};

export default ProfileInfoGrid;
