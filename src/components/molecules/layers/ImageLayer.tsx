import { useEffect, useRef } from "react";
import { Layer, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import { useImage } from "@/hooks/useImage";

type Transform = {
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  adjust: { brightness: number; contrast: number; saturation: number };
};

type Props = {
  src: string | null;
  center: { x: number; y: number };
  transform: Transform;
};

export const ImageLayer = ({ src, center, transform }: Props) => {
  const image = useImage(src);
  const imageNodeRef = useRef<Konva.Image>(null);

  // 初回・パラメータ変更時のキャッシュ＆描画
  useEffect(() => {
    const node = imageNodeRef.current;
    if (!node || !image) return;
    node.cache();
    node.getLayer()?.batchDraw();
  }, [image, transform]);

  if (!image) return null;

  const { rotation, flipH, flipV, adjust } = transform;
  const scaleX = flipH ? -1 : 1;
  const scaleY = flipV ? -1 : 1;

  return (
    <Layer>
      <KonvaImage
        ref={imageNodeRef}
        image={image}
        x={center.x}
        y={center.y}
        rotation={rotation}
        offsetX={image.width / 2}
        offsetY={image.height / 2}
        scaleX={scaleX}
        scaleY={scaleY}
        filters={[
          Konva.Filters.Brighten,
          Konva.Filters.Contrast,
          Konva.Filters.HSL,
        ]}
        brightness={adjust.brightness}
        contrast={adjust.contrast}
        saturation={adjust.saturation}
      />
    </Layer>
  );
};
