import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageItem, RoomChatItem } from "../types";
import { getAllMessages } from "../lib/services";
import { v4 as uuidv4 } from "uuid";

export const fetchChatHistory = createAsyncThunk(
  "chat/history",
  async (roomId: string) => {
    const response = await getAllMessages(roomId, 0, 100);
    return response.content;
  },
);

export interface ChatState {
  userId: string;
  room: RoomChatItem | null;
  chatHistory: Pick<MessageItem, "id" | "isSender" | "content" | "sendTime">[];
  status: "pending" | "success" | "error";
}

const initialState: ChatState = {
  userId: "",
  room: null,
  chatHistory: [],
  status: "success",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setHistory: (state, action: PayloadAction<MessageItem[]>) => {
      state.chatHistory = [...action.payload];
    },
    addMessage: (
      state,
      action: PayloadAction<{
        content: string;
        isSender: boolean;
      }>,
    ) => {
      const newMsg: Pick<
        MessageItem,
        "id" | "isSender" | "content" | "sendTime"
      > = {
        id: uuidv4(),
        isSender: action.payload.isSender,
        content: action.payload.content,
        sendTime: new Date().toISOString(),
      };
      const _history = [...state.chatHistory, newMsg];
      state.chatHistory = _history;
    },
    setRoom: (state, action: PayloadAction<RoomChatItem>) => {
      state.room = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChatHistory.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(
      fetchChatHistory.fulfilled,
      (state, action: PayloadAction<MessageItem[]>) => {
        state.status = "success";
        const updateMessages = [...action.payload].map((item) => ({
          id: uuidv4(),
          isSender: item.isSender,
          content: item.content,
          sendTime: item.sendTime,
        }));
        state.chatHistory = updateMessages;
      },
    );
    builder.addCase(fetchChatHistory.rejected, (state) => {
      state.status = "error";
      state.chatHistory = [];
    });
  },
});

export const { setUserId, setHistory, addMessage, setRoom } = chatSlice.actions;

export default chatSlice.reducer;
