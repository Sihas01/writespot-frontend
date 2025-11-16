import backgroundImage from '../../assets/images/backgroundImage.png';
import { FiUploadCloud } from "react-icons/fi";
import { RiBookLine } from "react-icons/ri";

const RegistrationSection = () => {
  return (
    <div
      className="grid lg:grid-cols-2 py-20 px-6 lg:px-25 bg-[#074B03] bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover", 
      }}
    >
      <div className="lg:w-[55%]">
        <h1 className="text-2xl md:text-4xl font-poppins-sm text-white text-center lg:text-left">
          Drop us a line or two, we are open for creative minds and <span className='text-[#FACC15]'>collaborations!</span>
        </h1>
        <div className="flex items-center justify-center lg:justify-start">
          <div className="inline-block bg-white text-black rounded-md mt-6">
            <div className="flex items-center gap-4 pl-6 pr-6 py-3 font-poppins-md text-[#074B03]">
                <FiUploadCloud/>
              Start Publishing
            </div>
          </div>
        </div>
      </div>
      <div className="border-t-2 lg:border-l-2 lg:border-t-0 border-white mt-10 lg:mt-0">
        <div className='pt-10 lg:pt-0 lg:ml-36  lg:w-[55%]'>
            <h1 className="text-2xl md:text-4xl font-poppins-sm text-white text-center lg:text-left">
          Drop us a line or two, we are open for creative minds and <span className='text-[#FACC15]'>collaborations!</span>
        </h1>
        <div className="flex items-center justify-center lg:justify-start">
          <div className="inline-block bg-white text-black rounded-md mt-6">
            <div className="flex items-center gap-4 pl-6 pr-6 py-3 font-poppins-md text-[#074B03]">
                <RiBookLine/>
              Start Reading
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSection;
