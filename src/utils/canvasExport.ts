import { ExportEventDetail } from "@/types/canvasExport";

export const requestCanvasExport = (details?: ExportEventDetail) => {
  window.dispatchEvent(
    new CustomEvent("EXPORT_CANVAS", {
      detail: details,
    })
  );
};
