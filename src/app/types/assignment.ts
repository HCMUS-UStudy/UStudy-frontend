export type ExerciseItem = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  createdBy: {
    id: string;
    genId: string;
    email: string;
    name: string;
    avatar: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    createdAt: string;
    status: "ACTIVE" | "INACTIVE" | "BANNED";
    role: {
      id: string;
      name: "Teacher" | "Student" | "Admin";
      defaultRoute: "ADMIN" | "USER" | "TEACHER";
    };
  };
};

export type AssignmentDetails = {
  id: string;
  title: string;
  description: string;
  filePath: string;
  dueDate: string;
  createdBy: {
    id: string;
    genId: string;
    email: string;
    name: string;
    avatar: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    createdAt: string;
    status: "ACTIVE" | "INACTIVE" | "BANNED";
    role: {
      id: string;
      name: string;
      defaultRoute: string;
    };
  };
};
