"use client";

import { FC, useMemo } from "react";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

const Editor: FC<EditorProps> = ({ onChange, value }) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  return (
    <div className="bg-white border rounded-md min-h-32">
      <ReactQuill theme="snow" onChange={onChange} value={value}></ReactQuill>
    </div>
  );
};

export default Editor;
