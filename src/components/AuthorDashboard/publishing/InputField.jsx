function InputField({ label, name, value, onChange, type = "text", required = false, placeholder = "" }) {
  return (
    <div >
      <label className="block text-sm font-medium text-gray-700 mb-2 pt-4 ">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-4 md:py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1  "
      />
    </div>
  );
}

export default InputField;