'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { FileText, Upload, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export function FileUpload({ file, onFileSelect }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
    setDragActive(false);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const removeFile = () => {
    onFileSelect(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <Card
          {...getRootProps()}
          className={`border-2 border-dashed cursor-pointer transition-all duration-300 ${
            isDragActive || dragActive
              ? 'border-blue-500 bg-blue-50/50 scale-105'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
          }`}
        >
          <div className="p-8 text-center">
            <input {...getInputProps()} />
            <div className={`transition-transform duration-300 ${dragActive ? 'scale-110' : ''}`}>
              <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {isDragActive ? 'Drop your resume here' : 'Upload Your Resume'}
            </h3>
            <p className="text-gray-500 mb-4">
              Drag & drop or click to select your resume file
            </p>
            <p className="text-sm text-gray-400">
              Supports PDF and DOCX formats (Max 10MB)
            </p>
          </div>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{file.name}</h4>
                  <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <Button
                onClick={removeFile}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}