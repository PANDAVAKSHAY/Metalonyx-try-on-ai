import React, { useCallback, useRef } from 'react';
import { UploadedFile } from '../types';
import { UploadIcon, XCircleIcon } from './Icons';

interface ImageUploaderProps {
  id: string;
  title: string;
  description: string;
  file?: UploadedFile | null;
  files?: UploadedFile[];
  onFileUpload?: (file: File) => void;
  onFilesUpload?: (files: File[]) => void;
  onFileRemove: (index?: number) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  id,
  title,
  description,
  file,
  files,
  onFileUpload,
  onFilesUpload,
  onFileRemove,
  multiple = false,
  maxFiles = 1,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      if (multiple && onFilesUpload) {
        onFilesUpload(selectedFiles);
      } else if (!multiple && onFileUpload && selectedFiles.length > 0) {
        onFileUpload(selectedFiles[0]);
      }
    }
  };
  
  const handleRemove = (e: React.MouseEvent, index?: number) => {
      e.stopPropagation();
      onFileRemove(index);
  }

  const triggerFileInput = () => {
    inputRef.current?.click();
  };
  
  const canUploadMore = !multiple ? !file : (files?.length ?? 0) < maxFiles;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
      <div className="flex flex-wrap gap-4">
        {multiple && files?.map((f, index) => (
          <div key={index} className="relative w-28 h-28 rounded-lg overflow-hidden border-2 border-gold-200">
            <img src={f.previewUrl} alt={`preview ${index}`} className="w-full h-full object-cover" />
            <button onClick={(e) => handleRemove(e, index)} className="absolute top-1 right-1 bg-white/70 rounded-full text-gray-700 hover:text-red-600 transition-colors">
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
        ))}
        {!multiple && file && (
          <div className="relative w-28 h-28 rounded-lg overflow-hidden border-2 border-gold-200">
            <img src={file.previewUrl} alt="preview" className="w-full h-full object-cover" />
             <button onClick={(e) => handleRemove(e)} className="absolute top-1 right-1 bg-white/70 rounded-full text-gray-700 hover:text-red-600 transition-colors">
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
        )}
        {canUploadMore && (
           <div
            onClick={triggerFileInput}
            className="w-28 h-28 flex flex-col items-center justify-center bg-gold-50 border-2 border-dashed border-gold-300 rounded-lg cursor-pointer hover:bg-gold-100 transition-colors"
          >
            <UploadIcon className="w-8 h-8 text-gold-600 mb-1" />
            <span className="text-xs font-semibold text-gold-800">Upload</span>
            <input
              id={id}
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};
