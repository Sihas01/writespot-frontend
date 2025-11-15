import { FaArrowRightLong } from "react-icons/fa6";
import guawashape from '../assets/images/Vector.svg';
import girl from '../assets/images/girl.png';
import underlineShape from '../assets/images/underlineShape.svg';


const HeroSection = () => {
    return (
        <div className="pl-3 pr-3 md:pl-8 md:pr-8 lg:pl-25 min-h-screen block z-10 relative overflow-hidden">
            <div className="pt-36 lg:pt-[15vh] grid lg:grid-cols-2 items-center lg:h-screen">
                <div className="flex flex-col lg:gap-16">
                    <div >
                        <h1 className="font-poppins-sm text-[42px] text-center lg:text-left lg:text-[64px] lg:w-[643px] leading-[96%] text-[#074B03]">
                            Where Stories Find Their <span className="relative inline-block pb-2">
                                Audience.
                                <img
                                    src={underlineShape}
                                    alt="underlineimage"
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2  h-auto -z-10"
                                />
                            </span>
                        </h1>
                        <p className="font-poppins-rg text-[18px] text-center mx-auto lg:mx-0 lg:text-left w-[80%] lg:w-[529px] pt-6">The ultimate platform for authors to publish their work and for readers to discover captivating new worlds.</p>

                        <div className="flex items-center justify-center lg:justify-start">
                            <div className="inline-block bg-[#074B03] text-white rounded-md mt-6">
                                <div className="flex items-center gap-14 p-4 font-poppins-md">
                                    Get Started
                                    <FaArrowRightLong />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start">
                        <div className="social-media flex gap-4 font-poppins-rg mt-20 underline mb-8 lg:mb-0">
                            <a href="#">YouTube</a>
                            <a href="#">Facebook</a>
                            <a href="#">Instagram</a>
                            <a href="#">Google</a>

                        </div>
                    </div>
                </div>

                <div className="overflow-hidden ">
                    <div className="flex items-center justify-center ">
                        <img
                            src={guawashape}
                            alt="guawashape"
                            className="w-full sm:w-[80vw] lg:max-w-[50vw] lg:max-h-[86vh] object-contain mx-auto"
                        />
                    </div>

                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0 w-[85vw] lg:w-auto">
                        <img
                            src={girl}
                            alt="girl"
                            className="w-full lg:w-[50vw]"
                        />
                    </div>

                </div>

            </div>

        </div>
    )
}


export default HeroSection;