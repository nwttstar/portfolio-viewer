import { Layer, Line } from "react-konva";
import { useAppSelector } from "@/redux/store";
import { selectStrokes } from "@/redux/annotationsSlice";

export const AnnotationLayer = () => {
  const strokes = useAppSelector(selectStrokes);

  return (
    <Layer listening={false}>
      {strokes.map((s) => (
        <Line
          key={s.id}
          points={s.points}
          stroke={s.color}
          strokeWidth={s.width}
          opacity={s.opacity}
          lineCap="round"
          lineJoin="round"
          tension={0}
        />
      ))}
    </Layer>
  );
};
