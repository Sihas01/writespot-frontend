import { FaArrowRightLong } from "react-icons/fa6";
import guawashape from '../assets/images/Vector.svg';
import girl from '../assets/images/girl.png';


const HeroSection = () => {
    return (
        <div className="pl-4 md:pl-25 min-h-screen block z-10 relative">
            <div className="pt-32 grid md:grid-cols-2 items-center ">
                <div>
                    <h1 className="font-poppins-sm text-[42px] text-center md:text-left md:text-[64px] md:w-[643px] leading-[96%] text-[#074B03]">Where Stories Find Their Audience.</h1>
                    <p className="font-poppins-rg text-[18px] text-center mx-auto md:mx-0 md:text-left w-[80%] md:w-[529px] pt-6">The ultimate platform for authors to publish their work and for readers to discover captivating new worlds.</p>

                    <div className="flex items-center justify-center md:justify-start">
                        <div className="inline-block bg-[#074B03] text-white rounded-md mt-6">
                            <div className="flex items-center gap-14 p-4 font-poppins-md">
                                Get Started
                                <FaArrowRightLong />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                        <div className="social-media flex gap-4 font-poppins-rg mt-20 underline">
                            <a href="#">YouTube</a>
                            <a href="#">Facebook</a>
                            <a href="#">Instagram</a>
                            <a href="#">Google</a>

                        </div>
                    </div>
                </div>

                <div className=" ">
                    <div className="flex items-center justify-center">
                        <img
                            src={guawashape}
                            alt="guawashape"
                            className="h-[400px] w-auto object-contain mx-auto md:h-[500px] lg:h-[600px]"
                        />
                    </div>

                    <div className="absolute bottom-0 right-[-20]">
                        <img
                            src={girl}
                            alt="girl"
                            className="h-[400px] w-[600px] object-cover md:h-[500px] md:w-[750px] lg:h-[600px] lg:w-[900px]"
                        />
                    </div>
                </div>

            </div>

        </div>
    )
}


export default HeroSection;