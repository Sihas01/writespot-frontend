import StepCircle from "./StepCircle";

// Stepper Component
const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="mb-16">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300" style={{ zIndex: 0 }}>
          <div 
            className="h-full bg-yellow-400 transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
        
        {/* Step Circles */}
        {steps.map((step, index) => (
          <StepCircle 
            key={step.id} 
            step={step} 
            index={index} 
            currentStep={currentStep} 
          />
        ))}
      </div>
    </div>
  );
}

export default Stepper;