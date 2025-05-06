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
      createdBy: {
        id: string;
        genId: string;
        email: string;
        name: string;
        avatar: string;
      };
    };
  };
  material: {
    id: string;
    name: string;
    uploadedBy: {
      id: string;
      genId: string;
      email: string;
      name: string;
      avatar: string;
    };
    type: "FILE" | "FOLDER";
    uploadDate: string;
    filePath: string;
    lastModified: string;
  };
  lastModified: string;
};
