import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { historyUndo, historyRedo } from "@/redux/history";
import { FileDropZone } from "@/components/molecules/FileDropZone";
import { CanvasViewer } from "@/components/organisms/CanvasViewer";
import { InspectorPanel } from "@/components/organisms/InspectorPanel";
import { selectImage } from "@/redux/store";

function App() {
  const dispatch = useDispatch();
  const { src } = useSelector(selectImage);
  const hasImage = !!src;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod) return;

      if (e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        dispatch(historyUndo());
      } else if (
        (e.key.toLowerCase() === "z" && e.shiftKey) ||
        e.key.toLowerCase() === "y"
      ) {
        e.preventDefault();
        dispatch(historyRedo());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  return (
    <div className="h-screen w-screen">
      {hasImage ? (
        <>
          <CanvasViewer />
          <InspectorPanel />
        </>
      ) : (
        <FileDropZone />
      )}
    </div>
  );
}

export default App;
