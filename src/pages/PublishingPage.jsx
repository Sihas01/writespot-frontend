
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

  const token = localStorage.getItem("token");

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
    discount: '',
    drmEnabled: false,

  });

  const steps = [
    { id: 0, label: 'eBook Details' },
    { id: 1, label: 'eBook Content' },
    { id: 2, label: 'eBook Pricing' }
  ];

  const handleInputChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (files && files.length > 0) {
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
      const updatedFormData = { ...formData };

      // List of files to upload
      const filesToUpload = ['coverImage', 'manuscript'];

      for (const field of filesToUpload) {
        if (formData[field]) {
          // 1️⃣ Request a pre-signed URL from your Lambda
          const presignResponse = await fetch(
            'https://h4urlwkjgd.execute-api.us-east-1.amazonaws.com/generate-upload-url',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileName: formData[field].name,
                fileType: formData[field].type,
                fileField: field,
                userRole: 'author', // or dynamically from your auth
              }),
            }
          );

          if (!presignResponse.ok) {
            throw new Error(`Failed to get upload URL for ${field}`);
          }

          const { uploadUrl, key } = await presignResponse.json();

          // 2️⃣ Upload the file to S3 using the pre-signed URL
          const uploadResult = await fetch(uploadUrl, {
            method: 'PUT',
            body: formData[field],
            headers: {
              'Content-Type': formData[field].type,
            },
          });

          if (!uploadResult.ok) {
            throw new Error(`Failed to upload ${field} to S3`);
          }

          // 3️⃣ Replace file object with S3 key
          updatedFormData[field] = key;
        }
      }

      // 4️⃣ Submit final data to backend (without files, just keys)
      const response = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit eBook');
      }

      setAlert({ type: 'success', message: 'eBook published successfully!' });
      console.log(formData);

      // Reset form
      setTimeout(() => {
        setFormData({
          language: '', title: '', subtitle: '', authorFirstName: '',
          authorLastName: '', isbn: '',
          description: '', genre: '', keywords: '', coverImage: null,
          manuscript: null, fileFormat: '',
          price: '', discount: '',drmEnabled: false
        });
        setCurrentStep(0);
      }, 2000);

    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Upload failed' });
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