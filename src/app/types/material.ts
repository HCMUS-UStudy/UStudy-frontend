export type MaterialItem = {
  id: string;
  name: string;
  uploadedBy: {
    id: string;
    genId: string;
    email: string;
    name: string;
  };
  materialType: string;
  type: string;
};

export type MaterialData = {
  content: MaterialItem[];
  totalPages: number;
  totalElements: number;
};
