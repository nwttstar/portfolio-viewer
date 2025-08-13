import { useEffect } from "react";
import type Konva from "konva";

type Opts = { scaleBy?: number };

export function useZoomPan(
  stageRef: React.RefObject<Konva.Stage | null>,
  opts: Opts = {}
) {
  const { scaleBy = 1.05 } = opts;

  useEffect(() => {
    const stage = stageRef?.current;
    if (!stage) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };
      const newScale = e.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale });
      stage.position({
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      });
      stage.batchDraw();
    };

    stage.content.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      stage.content.removeEventListener("wheel", handleWheel);
    };
  }, [stageRef, scaleBy]);
}
