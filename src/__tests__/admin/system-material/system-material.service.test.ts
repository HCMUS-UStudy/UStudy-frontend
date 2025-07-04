import * as systemMaterialService from "@/app/lib/services/system-material";
import axiosInstance from "@/app/lib/axios";

// Mock axios instance
jest.mock("@/app/lib/axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

const mockAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe("System Material Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getListMaterial", () => {
    it("should fetch material list with folder ID", async () => {
      const mockResponse = {
        data: {
          data: {
            content: [
              {
                id: "material1",
                material: {
                  id: "mat1",
                  name: "test.pdf",
                  type: "FILE",
                },
              },
            ],
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await systemMaterialService.getListMaterial("folder123");

      expect(mockAxios.get).toHaveBeenCalledWith("/system-material/list", {
        params: {
          folderId: "folder123",
          page: 0,
          limit: 100,
          filter: "",
        },
      });
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle null folder ID", async () => {
      const mockResponse = {
        data: {
          data: {
            content: [],
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      await systemMaterialService.getListMaterial(null);

      expect(mockAxios.get).toHaveBeenCalledWith("/system-material/list", {
        params: {
          folderId: null,
          page: 0,
          limit: 100,
          filter: "",
        },
      });
    });

    it("should handle API errors", async () => {
      const errorMessage = "Failed to fetch materials";
      mockAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(
        systemMaterialService.getListMaterial("folder123"),
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("getListByCourseGrade", () => {
    it("should fetch materials by course and grade", async () => {
      const mockResponse = {
        data: {
          data: {
            content: [
              {
                id: "material1",
                material: {
                  id: "mat1",
                  name: "test.pdf",
                  type: "FILE",
                },
              },
            ],
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await systemMaterialService.getListByCourseGrade(
        "course123",
        "grade456",
      );

      expect(mockAxios.get).toHaveBeenCalledWith(
        "/system-material/list-course-grade",
        {
          params: {
            page: 0,
            limit: 100,
            courseId: "course123",
            gradeId: "grade456",
          },
        },
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle API errors", async () => {
      const errorMessage = "Failed to fetch materials by course grade";
      mockAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(
        systemMaterialService.getListByCourseGrade("course123", "grade456"),
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("getPreview", () => {
    it("should fetch material preview", async () => {
      const mockBlob = new Blob(["test content"], { type: "application/pdf" });
      const mockResponse = {
        data: mockBlob,
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await systemMaterialService.getPreview("material123");

      expect(mockAxios.get).toHaveBeenCalledWith(
        "/material/preview/material123",
        {
          responseType: "blob",
        },
      );
      expect(result).toEqual(mockBlob);
    });

    it("should handle API errors", async () => {
      const errorMessage = "Failed to fetch preview";
      mockAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(
        systemMaterialService.getPreview("material123"),
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("downloadMaterial", () => {
    it("should download material", async () => {
      const mockBlob = new Blob(["test content"], { type: "application/pdf" });
      const mockResponse = {
        data: mockBlob,
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result =
        await systemMaterialService.downloadMaterial("material123");

      expect(mockAxios.get).toHaveBeenCalledWith(
        "/system-material/download/material123",
        {
          responseType: "blob",
        },
      );
      expect(result).toEqual(mockBlob);
    });

    it("should handle API errors", async () => {
      const errorMessage = "Failed to download material";
      mockAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(
        systemMaterialService.downloadMaterial("material123"),
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("createFolder", () => {
    it("should create a new folder", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: "folder123",
            name: "New Folder",
          },
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await systemMaterialService.createFolder(
        "New Folder",
        "parent123",
        "course123",
        "grade456",
      );

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/system-material/create-folder",
        {
          name: "New Folder",
          parentId: "parent123",
          courseId: "course123",
          gradeId: "grade456",
        },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should create a root folder when parentId is null", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: "folder123",
            name: "Root Folder",
          },
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      await systemMaterialService.createFolder(
        "Root Folder",
        null,
        "course123",
        "grade456",
      );

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/system-material/create-folder",
        {
          name: "Root Folder",
          parentId: null,
          courseId: "course123",
          gradeId: "grade456",
        },
      );
    });

    it("should handle API errors", async () => {
      const errorMessage = "Failed to create folder";
      mockAxios.post.mockRejectedValue(new Error(errorMessage));

      await expect(
        systemMaterialService.createFolder(
          "New Folder",
          "parent123",
          "course123",
          "grade456",
        ),
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("uploadMaterial", () => {
    it("should upload a material file", async () => {
      const mockFormData = new FormData();
      mockFormData.append("file", new File(["test"], "test.pdf"));
      mockFormData.append("courseId", "course123");
      mockFormData.append("gradeId", "grade456");

      const mockResponse = {
        data: {
          success: true,
          data: {
            id: "material123",
            name: "test.pdf",
          },
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await systemMaterialService.uploadMaterial(mockFormData);

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/system-material/upload-file",
        mockFormData,
        {
          headers: {
            "Content-Type": "form-data",
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle API errors", async () => {
      const errorMessage = "Failed to upload material";
      mockAxios.post.mockRejectedValue(new Error(errorMessage));

      const mockFormData = new FormData();
      await expect(
        systemMaterialService.uploadMaterial(mockFormData),
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("deleteMaterial", () => {
    it("should delete a material", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "Material deleted successfully",
        },
      };

      mockAxios.delete.mockResolvedValue(mockResponse);

      const result = await systemMaterialService.deleteMaterial("material123");

      expect(mockAxios.delete).toHaveBeenCalledWith(
        "/system-material/delete/material123",
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle API errors", async () => {
      const errorMessage = "Failed to delete material";
      mockAxios.delete.mockRejectedValue(new Error(errorMessage));

      await expect(
        systemMaterialService.deleteMaterial("material123"),
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("Service integration tests", () => {
    it("should handle network errors gracefully", async () => {
      mockAxios.get.mockRejectedValue(new Error("Internal server error"));
      await expect(
        systemMaterialService.getListMaterial("folder123"),
      ).rejects.toThrow();
    });

    it("should handle timeout errors", async () => {
      mockAxios.get.mockRejectedValue(new Error("Request timeout"));
      await expect(
        systemMaterialService.getListMaterial("folder123"),
      ).rejects.toThrow();
    });

    it("should handle 404 errors", async () => {
      mockAxios.get.mockRejectedValue(new Error("Material not found"));
      await expect(
        systemMaterialService.getListMaterial("nonexistent"),
      ).rejects.toThrow();
    });

    it("should handle 403 errors", async () => {
      mockAxios.get.mockRejectedValue(new Error("Access denied"));
      await expect(
        systemMaterialService.getListMaterial("folder123"),
      ).rejects.toThrow();
    });
  });
});
