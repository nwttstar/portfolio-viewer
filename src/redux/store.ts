import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import imageReducer, {
  loadImage,
  rotate,
  clear,
  toggleFlipH,
  toggleFlipV,
  setAdjust,
  resetAdjust,
} from "./imageSlice";
import { wrapWithHistory } from "./history";
import annotationsReducer from "@/redux/annotationsSlice";

const imageWithHistory = wrapWithHistory(imageReducer, {
  trackedTypes: [
    loadImage.type,
    rotate.type,
    clear.type,
    toggleFlipH.type,
    toggleFlipV.type,
    setAdjust.type,
    resetAdjust.type,
  ],
  shouldRecord: (prev, action) => {
    // 初回 loadImage は履歴に積まない
    if (!prev.src && action.type === loadImage.type) return false;
    return !!prev.src;
  },
  // 連続スライダー操作のグルーピング
  groupBy: (action) => {
    if (action.type === setAdjust.type) {
      // brightness/contrast/saturation ごとに別グループ
      return `${action.type}:${action.payload?.key}`;
    }
    return action.type;
  },
  groupWindowMs: 500, // 0.5秒以内の連続操作は1ステップに
});

export const store = configureStore({
  reducer: {
    image: imageWithHistory,
    annotations: annotationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// 型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 型付きセレクタ/ディスパッチャ
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 既存セレクタ
export const selectImage = (s: RootState) => s.image.present;
export const selectCanUndo = (s: RootState) => s.image.past.length > 0;
export const selectCanRedo = (s: RootState) => s.image.future.length > 0;
