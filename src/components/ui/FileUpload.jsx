import { useRef, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '../../utils/helpers.js';

/**
 * Accessible file upload field.
 * Accepts either a single file or multiple files via the `multiple` prop.
 */
export default function FileUpload({ label, accept = 'image/*,.pdf,.doc,.docx,.txt', multiple = false, onChange, hint, error, value = [] }) {
  const inputRef = useRef(null);
  const files = Array.isArray(value) ? value : value ? [value] : [];

  const handleChange = (e) => {
    const selected = Array.from(e.target.files || []);
    onChange?.(multiple ? selected : selected[0]);
    e.target.value = '';
  };

  return (
    <div>
      {label && <span className="label">{label}</span>}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center transition hover:border-navy-400 hover:bg-navy-50',
          error && 'border-red-400'
        )}
      >
        <Upload className="h-8 w-8 text-gray-400" />
        <p className="mt-2 text-sm font-medium text-gray-700">Click to upload {multiple ? 'files' : 'a file'}</p>
        <p className="mt-1 text-xs text-gray-500">Accepted: {accept}. Max 5 MB per file.</p>
      </button>
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={handleChange} />

      {files.filter(Boolean).length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.filter(Boolean).map((f, i) => (
            <li key={i} className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700">
              <FileText className="h-4 w-4 shrink-0 text-gray-500" />
              <span className="truncate">{f.name || f}</span>
              <button
                type="button"
                onClick={() => onChange?.(multiple ? files.filter((_, idx) => idx !== i) : null)}
                className="ml-auto text-gray-400 hover:text-red-600"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
