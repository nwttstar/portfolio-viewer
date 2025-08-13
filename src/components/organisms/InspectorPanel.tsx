import { useAppDispatch, useAppSelector } from "@/redux/store";
import { selectImage, selectCanUndo, selectCanRedo } from "@/redux/store";
import { historyUndo, historyRedo } from "@/redux/history";
import {
  rotateLeft,
  rotateRight,
  toggleFlipH,
  toggleFlipV,
  setAdjust,
  resetAdjust,
} from "@/redux/imageSlice";
import { requestCanvasExport } from "@/utils/canvasExport";
import { Button } from "@/components/atoms/buttons/Button";
import {
  setTool,
  setPenColor,
  setPenWidth,
  setPenOpacity,
  undoPen,
  redoPen,
  selectCanUndoPen,
  selectCanRedoPen,
} from "@/redux/annotationsSlice";

export const InspectorPanel = () => {
  const dispatch = useAppDispatch();

  // 画像ステート
  const { name, width, height, size, rotation, adjust, flipH, flipV } =
    useAppSelector(selectImage);
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);

  // アノテーション（ペン）ステート
  const { tool, pen } = useAppSelector((s) => s.annotations);
  const canUndoPen = useAppSelector(selectCanUndoPen);
  const canRedoPen = useAppSelector(selectCanRedoPen);

  if (!name) return null;

  const handleUndo = () => {
    if (tool === "pen" && canUndoPen) {
      dispatch(undoPen());
    } else {
      dispatch(historyUndo());
    }
  };

  const handleRedo = () => {
    if (tool === "pen" && canRedoPen) {
      dispatch(redoPen());
    } else {
      dispatch(historyRedo());
    }
  };

  const undoDisabled = tool === "pen" ? !canUndoPen : !canUndo;
  const redoDisabled = tool === "pen" ? !canRedoPen : !canRedo;

  return (
    <aside className="fixed right-4 top-4 w-80 rounded-xl bg-white p-4 shadow-lg space-y-3">
      <h2 className="text-lg font-semibold">画像情報</h2>
      <ul className="text-sm leading-6">
        <li>ファイル名: {name}</li>
        <li>
          解像度: {width} × {height}
        </li>
        <li>サイズ: {(size! / 1024).toFixed(1)} KB</li>
        <li>回転: {rotation}°</li>
      </ul>

      {/* 反転 */}
      <div className="flex gap-2">
        <Button onClick={() => dispatch(toggleFlipH())}>
          左右反転{flipH ? "（ON）" : ""}
        </Button>
        <Button onClick={() => dispatch(toggleFlipV())}>
          上下反転{flipV ? "（ON）" : ""}
        </Button>
      </div>

      {/* 調整スライダー */}
      <div className="space-y-2">
        <label className="block text-sm">
          明るさ {adjust.brightness.toFixed(2)}
        </label>
        <input
          type="range"
          min={-1}
          max={1}
          step={0.01}
          value={adjust.brightness}
          onChange={(e) =>
            dispatch(
              setAdjust({ key: "brightness", value: Number(e.target.value) })
            )
          }
          className="w-full"
        />
        <label className="block text-sm">
          コントラスト {adjust.contrast.toFixed(2)}
        </label>
        <input
          type="range"
          min={-100}
          max={100}
          step={1}
          value={adjust.contrast}
          onChange={(e) =>
            dispatch(
              setAdjust({ key: "contrast", value: Number(e.target.value) })
            )
          }
          className="w-full"
        />
        <label className="block text-sm">
          彩度 {adjust.saturation.toFixed(2)}
        </label>
        <input
          type="range"
          min={-1}
          max={1}
          step={0.01}
          value={adjust.saturation}
          onChange={(e) =>
            dispatch(
              setAdjust({ key: "saturation", value: Number(e.target.value) })
            )
          }
          className="w-full"
        />
        <div className="flex gap-2">
          <Button onClick={() => dispatch(resetAdjust())}>調整リセット</Button>
        </div>
      </div>

      {/* Undo/Redo・回転・エクスポート */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <Button onClick={handleUndo} disabled={undoDisabled}>
          Undo
        </Button>
        <Button onClick={handleRedo} disabled={redoDisabled}>
          Redo
        </Button>
        <Button onClick={() => dispatch(rotateLeft())}>左回転</Button>
        <Button onClick={() => dispatch(rotateRight())}>右回転</Button>
        <Button onClick={() => requestCanvasExport()}>エクスポート</Button>
      </div>

      {/* ペン設定（縦一列） */}
      <div className="mt-4 border-t pt-4">
        <h3 className="text-sm font-medium mb-2">Annotate</h3>
        <div className="flex flex-col gap-2">
          <button
            className={`w-full px-2 py-1 rounded border text-left ${
              tool === "pen" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => dispatch(setTool(tool === "pen" ? "none" : "pen"))}
            aria-pressed={tool === "pen"}
          >
            Pen
          </button>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Color</span>
            <input
              type="color"
              value={pen.color}
              onChange={(e) => dispatch(setPenColor(e.target.value))}
              className="h-8 w-12 p-0 border rounded"
            />
          </div>

          <label className="text-xs">
            Width: {pen.width}px
            <input
              type="range"
              min={1}
              max={32}
              step={1}
              value={pen.width}
              onChange={(e) => dispatch(setPenWidth(Number(e.target.value)))}
              className="w-full"
            />
          </label>

          <label className="text-xs">
            Opacity: {pen.opacity.toFixed(2)}
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={pen.opacity}
              onChange={(e) => dispatch(setPenOpacity(Number(e.target.value)))}
              className="w-full"
            />
          </label>
        </div>
      </div>
    </aside>
  );
};
