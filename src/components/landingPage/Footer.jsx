const Footer = () => {
    return (
        <div className="w-full py-5 px-6 md:px-16 lg:px-32 bg-[#F8F8F8]">
            <div className="flex flex-col lg:flex-row lg:justify-between gap-8 border-t border-[#8f9292] pt-5">
                <div className="flex flex-col gap-4">

                    <p className="font-poppins-rg text-sm lg:w-[400px]">© Copyright 2024, All Rights Reserved</p>
                </div>
                <div className="flex gap-4">

                    <p className="font-poppins-rg text-sm">Privacy Policy</p>
                    <p className="font-poppins-rg text-sm"> Terms & Conditions</p>

                </div>
            </div>
        </div>
    );
};

export default Footer;  