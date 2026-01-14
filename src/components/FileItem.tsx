import React from 'react'
import ProgresBar from './ProgresBar';

import {
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  X
} from "lucide-react";
 import type {FileWithProgress} from '../types'

//file item component
type FileItemProps = {
  file: FileWithProgress;
  onRemove: (id: string) => void;
  uploading: boolean;
};

function FileItem({ file, onRemove, uploading }: FileItemProps) {
  const Icon = getFileIcon(file.file.type);

  return (
    <div className="space-y-2 rounded-md bg-grayscale-700 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Icon size={40} className="text-primary-500" />
          <div className="flex flex-col">
            <span className="font-medium">{file.file.name}</span>
            <div className="flex items-center gap-2 text-xs text-grayscale-400">
              <span>{formatSize(file.file.size)}</span>
              <span>•</span>
              <span>{file.file.type || "Unknown type"}</span>
            </div>
          </div>
        </div>
        {!uploading && (
          <button onClick={() => onRemove(file.id)} className="bg-none p-0">
            <X size={16} className="text-white" />
          </button>
        )}
      </div>
      <div className="text-right text-xs">
        {file.uploaded ? "Completed" : `${Math.round(file.progress)}%`}
      </div>
      <ProgresBar progress={file.progress} />
    </div>
  );
}

const getFileIcon = (mineType: string) => {
  if (mineType.startsWith("image/")) return FileImage;
  if (mineType.startsWith("video/")) return FileVideo;
  if (mineType.startsWith("audio/")) return FileAudio;
  if (mineType === "applicationpdf") return FileText;
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};


export default FileItem