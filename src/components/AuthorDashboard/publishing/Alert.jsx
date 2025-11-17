function Alert({ type, message, onClose }) {
  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';

  return (
    <div className={`${bgColor} ${textColor} border ${borderColor} rounded-lg p-4 mb-6 flex items-start justify-between`}>
      <p className="text-sm">{message}</p>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        {/* <X className="w-4 h-4" /> */}
        x
      </button>
    </div>
  );
}

export default Alert;