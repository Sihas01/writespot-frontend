import InputField from "./InputField";
import NavigationButtons from "./NavigationButtons";
import SelectField from "./SelectField";

function PricingStep({ formData, onChange, onBack, onSubmit, isLoading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const currencyOptions = [
    { value: 'usd', label: 'USD ($)' },
    { value: 'eur', label: 'EUR (€)' },
    { value: 'gbp', label: 'GBP (£)' },
    { value: 'jpy', label: 'JPY (¥)' }
  ];

  const royaltyOptions = [
    { value: '35', label: '35% Royalty' },
    { value: '70', label: '70% Royalty' }
  ];

  const territoryOptions = [
    { value: 'worldwide', label: 'Worldwide' },
    { value: 'us', label: 'United States' },
    { value: 'eu', label: 'European Union' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'asia', label: 'Asia Pacific' }
  ];

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

          <SelectField
            label="Currency"
            name="currency"
            value={formData.currency}
            onChange={onChange}
            options={currencyOptions}
            placeholder="Select Currency"
            required
          />
        </div>

        <SelectField
          label="Royalty Model"
          name="royaltyModel"
          value={formData.royaltyModel}
          onChange={onChange}
          options={royaltyOptions}
          placeholder="Select Royalty Model"
          required
        />

        <SelectField
          label="Distribution Territory"
          name="territory"
          value={formData.territory}
          onChange={onChange}
          options={territoryOptions}
          placeholder="Select Territory"
          required
        />

        <InputField
          label="Discount Percentage (Optional)"
          name="discount"
          type="number"
          value={formData.discount}
          onChange={onChange}
          placeholder="0"
        />
      </div>

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