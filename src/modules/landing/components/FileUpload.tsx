import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { validateFile } from '@/services/fileProcessing'

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

type FileUploadProps = {
  accept?: string
  maxSize?: number
  onFileSelect?: (file: File) => void
}

export function FileUpload({ 
  accept = '.pdf,.doc,.docx,.txt', 
  maxSize = 10 * 1024 * 1024, 
  onFileSelect 
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    const file = newFiles[0];
    if (!file) return;

    // Validate file
    if (file.size > maxSize) {
      setError('File too large (max 10MB)');
      return;
    }
    
    const res = validateFile(file);
    if (!res.ok) {
      setError(res.error === 'file_too_large' ? 'File too large' : 'Unsupported file type');
      return;
    }

    setError(null);
    setFiles([file]);
    onFileSelect?.(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setError(null);
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    onDrop: handleFileChange,
    onDropRejected: (rejectedFiles) => {
      const rejection = rejectedFiles[0];
      if (rejection?.errors?.some(e => e.code === 'file-too-large')) {
        setError('File too large (max 10MB)');
      } else if (rejection?.errors?.some(e => e.code === 'file-invalid-type')) {
        setError('Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files.');
      } else {
        setError('File upload failed. Please try again.');
      }
    },
  });

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
        Resume File
      </label>
      <div {...getRootProps()}>
        <motion.div
          onClick={handleClick}
          whileHover="animate"
          className="p-8 group/file block rounded-xl cursor-pointer w-full relative overflow-hidden border-2 border-dashed border-neutral-200 dark:border-neutral-700 hover:border-sky-400 dark:hover:border-sky-500 transition-colors"
        >
          <input
            ref={fileInputRef}
            id="file-upload-handle"
            type="file"
            accept={accept}
            onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
            className="hidden"
            aria-label="Upload resume"
          />
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
            <GridPattern />
          </div>
          <div className="flex flex-col items-center justify-center relative z-10">
            <p className="font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
              Upload Resume
            </p>
            <p className="font-sans font-normal text-neutral-400 dark:text-neutral-400 text-sm mt-2">
              Drag or drop your resume here or click to upload
            </p>
            <p className="font-sans font-normal text-neutral-400 dark:text-neutral-400 text-xs mt-1">
              Supports PDF, DOC, DOCX, TXT (max 10MB)
            </p>
            
            <div className="relative w-full mt-6 max-w-md mx-auto">
              {files.length > 0 &&
                files.map((file, idx) => (
                  <motion.div
                    key={"file" + idx}
                    layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                    className={cn(
                      "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start p-4 mt-4 w-full mx-auto rounded-lg border border-neutral-200 dark:border-neutral-700",
                      "shadow-sm"
                    )}
                  >
                    <div className="flex justify-between w-full items-center gap-4">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="text-sm text-neutral-700 dark:text-neutral-300 truncate max-w-xs font-medium"
                      >
                        {file.name}
                      </motion.p>
                      <div className="flex items-center gap-2">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout
                          className="rounded-md px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800"
                        >
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </motion.p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                          className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                        >
                          <IconX className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex text-xs flex-row items-center w-full mt-2 justify-between text-neutral-500 dark:text-neutral-400">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800"
                      >
                        {file.type || 'Unknown type'}
                      </motion.p>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                      >
                        {new Date(file.lastModified).toLocaleDateString()}
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
              
              {!files.length && (
                <motion.div
                  layoutId="file-upload"
                  variants={mainVariant}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className={cn(
                    "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-24 mt-4 w-24 mx-auto rounded-lg border border-neutral-200 dark:border-neutral-700",
                    "shadow-sm"
                  )}
                >
                  {isDragActive ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-neutral-600 dark:text-neutral-400 flex flex-col items-center"
                    >
                      <p className="text-xs font-medium">Drop it</p>
                      <IconUpload className="h-5 w-5 mt-1" />
                    </motion.div>
                  ) : (
                    <IconUpload className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
                  )}
                </motion.div>
              )}

              {!files.length && (
                <motion.div
                  variants={secondaryVariant}
                  className="absolute opacity-0 border border-dashed border-sky-400 dark:border-sky-500 inset-0 z-30 bg-transparent flex items-center justify-center h-24 mt-4 w-24 mx-auto rounded-lg"
                ></motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 dark:text-red-400"
          role="alert"
          aria-live="polite"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}

export function GridPattern() {
  const columns = 20;
  const rows = 8;
  return (
    <div className="flex bg-neutral-50 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-8 h-8 flex flex-shrink-0 rounded-sm ${
                index % 2 === 0
                  ? "bg-white dark:bg-neutral-950"
                  : "bg-white dark:bg-neutral-950 shadow-[0px_0px_1px_2px_rgba(0,0,0,0.05)_inset] dark:shadow-[0px_0px_1px_2px_rgba(255,255,255,0.05)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
