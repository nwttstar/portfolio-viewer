import { useCallback, useState } from "react";
import { v4 as uuid } from "uuid";
import type { DrawingPreview } from "@/types/drawingPreview";

export type PenStyle = { color: string; width: number; opacity: number };

export function useDrawing(
  isEnabled: boolean,
  pen: PenStyle,
  onCommit: (stroke: DrawingPreview) => void
) {
  const [drawing, setDrawing] = useState<null | DrawingPreview>(null);

  const onPointerDown = useCallback(
    (e: any) => {
      if (!isEnabled) return;
      const pos = e.target.getStage().getPointerPosition();
      if (!pos) return;
      setDrawing({
        id: uuid(),
        points: [pos.x, pos.y],
        color: pen.color,
        width: pen.width,
        opacity: pen.opacity,
      });
    },
    [isEnabled, pen]
  );

  const onPointerMove = useCallback((e: any) => {
    setDrawing((d) => {
      if (!d) return d;
      const pos = e.target.getStage().getPointerPosition();
      if (!pos) return d;
      // concat より push の方が速いが、immutability 優先で concat
      return { ...d, points: d.points.concat([pos.x, pos.y]) };
    });
  }, []);

  const onPointerUp = useCallback(() => {
    setDrawing((d) => {
      if (!d) return d;
      if (d.points.length < 4) return null; // 誤爆クリックは破棄
      onCommit(d);
      return null;
    });
  }, [onCommit]);

  return {
    drawing,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
  };
}
