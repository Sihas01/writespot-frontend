const DashboardHighlights = () => {
    return (
        <div >
           <div className="px-5 md:px-10 lg:px-28 grid md:grid-cols-3 gap-6 mt-10">
             <div className="border px-6 py-10 md:px-10 md:py-24 rounded border-[#727A75]">
                <h1 className="font-poppins-sm text-center text-[#074B03]">Create & Refine</h1>
                <p className="font-poppins-rg text-center mt-4">Our intuitive tools make writing, formatting, and designing your book cover a seamless experience.</p>
            </div>
            <div className="border px-6 py-10 md:px-10 md:py-24 rounded border-[#727A75]">
                <h1 className="font-poppins-sm text-center text-[#074B03]">Publish Instantly</h1>
                <p className="font-poppins-rg text-center mt-4">Our intuitive tools make writing, formatting, and designing your book cover a seamless experience.</p>
            </div>
            <div className="border px-6 py-10 md:px-10 md:py-24 rounded border-[#727A75]">
                <h1 className="font-poppins-sm text-center text-[#074B03]">Track Your Success</h1>
                <p className="font-poppins-rg text-center mt-4">Our intuitive tools make writing, formatting, and designing your book cover a seamless experience.</p>
            </div>
           </div>
        </div>
    );
}
export default DashboardHighlights;