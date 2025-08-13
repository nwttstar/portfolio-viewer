import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImageState, LoadImagePayload } from "@/types/imageSlice";

const initialState: ImageState = {
  src: null,
  name: null,
  width: null,
  height: null,
  size: null,
  rotation: 0,
  flipH: false,
  flipV: false,
  adjust: { brightness: 0, contrast: 0, saturation: 0 },
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    loadImage: (_state, { payload }: PayloadAction<LoadImagePayload>) => ({
      ...initialState,
      ...payload,
    }),
    rotate: (s, { payload }: PayloadAction<90 | 180 | 270>) => {
      s.rotation = (s.rotation + payload) % 360;
    },
    toggleFlipH: (s) => {
      s.flipH = !s.flipH;
    },
    toggleFlipV: (s) => {
      s.flipV = !s.flipV;
    },
    setAdjust: (
      s,
      {
        payload,
      }: PayloadAction<{
        key: "brightness" | "contrast" | "saturation";
        value: number;
      }>
    ) => {
      s.adjust[payload.key] = payload.value;
    },
    resetAdjust: (s) => {
      s.adjust = { brightness: 0, contrast: 0, saturation: 0 };
    },
    clear: () => initialState,
  },
});

export const {
  loadImage,
  rotate,
  toggleFlipH,
  toggleFlipV,
  setAdjust,
  resetAdjust,
  clear,
} = imageSlice.actions;

export const rotateLeft = () => rotate(270); // -90°
export const rotateRight = () => rotate(90); // +90°
export default imageSlice.reducer;
