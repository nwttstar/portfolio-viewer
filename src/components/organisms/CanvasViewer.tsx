// src/components/organisms/CanvasViewer.tsx
import { useMemo, useRef } from "react";
import { Stage } from "react-konva";
import { useAppDispatch, useAppSelector, selectImage } from "@/redux/store";
import { addStroke } from "@/redux/annotationsSlice";
import { AnnotationLayer } from "@/components/molecules/layers/AnnotationLayer";
import { ImageLayer } from "@/components/molecules/layers/ImageLayer";
import { DrawingPreviewLayer } from "@/components/molecules/layers/DrawingPreviewLayer";
import { useStageSize } from "@/hooks/useStageSize";
import { useZoomPan } from "@/hooks/useZoomPan";
import { useCanvasExport } from "@/hooks/useCanvasExport";
import { useDrawing } from "@/hooks/useDrawing";
import type Konva from "konva";

export const CanvasViewer = () => {
  const dispatch = useAppDispatch();
  const { src, rotation, flipH, flipV, adjust } = useAppSelector(selectImage);
  const { tool, pen } = useAppSelector((s) => s.annotations);

  const stageRef = useRef<Konva.Stage | null>(null);

  const { stageW, stageH, center } = useStageSize();
  useZoomPan(stageRef, { scaleBy: 1.05 });
  useCanvasExport(stageRef);

  const isPen = tool === "pen";
  const stageDraggable = useMemo(() => !isPen, [isPen]);

  const { drawing, handlers } = useDrawing(isPen, pen, (stroke) => {
    dispatch(
      addStroke({
        id: stroke.id,
        tool: "pen",
        color: stroke.color,
        width: stroke.width,
        opacity: stroke.opacity,
        points: stroke.points,
        createdAt: Date.now(),
      })
    );
  });

  if (!src) return null;

  return (
    <Stage
      width={stageW}
      height={stageH}
      ref={stageRef}
      draggable={stageDraggable}
      onMouseDown={handlers.onPointerDown}
      onMouseMove={handlers.onPointerMove}
      onMouseUp={handlers.onPointerUp}
      onTouchStart={handlers.onPointerDown}
      onTouchMove={handlers.onPointerMove}
      onTouchEnd={handlers.onPointerUp}
    >
      <ImageLayer
        src={src}
        center={center}
        transform={{ rotation, flipH, flipV, adjust }}
      />
      <AnnotationLayer />
      <DrawingPreviewLayer current={drawing} />
    </Stage>
  );
};
