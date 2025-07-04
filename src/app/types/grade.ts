export type GradeItem = {
  id: string;
  name: string;
};

export type GradeSchema = {
  name: string;
};

export type GradeData = {
  content: GradeItem[];
  totalPages: number;
};

export type Grade = {
  id: string;
  name: string;
};

export type GradeResponse = Grade & {
  createdBy: {
    id: string;
    genId: string;
    email: string;
    name: string;
    avatar: string;
  };
};
