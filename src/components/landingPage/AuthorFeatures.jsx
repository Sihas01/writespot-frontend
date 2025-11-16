import section1_img1 from '../../assets/images/section1_img1.png';
import underlineShape from '../../assets/images/underline.svg';

const AuthorFeatures = () => {
    return (
        <div>
            <div className='section1_bg_full flex flex-col justify-center items-center px-5 md:px-10 lg:px-20'>
                <h2 className='text-3xl md:text-4xl font-poppins-sm text-center text-white mt-12'>Simple Author <span className='text-yellow-400'>Dashboard</span></h2>
                <p className='font-poppins-lt  text-[#d0d6cb]  lg:w-[50%] text-center pt-4 pb-5'>
                    A reader-oriented dashboard designed to provide faster
                    and easier access to books to help users quickly
                    explore and review information about each title.
                </p>
                <img src={section1_img1} alt="author-dashboard" />
            </div>
            <div className='flex flex-col justify-center items-center'>
                <div className='pt-6'>
                    <h1 className="font-qwigley text-6xl text-[#074B03] ">
                        <span className='relative inline-block'>
                            with
                            <img
                                src={underlineShape}
                                alt="underlineimage"
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-auto -z-10"
                            /></span></h1>

                </div>

            </div>
        </div>
    );
}
export default AuthorFeatures;