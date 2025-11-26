import readerStore from '../../assets/images/readerStore.png';

const ReaderFeatures = () => {
    return (
        <div className="reader-features-section bg-white py-20 px-5 md:px-10 lg:px-20">
            <h2 className="text-3xl md:text-4xl font-poppins-sm text-center mb-6 text-[#074B03]">Explore Vast Amount of books in our <span className="text-[#FACC15]"> Store!</span></h2>
            <p className="font-poppins-lt lg:w-[50%] text-center mx-auto text-[#3F4D61]">Reader oriented simple dashboard to enable faster access to books and show all the book details which helps users to quickly inspect book details.</p>

           <div className='pt-10 flex items-center justify-center'>
             <img src={readerStore} alt="Reader Store" />
           </div>
        </div>
    );
}

export default ReaderFeatures;