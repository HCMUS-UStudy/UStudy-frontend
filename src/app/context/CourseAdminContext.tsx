"use client";

import React from "react";

interface CourseAdminContext {
  courseName: string;
  setCourseName: React.Dispatch<React.SetStateAction<string>>;

  gradeName: string;
  setGradeName: React.Dispatch<React.SetStateAction<string>>;

  chapterName: string;
  setChapterName: React.Dispatch<React.SetStateAction<string>>;
}

const CourseAdminContext = React.createContext<CourseAdminContext | undefined>(
  undefined,
);

export const CourseAdminProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [courseName, setCourseName] = React.useState<string>("");
  const [gradeName, setGradeName] = React.useState<string>("");
  const [chapterName, setChapterName] = React.useState<string>("");

  return (
    <CourseAdminContext.Provider
      value={{
        courseName,
        setCourseName,
        gradeName,
        setGradeName,
        chapterName,
        setChapterName,
      }}
    >
      {children}
    </CourseAdminContext.Provider>
  );
};

export const useCourseAdminContext = () => {
  const context = React.useContext(CourseAdminContext);
  if (!context) {
    throw new Error("useCourseAdminContext error");
  }
  return context;
};
