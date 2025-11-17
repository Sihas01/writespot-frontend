;
import { FiUploadCloud } from "react-icons/fi";
import { RiCloseLargeLine } from "react-icons/ri";


function FileUpload({ label, name, onChange, accept, required = false, file }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors">
        <input
          type="file"
          name={name}
          onChange={onChange}
          accept={accept}
          required={required}
          className="hidden"
          id={name}
        />
        <label htmlFor={name} className="cursor-pointer">
          <FiUploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          {file ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-700">{file.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onChange({ target: { name, files: [] } });
                }}
                className="text-red-500 hover:text-red-700"
              >
                <RiCloseLargeLine className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">{accept}</p>
            </>
          )}
        </label>
      </div>
    </div>
  );
}

export default FileUpload;