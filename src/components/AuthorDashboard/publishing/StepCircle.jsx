const StepCircle = ({ step, index, currentStep }) => {
  const isCompleted = index < currentStep;
  const isActive = index === currentStep;
  
  return (
    <div className="flex flex-col items-center relative" style={{ zIndex: 1 }}>
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          isActive || isCompleted
            ? 'bg-yellow-400'
            : 'bg-white border-2 border-gray-300'
        }`}
      >
        {isCompleted && (
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <span className="mt-3 text-sm text-gray-700 whitespace-nowrap">{step.label}</span>
    </div>
  );
}

export default StepCircle;