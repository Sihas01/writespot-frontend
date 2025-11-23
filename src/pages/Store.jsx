import axios from "axios";
import { useEffect, useState } from "react";
import banner from '../assets/images/banner.png'

const Store = () => {
    const [books, setBooks] = useState([]);


    useEffect(() => {
        axios.get("http://localhost:3000/books")
            .then((res) => {
                console.log(res.data);
                setBooks(res.data);
            });
    }, []);

    return (
        <div className="">
            

            <img src={banner} alt="banner" className="w-full"/>

            <h3 className="mt-10 font-nunito text-xl">New Arrival</h3>
            <p className="font-nunito font-light">Explore our latest collection of books</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {books.map(book => (
                    <div
                        key={book._id}
                        className="p-3 rounded-md flex flex-col  shadow-sm"
                    >

                        <img
                            src={book.coverUrl}
                            alt=""
                            className="w-full max-h-60 object-contain rounded-md"
                        />

                        <div className="px-2 flex flex-col mt-3">

                            <div className="flex items-center justify-between">
                                <p className="text-[15px] font-medium font-nunito">{book.title}</p>
                                <h3 className="text-sm font-semibold">Free</h3>
                            </div>

                            <p className="font-light text-[14px] font-nunito ">{book.author?.firstName} {book.author?.lastName}</p>
                            <p className="text-yellow-500 text-sm mt-2">⭐⭐⭐⭐⭐</p>

                            <div className="mt-4 bg-[#5A7C65] py-2 text-center text-white rounded-lg cursor-pointer ">
                                Add To Library
                            </div>
                        </div>
                    </div>
                ))}
            </div>



        </div>
    );
}
export default Store;