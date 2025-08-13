import type { Stage } from "konva/lib/Stage";

let _stage: Stage | null = null;

export const setStage = (s: Stage | null) => {
  _stage = s;
};

export const getStage = () => _stage;
