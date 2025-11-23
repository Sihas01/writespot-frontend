import InputField from "./InputField";
import NavigationButtons from "./NavigationButtons";

function PricingStep({ formData, onChange, onBack, onSubmit, isLoading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };



  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-medium text-gray-800 mb-8">eBook Pricing</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={onChange}
            placeholder="0.00"
            required
          />


        </div>


        <InputField
          label="Discount Percentage (Optional)"
          name="discount"
          type="number"
          value={formData.discount}
          onChange={onChange}
          placeholder="0"
        />
      </div>

     <label className="flex items-center gap-2 cursor-pointer mt-4">
  <input
    type="checkbox"
    name="drmEnabled"
    checked={formData.drmEnabled}   
    onChange={onChange}             
    className="w-4 h-4"
  />
  <span className="text-sm font-semibold text-gray-700">DRM Enabled</span>
</label>



      <NavigationButtons
        onBack={onBack}
        onNext={onSubmit}
        showBack={true}
        nextLabel="Submit"
        isLoading={isLoading}
      />
    </form>
  );
}

export default PricingStep;