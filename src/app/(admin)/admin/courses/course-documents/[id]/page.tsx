"use client";

import { Button } from "@/app/ui/components/common/Button";
import React, { useEffect } from "react";

import GradeGrid from "@/app/ui/components/GradeAdmin/GradeGrid";
import { SearchField } from "@/app/ui/components/common/Input";
import { Select, SelectItem } from "@/app/ui/components/common/Select";
import { useBreadcrumbContext } from "@/app/context/BreadcrumbContext";
import { useCourseAdminContext } from "@/app/context/CourseAdminContext";
import { useParams, useSearchParams } from "next/navigation";
import { getCourseById } from "@/app/lib/services/course";

export default function CourseDocumentsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  // const searchParams = await props.searchParams;
  // const query = searchParams?.query || "";
  //
  // const id = await props.params;
  // const resolvedSearchParams = React.use(searchParams);
  // const query = resolvedSearchParams?.query || "";
  // const searchParams = useSearchParams();
  // const query = searchParams.get("query") || "";

  // Await the params to get access to the properties
  const { id } = useParams<{ id: string }>();

  // if (!id) {
  //   // Render a loading state when courseId or subject is null
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <span className="text-xl text-gray-600">Loading...</span>
  //     </div>
  //   );
  // }
  const { setDynamicBreadcrumbs } = useBreadcrumbContext();
  const { courseName, setCourseName } = useCourseAdminContext();

  useEffect(() => {
    // Get course by id
    const fetchCourseData = async () => {
      try {
        const res = await getCourseById(id);
        // setCourse(res);
        setCourseName(res.name);
        setDynamicBreadcrumbs([res.name]);
      } catch (error) {
        console.error(error);
      }
    };
    if (courseName) {
      setDynamicBreadcrumbs([courseName]);
    } else {
      fetchCourseData();
    }
  }, [courseName]);

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      {/*<BreadCrumb courseId={id} subject={subject} />*/}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Tài liệu môn {courseName}
      </h1>

      {/* Search and Filter Section */}
      <div className="flex justify-end items-center space-x-4 mb-6">
        <div className="flex items-center space-x-4">
          <SearchField
            className="w-[200px]"
            placeholder="Tìm theo tên khối học..."
          />
          {/*<select className="px-4 py-2 border border-gray-300 rounded-md">
            <option value="">Tất cả khối học</option>
            <option value="Chapter">Khối 1</option>
            <option value="Exercises">Khối 2</option>
          </select>*/}
          <Select className="w-[200px]" defaultLabel="Tất cả khối học">
            <SelectItem value="">Tất cả khối học</SelectItem>
            <SelectItem value="Chapter">Khối 1</SelectItem>
            <SelectItem value="Exercises">Khối 2</SelectItem>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mb-4">
        <Button type="button" className="pl-6 pr-6">
          Tạo khối học
        </Button>
      </div>

      <GradeGrid searchQuery={query} courseId={id} />
    </div>
  );
}
