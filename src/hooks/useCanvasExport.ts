import { useEffect, useCallback } from "react";
import type Konva from "konva";
import { ExportArgs, ExportEventDetail } from "@/types/canvasExport";

export function useCanvasExport(stageRef: React.RefObject<Konva.Stage | null>) {
  const exportCanvas = useCallback(
    ({ filename, pixelRatio, mimeType }: ExportArgs = {}) => {
      const stage = stageRef?.current;
      if (!stage) return;

      const _filename = filename ?? "export.png";
      const _pixelRatio = pixelRatio ?? 2;
      const _mimeType = mimeType ?? "image/png";

      stage.batchDraw();
      const dataURL = stage.toDataURL({
        pixelRatio: _pixelRatio,
        mimeType: _mimeType,
      });

      const a = document.createElement("a");
      a.href = dataURL;
      a.download = _filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    [stageRef]
  );

  const eventName = "canvasExportRequest";
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ExportEventDetail>).detail || {};
      exportCanvas(detail);
    };

    window.addEventListener(eventName, handler as EventListener);
    return () =>
      window.removeEventListener(eventName, handler as EventListener);
  }, [eventName, exportCanvas]);

  return { exportCanvas };
}
