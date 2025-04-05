export type AllChapter = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  course: null;
  grade: null;
};

export type ChapterData = {
  content: ChapterItem[];
  totalPages: number;
};

export type ChapterItem = {
  id: string;
  name: string;
  description: string;
};
