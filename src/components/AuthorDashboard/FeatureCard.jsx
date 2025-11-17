import React from 'react';

const FeatureCard = ({ title, illustration }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6">
        <img src={illustration} alt="hello" className='h-64 object-contain'/>
      </div>
      <h3 className="text-xl text-[#3F4D61] font-nunito font-normal">{title}</h3>
    </div>
  );
};

export default FeatureCard;