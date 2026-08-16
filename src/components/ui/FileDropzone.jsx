/**
 * SGHASH UI — FileDropzone
 * Architecture Spec §4.2: BulkUploadAction triggers a WarningModal
 * that utilizes a file dropzone.
 */

import { useState, useRef, useCallback } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
import './FileDropzone.css';

export default function FileDropzone({
  onFileSelect,
  accept = '.csv, .xlsx',
  maxSizeMB = 5,
  className = '',
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const processFile = (file) => {
    setError(null);
    if (!file) return;

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }

    // Pass up
    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0];
    processFile(file);
  }, [maxSizeMB, onFileSelect]);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div className={`file-dropzone-wrapper ${className}`}>
      <div
        className={`file-dropzone ${isDragActive ? 'file-dropzone--active' : ''} ${error ? 'file-dropzone--error' : ''} ${selectedFile ? 'file-dropzone--has-file' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="file-dropzone__input"
        />

        {!selectedFile ? (
          <div className="file-dropzone__content">
            <div className="file-dropzone__icon-wrap">
              <UploadCloud size={24} className="file-dropzone__icon" />
            </div>
            <p className="file-dropzone__text">
              <span className="file-dropzone__browse">Click to upload</span> or drag and drop
            </p>
            <p className="file-dropzone__hint">
              {accept.replace(/,\s*/g, ', ')} (Max. {maxSizeMB}MB)
            </p>
          </div>
        ) : (
          <div className="file-dropzone__file">
            <File size={24} className="file-dropzone__file-icon" />
            <div className="file-dropzone__file-info">
              <span className="file-dropzone__file-name">{selectedFile.name}</span>
              <span className="file-dropzone__file-size">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            </div>
            <button
              type="button"
              className="file-dropzone__clear-btn"
              onClick={clearFile}
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      {error && <p className="file-dropzone__error">{error}</p>}
    </div>
  );
}
