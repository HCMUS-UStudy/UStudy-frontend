import { UserSummary } from "./common";

export type PersonalMaterialItem = {
  id: string;
  material: {
    id: string;
    name: string;
    uploadedBy: UserSummary;
    type: string;
    uploadDate: string;
    filePath: string;
  };
  lastModified: string;
};
