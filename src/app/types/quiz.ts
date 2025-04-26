import { DefaultRoute, GenderType } from "./common";
import { CourseDto } from "./course";
import { GradeItem } from "./grade";

export type QuizData = {
  content: QuizItem[];
  pageNumber: number;
};

export type QuizItem = {
  id: string;
  title: string;
  aclass: {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    grade: GradeItem;
    course: CourseDto;
  };
  startTime: string;
  endTime: string;
  createdBy: {
    id: string;
    genId: string;
    email: string;
    name: string;
    avatar: string;
    gender: GenderType;
    createdAt: string;
    status: "ACTIVE" | "INACTIVE" | "BANNED";
    role: {
      id: string;
      name: "Teacher" | "Student" | "Admin";
      defaultRoute: DefaultRoute;
    };
  };
  completed: boolean;
};

export type QuizReviewData = {
  quizId: string;
  title: string;
  score: number;
  questions: QuestionReview[];
};

export type QuestionReview = {
  questionId: string;
  description: string;
  selectedOption: Option;
  correctOption: Option;
  allOptions: Option[];
  correct: boolean;
};

export type Option = {
  optionId: string;
  description: string;
  correct: boolean;
};
