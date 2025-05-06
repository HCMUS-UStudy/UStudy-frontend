export type PersonalMaterialItem = {
  id: string;
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
    type: string;
    uploadDate: string;
    filePath: string;
  };
  lastModified: string;
};
