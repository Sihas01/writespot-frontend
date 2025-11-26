import { FiUploadCloud } from "react-icons/fi";
import { CiCircleRemove } from "react-icons/ci";
import { useState, useEffect } from "react";

function FileUpload({ label, name, onChange, accept, required = false, file }) {
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    setError("");
    onChange(e);

    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      const extension = selectedFile.name.split(".").pop().toLowerCase();
      const maxSize = 50 * 1024 * 1024;

      if (selectedFile.size > maxSize) {
        setError("File size must be less than 50 MB.");
        setPreviewUrl(null);
        onChange({ target: { name, files: [] } }); // reset
        return;
      }

      // Image preview
      if (fileType.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(selectedFile);
      }
      // PDF preview
      else if (extension === "pdf") {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      }
      // Other docs (epub, mobi, docx) → no preview, just icon
      else if (["epub", "mobi", "docx", "doc"].includes(extension)) {
        setPreviewUrl(null);
      }
      else {
        setPreviewUrl(null);
        setError("Unsupported file type");
      }
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError(required ? "Please upload a file." : "");
    setPreviewUrl(null);
    onChange({ target: { name, files: [] } });
  };

  useEffect(() => {
    return () => {
      if (previewUrl && file?.name?.split(".").pop().toLowerCase() === "pdf") {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, file]);

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
          className="hidden"
          id={name}
        />

        <label htmlFor={name} className="cursor-pointer block">
          {file ? (
            <div className="space-y-2">
              {/* Image preview */}
              {previewUrl && file.type.startsWith("image/") && (
                <img src={previewUrl} alt="preview" className="mx-auto max-h-32" />
              )}
              {/* PDF preview */}
              {previewUrl && file.name.endsWith(".pdf") && (
                <iframe src={previewUrl} title="PDF Preview" width="100%" height="400" />
              )}
              {/* Other doc icons */}
              {!previewUrl && ["docx", "doc", "epub", "mobi"].includes(file.name.split(".").pop().toLowerCase()) && (
                <div className="flex items-center justify-center gap-2 bg-gray-50 p-3 rounded">
                  <FiUploadCloud className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-700 font-medium">{file.name}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700 mt-1"
              >
                <CiCircleRemove className="w-4 h-4 inline" /> Remove
              </button>

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

      {/* Validation */}
      {required && !file && error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}

export default FileUpload;
