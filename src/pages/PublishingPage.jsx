
import React, { useState } from 'react';
import Stepper from '../components/AuthorDashboard/publishing/Stepper';
import BookDetailsStep from '../components/AuthorDashboard/publishing/BookDetailsStep';
import ContentStep from '../components/AuthorDashboard/publishing/ContentStep';
import PricingStep from '../components/AuthorDashboard/publishing/PricingStep';
import Alert from '../components/AuthorDashboard/publishing/Alert';


const PublishingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
 

  const [formData, setFormData] = useState({
    // Book Details
    language: '',
    title: '',
    subtitle: '',
    authorFirstName: '',
    authorLastName: '',
    isbn: '',
    description: '',
    genre: '',
    keywords: '',
    coverImage: null,

    // Content
    manuscript: null,
    fileFormat: '',
  

    // Pricing
    price: '',
    discount: ''
  });

  const steps = [
    { id: 0, label: 'eBook Details' },
    { id: 1, label: 'eBook Content' },
    { id: 2, label: 'eBook Pricing' }
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else if (files && files.length === 0) {
      setFormData(prev => ({
        ...prev,
        [name]: null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNext = () => {

   if (currentStep === 1) {
    if (!formData.coverImage) {
      setAlert({
        type: 'error',
        message: 'Please upload a cover image.'
      });
      return;
    }

    if (!formData.manuscript) {
      setAlert({
        type: 'error',
        message: 'Please upload your manuscript file.'
      });
      return;
    }
  }

  setAlert(null);

    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setAlert(null);

    try {
      // Create FormData object for file uploads
      const submitData = new FormData();

      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });


      const response = await fetch('http://localhost:3000/api/ebooks', {
        method: 'POST',
        body: submitData
        // Don't set Content-Type header - browser will set it automatically with boundary
      });

      if (!response.ok) {
        throw new Error('Failed to submit eBook');
      }

      const result = await response.json();

      setAlert({
        type: 'success',
        message: 'eBook published successfully!'
      });

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          language: '', title: '', subtitle: '', authorFirstName: '',
          authorLastName: '', isbn: '',
          description: '', genre: '', keywords: '', coverImage: null,
          manuscript: null, fileFormat: '', 
          price: '', discount: ''
        });
        setCurrentStep(0);
      }, 2000);

    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message || 'Failed to publish eBook. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-xl font-medium text-gray-800 mb-12">Publishing Process</h1>
      <Stepper steps={steps} currentStep={currentStep} />
      <div className=" mx-auto bg-white rounded-lg shadow-sm p-4 md:p-8 ">


        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}



        {currentStep === 0 && (
          <BookDetailsStep
            formData={formData}
            onChange={handleInputChange}
            onNext={handleNext}
          />
        )}

        {currentStep === 1 && (
          <ContentStep
            formData={formData}
            onChange={handleInputChange}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <PricingStep
            formData={formData}
            onChange={handleInputChange}
            onBack={handleBack}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};
export default PublishingPage;