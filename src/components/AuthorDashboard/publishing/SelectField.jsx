import { IoIosArrowDown } from "react-icons/io";

function SelectField({ label, name, value, onChange, options, required = false, placeholder = "" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {/* {label} {required && <span className="text-red-500">*</span>} */}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1"
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <IoIosArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

export default SelectField;