/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getListMaterial,
  createFolder,
  getPreview,
  downloadMaterial,
  uploadMaterial,
  deleteMaterial,
} from "@/app/lib/services/personal-material";

// Mock axios instance
jest.mock("@/app/lib/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockAxios = require("@/app/lib/axios").default;

describe("Personal Material Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getListMaterial", () => {
    it("fetches material list with null folderId", async () => {
      const mockResponse = {
        data: {
          data: {
            content: [
              {
                id: "1",
                material: {
                  id: "mat1",
                  name: "document.pdf",
                  uploadedBy: { name: "Teacher Name" },
                  type: "FILE",
                  uploadDate: "2024-01-01T00:00:00Z",
                  filePath: "/path/to/file",
                },
                lastModified: "2024-01-01T00:00:00Z",
              },
            ],
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getListMaterial(null);

      expect(mockAxios.get).toHaveBeenCalledWith("/personal-material/list", {
        params: {
          folderId: null,
          page: 0,
          limit: 100,
          filter: "",
        },
      });
      expect(result).toEqual(mockResponse.data.data);
    });

    it("fetches material list with specific folderId", async () => {
      const mockResponse = {
        data: {
          data: {
            content: [],
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getListMaterial("folder123");

      expect(mockAxios.get).toHaveBeenCalledWith("/personal-material/list", {
        params: {
          folderId: "folder123",
          page: 0,
          limit: 100,
          filter: "",
        },
      });
      expect(result).toEqual(mockResponse.data.data);
    });

    it("handles API errors", async () => {
      const error = new Error("API Error");
      mockAxios.get.mockRejectedValue(error);

      await expect(getListMaterial(null)).rejects.toThrow("API Error");
    });
  });

  describe("createFolder", () => {
    it("creates folder with null parentId", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "Folder created successfully",
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await createFolder("New Folder", null);

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/personal-material/create-folder",
        {
          name: "New Folder",
          parentId: null,
        },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("creates folder with specific parentId", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "Folder created successfully",
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await createFolder("Sub Folder", "parent123");

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/personal-material/create-folder",
        {
          name: "Sub Folder",
          parentId: "parent123",
        },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("handles API errors", async () => {
      const error = new Error("API Error");
      mockAxios.post.mockRejectedValue(error);

      await expect(createFolder("New Folder", null)).rejects.toThrow(
        "API Error",
      );
    });
  });

  describe("getPreview", () => {
    it("gets file preview", async () => {
      const mockBlob = new Blob(["test content"], { type: "application/pdf" });
      const mockResponse = {
        data: mockBlob,
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getPreview("material123");

      expect(mockAxios.get).toHaveBeenCalledWith(
        "/material/preview/material123",
        {
          responseType: "blob",
        },
      );
      expect(result).toEqual(mockBlob);
    });

    it("handles API errors", async () => {
      const error = new Error("API Error");
      mockAxios.get.mockRejectedValue(error);

      await expect(getPreview("material123")).rejects.toThrow("API Error");
    });
  });

  describe("downloadMaterial", () => {
    it("downloads material file", async () => {
      const mockBlob = new Blob(["test content"], { type: "application/pdf" });
      const mockResponse = {
        data: mockBlob,
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await downloadMaterial("material123");

      expect(mockAxios.get).toHaveBeenCalledWith(
        "/personal-material/download/material123",
        {
          responseType: "blob",
        },
      );
      expect(result).toEqual(mockBlob);
    });

    it("handles API errors", async () => {
      const error = new Error("API Error");
      mockAxios.get.mockRejectedValue(error);

      await expect(downloadMaterial("material123")).rejects.toThrow(
        "API Error",
      );
    });
  });

  describe("uploadMaterial", () => {
    it("uploads material file", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "File uploaded successfully",
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const formData = new FormData();
      formData.append("description", "Test file");
      formData.append("file", new File(["test"], "test.pdf"));

      const result = await uploadMaterial(formData);

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/personal-material/upload-file",
        formData,
        {
          headers: {
            "Content-Type": "form-data",
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("uploads material file with parentId", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "File uploaded successfully",
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const formData = new FormData();
      formData.append("description", "Test file");
      formData.append("file", new File(["test"], "test.pdf"));
      formData.append("parentId", "folder123");

      const result = await uploadMaterial(formData);

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/personal-material/upload-file",
        formData,
        {
          headers: {
            "Content-Type": "form-data",
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("handles API errors", async () => {
      const error = new Error("API Error");
      mockAxios.post.mockRejectedValue(error);

      const formData = new FormData();
      formData.append("description", "Test file");
      formData.append("file", new File(["test"], "test.pdf"));

      await expect(uploadMaterial(formData)).rejects.toThrow("API Error");
    });
  });

  describe("deleteMaterial", () => {
    it("deletes material", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "Material deleted successfully",
        },
      };

      mockAxios.delete.mockResolvedValue(mockResponse);

      const result = await deleteMaterial("material123");

      expect(mockAxios.delete).toHaveBeenCalledWith(
        "/personal-material/delete/material123",
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("handles API errors", async () => {
      const error = new Error("API Error");
      mockAxios.delete.mockRejectedValue(error);

      await expect(deleteMaterial("material123")).rejects.toThrow("API Error");
    });
  });

  describe("Service Integration", () => {
    it("performs complete CRUD operations", async () => {
      // Mock all responses
      const listResponse = {
        data: {
          data: {
            content: [
              {
                id: "1",
                material: {
                  id: "mat1",
                  name: "test.pdf",
                  uploadedBy: { name: "Teacher" },
                  type: "FILE",
                  uploadDate: "2024-01-01T00:00:00Z",
                  filePath: "/path/to/file",
                },
                lastModified: "2024-01-01T00:00:00Z",
              },
            ],
          },
        },
      };

      const createResponse = {
        data: { success: true, message: "Folder created" },
      };

      const uploadResponse = {
        data: { success: true, message: "Folder created" },
      };

      const deleteResponse = {
        data: { success: true, message: "Material deleted" },
      };

      mockAxios.get.mockResolvedValue(listResponse);
      mockAxios.post.mockResolvedValue(createResponse);
      mockAxios.delete.mockResolvedValue(deleteResponse);

      // Test complete workflow
      const materials = await getListMaterial(null);
      expect(materials).toEqual(listResponse.data.data);

      const folder = await createFolder("Test Folder", null);
      expect(folder).toEqual(createResponse.data);

      const formData = new FormData();
      formData.append("description", "Test file");
      formData.append("file", new File(["test"], "test.pdf"));

      const upload = await uploadMaterial(formData);
      expect(upload).toEqual(uploadResponse.data);

      const deleteResult = await deleteMaterial("material123");
      expect(deleteResult).toEqual(deleteResponse.data);
    });

    it("handles network errors gracefully", async () => {
      const networkError = new Error("Network Error");
      mockAxios.get.mockRejectedValue(networkError);
      mockAxios.post.mockRejectedValue(networkError);
      mockAxios.delete.mockRejectedValue(networkError);

      await expect(getListMaterial(null)).rejects.toThrow("Network Error");
      await expect(createFolder("Test", null)).rejects.toThrow("Network Error");
      await expect(deleteMaterial("123")).rejects.toThrow("Network Error");
    });

    it("validates input parameters", async () => {
      // Test with empty folder name
      await expect(createFolder("", null)).rejects.toThrow();

      // Test with invalid material ID
      await expect(deleteMaterial("")).rejects.toThrow();

      // Test with null material ID
      await expect(deleteMaterial(null as any)).rejects.toThrow();
    });
  });
});
