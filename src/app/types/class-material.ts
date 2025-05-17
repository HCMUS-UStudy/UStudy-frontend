import { UserSummary } from "./common";

export type ClassMaterialItem = {
  id: string;
  cl: {
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
      createdBy: UserSummary;
    };
  };
  material: {
    id: string;
    name: string;
    uploadedBy: UserSummary;
    type: "FILE" | "FOLDER";
    uploadDate: string;
    filePath: string;
    lastModified: string;
  };
  lastModified: string;
};
