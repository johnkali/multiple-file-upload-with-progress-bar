import { useRef, useState, type ChangeEvent } from "react";

import axios from "axios";
import FileInput from "./FileInput";

import type { FileWithProgress } from '../types';
import FileList from "./FileList";
import ActionButtons from "./ActionButtons";

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
        <h2 data-testid="upload-header" className="text-xl font-bold">File Upload</h2>
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





