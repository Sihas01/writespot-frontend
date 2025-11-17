import { FiUploadCloud } from "react-icons/fi";
import { CiCircleRemove } from "react-icons/ci";
import { useState } from "react";

function FileUpload({ label, name, onChange, accept, required = false, file }) {
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError(""); // clear error when user selects a file
    onChange(e);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError(required ? "Please upload a file." : "");
    onChange({ target: { name, files: [] } });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors">
        <input
          type="file"
          name={name}
          onChange={handleChange}
          accept={accept}
          className="hidden"     // no more required here
          id={name}
        />

        <label htmlFor={name} className="cursor-pointer block">
          {file ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 bg-gray-50 p-3 rounded">
                <FiUploadCloud className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700 font-medium">{file.name}</span>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <CiCircleRemove className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500">Click to change file</p>
            </div>
          ) : (
            <>
              <FiUploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">{accept}</p>
            </>
          )}
        </label>
      </div>

      {/* 🚨 Custom validation message */}
      {required && !file && error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}

export default FileUpload;
