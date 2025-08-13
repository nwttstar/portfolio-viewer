import { Layer, Line } from "react-konva";
import { DrawingPreview } from "@/types/drawingPreview";

type Props = {
  current: DrawingPreview | null;
};

export const DrawingPreviewLayer = ({ current }: Props) => {
  if (!current || current.points.length < 4) {
    return null;
  }

  return (
    <Layer listening={false}>
      <Line
        points={current.points}
        stroke={current.color}
        strokeWidth={current.width}
        opacity={current.opacity}
        lineCap="round"
        lineJoin="round"
      />
    </Layer>
  );
};

DrawingPreviewLayer.displayName = "DrawingPreviewLayer";
