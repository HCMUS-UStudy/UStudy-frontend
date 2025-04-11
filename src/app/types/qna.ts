export type QnA = {
  id: string;
  title: string;
  duration: number; //phút
  aclass: {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
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
      };
    };
  };
  startTime: string;
  endTime: string;
  questions: {
    id: string;
    description: string;
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
      };
    };
    questionType: "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "ESSAY"; // Có thể mở rộng loại câu hỏi
    options?: {
      id: string;
      description: string;
    }[];
    createdAt: string;
  }[];
};
