import { useRef, useState, type ChangeEvent } from "react";
import {
  Trash2,
  Upload,
} from "lucide-react";
import axios from "axios";
import FileInput from "./FileInput";

import type { FileWithProgress } from '../types';
import FileItem from "./FileItem";

type FileUploadProps = {
  initialFiles?: FileWithProgress[];
  onRemove: (id: string) => void;
};

function FileUpload({ initialFiles = [] }: FileUploadProps) {
  const [files, setFiles] = useState<FileWithProgress[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  
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

export default FileUpload;

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



