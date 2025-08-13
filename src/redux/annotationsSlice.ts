import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  PenStroke,
  Tool,
  AnnotationsState,
  HistoryState,
} from "@/types/annotations";

const initialState: AnnotationsState = {
  tool: "none",
  pen: { color: "#ff2d55", width: 4, opacity: 1 },
  strokesHistory: {
    past: [],
    present: [],
    future: [],
  },
};

const push = <T>(h: HistoryState<T>, nextPresent: T): HistoryState<T> => ({
  past: [...h.past, h.present],
  present: nextPresent,
  future: [],
});

const undo = <T>(h: HistoryState<T>): HistoryState<T> => {
  if (h.past.length === 0) return h;
  const prev = h.past[h.past.length - 1];
  return {
    past: h.past.slice(0, -1),
    present: prev,
    future: [h.present, ...h.future],
  };
};

const redo = <T>(h: HistoryState<T>): HistoryState<T> => {
  if (h.future.length === 0) return h;
  const [next, ...rest] = h.future;
  return {
    past: [...h.past, h.present],
    present: next,
    future: rest,
  };
};

export const annotationsSlice = createSlice({
  name: "annotations",
  initialState,
  reducers: {
    setTool(state, action: PayloadAction<Tool>) {
      state.tool = action.payload;
    },
    setPenColor(state, action: PayloadAction<string>) {
      state.pen.color = action.payload;
    },
    setPenWidth(state, action: PayloadAction<number>) {
      state.pen.width = action.payload;
    },
    setPenOpacity(state, action: PayloadAction<number>) {
      state.pen.opacity = action.payload;
    },
    addStroke(state, action: PayloadAction<PenStroke>) {
      const next = [...state.strokesHistory.present, action.payload];
      state.strokesHistory = push(state.strokesHistory, next);
    },
    undoPen(state) {
      state.strokesHistory = undo(state.strokesHistory);
    },
    redoPen(state) {
      state.strokesHistory = redo(state.strokesHistory);
    },
  },
});

export const {
  setTool,
  setPenColor,
  setPenWidth,
  setPenOpacity,
  addStroke,
  undoPen,
  redoPen,
} = annotationsSlice.actions;

export default annotationsSlice.reducer;

// セレクタ（便利用）
export const selectStrokes = (s: { annotations: AnnotationsState }) =>
  s.annotations.strokesHistory.present;
export const selectCanUndoPen = (s: { annotations: AnnotationsState }) =>
  s.annotations.strokesHistory.past.length > 0;
export const selectCanRedoPen = (s: { annotations: AnnotationsState }) =>
  s.annotations.strokesHistory.future.length > 0;
