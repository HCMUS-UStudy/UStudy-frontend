export type ChildClass = {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  teacherName: string;
  scheduleInfo: {
    dayOfWeek: string;
    roomName: string;
    startTime: string;
    endTime: string;
  }[];
  grade: {
    id: string;
    name: string;
  };
  course: {
    id: string;
    name: string;
    createdBy: {
      id: string;
      genId: string;
      email: string;
      name: string;
      avatar: string;
    };
  };
};
