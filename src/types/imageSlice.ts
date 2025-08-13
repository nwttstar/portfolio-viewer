export type ImageState = {
  src: string | null;
  name: string | null;
  width: number | null;
  height: number | null;
  size: number | null;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  adjust: {
    brightness: number;
    contrast: number;
    saturation: number;
  };
};

export type LoadImagePayload = {
  src: string;
  name: string;
  width: number;
  height: number;
  size: number;
};
