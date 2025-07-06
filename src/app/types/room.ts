export type RoomItem = {
  id: string;
  name: string;
  capacity?: number;
};

export type RoomData = {
  content: RoomItem[];
  totalElements: number;
  totalPages: number;
};

export type Room = {
  id: string;
  name: string;
  capacity?: number;
};

// Pagination response type
export type PaginatedResponse<T> = {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

// API response wrapper
export type ApiResponse<T> = {
  message: string;
  statusCode: string;
  data: T;
};

// Room list response
export type RoomListResponse = ApiResponse<PaginatedResponse<RoomItem>>;

// Room creation/update request
export type RoomRequest = {
  name: string;
  capacity?: number;
};

// Room creation/update response
export type RoomResponse = ApiResponse<RoomItem>;
