import axiosInstance from "@/app/lib/axios";
import { MaterialData } from "@/app/types";

export const getListMaterial = async (): Promise<MaterialData> => {
  const response = await axiosInstance.get(`/material/personal/list`, {
    params: {
      page: 0,
      limit: 100,
    },
    // id: `getListMaterial`,
  });
  return response.data.data;
};

export const getListMaterialByParent = async (
  folderId: string,
): Promise<MaterialData> => {
  const response = await axiosInstance.get(
    `/material/personal/list/${folderId}`,
    {
      params: {
        page: 0,
        limit: 100,
        filter: "",
      },
      // id: `getListMaterial_${folderId}`,
    },
  );
  return response.data.data;
};

export const getMaterialFilePath = async (materialId: string) => {
  const response = await axiosInstance.get(
    `/material/get_file_path/${materialId}`,
  );
  return response.data;
};

export const getPreview = async (materialId: string) => {
  const response = await axiosInstance.get(`/material/preview/${materialId}`, {
    responseType: "blob",
  });
  return response.data;
};

export const createFolder = async (name: string) => {
  const response = await axiosInstance.post(
    `/material/personal/create-folder`,
    {
      name: name,
    },
    {
      // cache: {
      //   update: {
      //     [`getListMaterial`]: (
      //       cached: any, // eslint-disable-line @typescript-eslint/no-explicit-any
      //       response,
      //     ) => {
      //       if (cached.state !== "cached") {
      //         return "ignore";
      //       }
      //       cached.data.data.data.content.push(response.data.data);
      //       return cached;
      //     },
      //   },
      // },
    },
  );
  return response.data;
};

export const createFolderByParent = async (
  name: string,
  parentId: string | null,
) => {
  const response = await axiosInstance.post(
    `/material/personal/create-folder/${parentId}`,
    {
      name: name,
    },
    {
      // cache: {
      //   update: {
      //     [`getListMaterial_${parentId}`]: (
      //       cached: any, // eslint-disable-line @typescript-eslint/no-explicit-any
      //       response,
      //     ) => {
      //       if (cached.state !== "cached") {
      //         return "ignore";
      //       }
      //       cached.data.data.data.content.push(response.data.data);
      //       return cached;
      //     },
      //   },
      // },
    },
  );
  return response.data;
};

export const uploadMaterial = async (
  data: FormData,
  // parentId: string | null,
) => {
  const response = await axiosInstance.post(`/material/personal/upload`, data, {
    headers: {
      "Content-Type": "form-data",
    },
    // cache: {
    //   update: {
    //     [`getListMaterial`]: (
    //       cached: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    //       response,
    //     ) => {
    //       if (cached.state !== "cached") {
    //         return "ignore";
    //       }
    //       cached.data.data.data.content.push(response.data.data);
    //       return cached;
    //     },
    //   },
    // },
  });
  return response.data;
};

export const uploadMaterialByParent = async (
  data: FormData,
  parentId: string | null,
) => {
  const response = await axiosInstance.post(
    `/material/personal/upload/${parentId}`,
    data,
    {
      headers: {
        "Content-Type": "form-data",
      },
      // cache: {
      //   update: {
      //     [`getListMaterial_${parentId}`]: (
      //       cached: any, // eslint-disable-line @typescript-eslint/no-explicit-any
      //       response,
      //     ) => {
      //       if (cached.state !== "cached") {
      //         return "ignore";
      //       }
      //       cached.data.data.data.content.push(response.data.data);
      //       return cached;
      //     },
      //   },
      // },
    },
  );
  return response.data;
};
