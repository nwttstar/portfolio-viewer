export const requestCanvasExport = (
  filename = "export.png",
  pixelRatio = 2
) => {
  window.dispatchEvent(
    new CustomEvent("EXPORT_CANVAS", { detail: { filename, pixelRatio } })
  );
};
