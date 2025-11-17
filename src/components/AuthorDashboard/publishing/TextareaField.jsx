function TextareaField({ label, name, value, onChange, required = false, placeholder = "", rows = 4 }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 pt-4">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 resize-none"
      />
    </div>
  );
}

export default TextareaField;