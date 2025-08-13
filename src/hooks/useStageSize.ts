import { useEffect, useMemo, useState } from "react";

export type StageSize = {
  stageW: number;
  stageH: number;
  center: { x: number; y: number };
};

export function useStageSize(): StageSize {
  const get = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 0;
    const h = typeof window !== "undefined" ? window.innerHeight : 0;
    return { stageW: w, stageH: h, center: { x: w / 2, y: h / 2 } };
  };

  const [size, setSize] = useState(get);

  useEffect(() => {
    const onResize = () => setSize(get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // center は stageW/H から導出できるが、計算コストは軽いので一緒に持たせる
  return useMemo(() => size, [size.stageW, size.stageH]);
}
