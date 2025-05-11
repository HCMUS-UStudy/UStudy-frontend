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
