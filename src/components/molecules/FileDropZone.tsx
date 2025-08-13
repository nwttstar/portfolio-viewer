import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import { loadImage } from "@/redux/imageSlice";

export const FileDropZone = () => {
  const dispatch = useDispatch();

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      dispatch(
        loadImage({
          src: url,
          name: file.name,
          width: img.width,
          height: img.height,
          size: file.size,
        })
      );
    };
    img.src = url;
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className={`
          flex h-48 w-128 items-center justify-center rounded-xl
					border-2 border-dashed transition
					${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-400"}
        `}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {isDragActive
            ? "ここにドロップ"
            : "画像をドラッグ & ドロップするかクリックして選択"}
        </p>
      </div>
    </div>
  );
};
