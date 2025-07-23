"use client";
import { getClassById } from "@/app/lib/services/class";
import React, { useEffect } from "react";
import { BsFillBookFill } from "react-icons/bs";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function ClassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { classId } = await params;
  // const classDetail = await getClassById(classId);

  const params = useParams<{ classId: string }>();
  const classId = params?.classId as string;

  const router = useRouter();

  const { data: classDetail } = useQuery({
    queryKey: ["ClassDetails"],
    queryFn: () => getClassById(classId),
    refetchOnWindowFocus: false,
  });
  // const [currentTab, setCurrentTab] = useState<keyof typeof tabs>("overview");
  const pathname = usePathname();

  useEffect(() => {}, [pathname]);

  if (pathname?.includes("/forum") || pathname?.includes("/assignment/")) {
    return <>{children}</>;
  }

  const tabs = {
    overview: "Tổng quan",
    participant: "Thành viên",
    material: "Tài liệu",
    assignment: "Bài tập & Kiểm tra",
  };

  const handleTabChange = (id: string) => {
    const classId = pathname?.split("/")[3];
    // setCurrentTab(id as keyof typeof tabs);
    router.push(`/member/classes/${classId}/${id}`);
  };

  // const currentTab = pathname?.split("/")[4] || "overview";
  // const currentTabLabel =
  //   tabs.find((tab) => tab.id === currentTab)?.label || "Tổng quan";

  const layout = (
    <>
      <div className="border-b border-primary-light">
        <div className="flex items-center space-x-4 mb-3">
          <div className="bg-highlight-text hidden md:flex text-white p-3 rounded-lg shadow">
            <BsFillBookFill className="size-6" />
          </div>
          <div className="flex items-center space-x-4">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-darkest">
              {classDetail?.course.name
                ? `Lớp ${classDetail?.name} - ${classDetail?.course.name} ${classDetail?.grade.name}`
                : classDetail?.name}
            </h1>
            {/* <div className="md:flex hidden items-center space-x-1">
              {displayedMembers.map((member) => (
                <Image
                  width={32}
                  height={32}
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full border-2 border-primary-light shadow-md"
                />
              ))}
              {remainingCount > 0 && (
                <div className="w-10 h-10 rounded-full bg-primary text-primary-darkest flex items-center justify-center text-sm font-bold border-2 border-primary-light shadow-md">
                  +{remainingCount}
                </div>
              )}
            </div> */}
          </div>
        </div>
        {/* <ClassNavigationBar /> */}

        <>
          <div className="flex gap-5 text-primary-dark text-sm sm:text-base md:text-lg font-medium">
            {Object.entries(tabs).map(([id, label]) => (
              <label
                key={id}
                htmlFor={id}
                className="relative group cursor-pointer hover:text-highlight-text has-[:checked]:hover:text-primary-dark transition-all duration-300 py-1.5 px-4 has-[:checked]:text-primary-darkest has-[:checked]:font-bold"
              >
                <input
                  id={id}
                  type="radio"
                  name="ClassTabs"
                  className="hidden peer"
                  onChange={() => handleTabChange(id)}
                  checked={pathname?.split("/")[4] === id}
                />
                {label}
                <span className="absolute inset-0 border-b-2 border-primary scale-x-0 group-hover:scale-x-100 transition-all duration-300 peer-checked:border-primary-darkest peer-checked:scale-x-100"></span>
              </label>
            ))}
          </div>

          {/* <div className="md:hidden">
            <Select
              defaultLabel={tabs[currentTab]}
              className="bg-primary-lighter"
              onValueChange={(value) => handleTabChange(value as string)}
              showClearButton={false}
            >
              {Object.entries(tabs).map(([id, label]) => (
                <SelectItem key={id} value={id}>
                  {label}
                </SelectItem>
              ))}
            </Select>
          </div> */}
        </>
      </div>
      <div className="mt-3">{children}</div>
    </>
  );

  return layout;
}
