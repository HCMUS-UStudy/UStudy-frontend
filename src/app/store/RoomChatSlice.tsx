import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoomChatItem } from "../types";

const initialState: { rooms: RoomChatItem[] } = {
  rooms: [],
};

const roomChatSlice = createSlice({
  name: "roomChat",
  initialState,
  reducers: {
    setRoomChat: (state, action: PayloadAction<RoomChatItem[]>) => {
      state.rooms = [...action.payload];
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const updatedRooms = state.rooms.map((item) =>
        item.user.id === action.payload ? { ...item, unreadCount: 0 } : item,
      );
      state.rooms = updatedRooms;
    },
  },
});

export const { setRoomChat, markAsRead } = roomChatSlice.actions;

export default roomChatSlice.reducer;
