import React, { useRef, useState, type ChangeEvent } from "react";
import {
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import axios from "axios";
type FileWithProgress = {
  id: string;
  file: File;
  progress: number;
  uploaded: boolean;
};
function FIleUpload() {
  const [uploading, setUploading] = useState(false);
  //state variable to hold the files
  const [files, setFiles] = useState<FileWithProgress[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) {
      return;
    }
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      progress: 0,
      uploaded: false,
      id: file.name,
    }));

    setFiles([...files, ...newFiles]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function handleUpload() {
    if (files.length === 0 || uploading) {
      return;
    }

    setUploading(true);

    const uploadPromises = files.map(async (fileWithProgress) => {
      const formData = new FormData();
      formData.append("file", fileWithProgress.file);

      try {
        await axios.post("https://httpbin.org/post", formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setFiles((prevFiles) =>
              prevFiles.map((file) =>
                file.id === fileWithProgress.id ? { ...file, progress } : file
              )
            );
          },
        });
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === fileWithProgress.id ? { ...file, uploaded: true } : file
          )
        );
      } catch (error) {
        console.log(error);
      }
    });
    await Promise.all(uploadPromises);
  }
  function removeFile(id: string) {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  }

  function handleClear() {
    setFiles([]);
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">File Upload</h2>
        <div className="flex gap-2">
          <FileInput
            inputRef={inputRef}
            disabled={uploading}
            onFileSelect={handleFileSelect}
          />
        <ActionButtons
          disabled={files.length === 0 || uploading}
          onUpload={handleUpload}
          onClear={handleClear}
        />
        </div>

        <FileList files={files} onRemove={removeFile} uploading={uploading} />
      </div>
    </>
  );
}

export default FIleUpload;

//file input component
type FileInputPops = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  disabled: boolean;
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
};

function FileInput({ inputRef, disabled, onFileSelect }: FileInputPops) {
  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={onFileSelect}
        multiple
        className="hidden"
        id="file-upload"
        disabled={disabled}
      />
      <label
        htmlFor="file-upload"
        className="flex cursor-pointer items center gap-2 rounded-md bg-grayscale-700 px-6 py-2 hover:opacity-90"
      >
        <Plus size={18} />
        Select Files
      </label>
    </>
  );
}

//action buttons
type ActionButtonsProps = {
  disabled: boolean;
  onUpload: () => void;
  onClear: () => void;
};

function ActionButtons({ onUpload, onClear, disabled }: ActionButtonsProps) {
  return (
    <>
      <button
        onClick={onUpload}
        disabled={disabled}
        className="flex items-center gap-2"
      >
        <Upload size={18} />
        Upload
      </button>
      <button
        className="flex items-center gap-2"
        onClick={onClear}
        disabled={disabled}
      >
        <Trash2 size={18} />
        Clear All
      </button>
    </>
  );
}

//file list component

type FileListProps = {
  files: FileWithProgress[];
  onRemove: (id: string) => void;
  uploading: boolean;
};

function FileList({ files, onRemove, uploading }: FileListProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Files:</h3>
      <div className="space-y-2">
        {files.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            onRemove={onRemove}
            uploading={uploading}
          />
        ))}
      </div>
    </div>
  );
}

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
//progress bar component
type ProgressBarProps = {
  progress: number;
};

function ProgresBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-grayscale-800">
      <div
        className="h-full bg-primary-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
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
