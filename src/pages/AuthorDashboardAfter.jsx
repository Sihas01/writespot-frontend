import React, { useEffect, useState } from "react";
import axios from "axios";

const AuthorDashboardAfter = () => {
    const [books, setBooks] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const userName = user?.name;

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `http://localhost:3000/books/mybooks`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setBooks(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBooks();
    }, []);

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-nunito font-semibold text-[#5A7C65] mb-6">
                Welcome Back, {userName.split(" ")[0]}
            </h2>

            <h3 className="mb-4 text-xl font-nunito font-normal text-[#3F4D61]">Trending Books</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
                {books.map((book) => (
                    <div key={book._id} >
                        {/* <h3>{book.title}</h3> */}
                        {book.coverUrl ? (
                            <img src={book.coverUrl} alt={book.title} className="w-40 h-60 object-cover" />
                        ) : (
                            <div className="w-40 h-60 bg-gray-200 flex items-center justify-center">
                                No Cover
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <h3 className="mb-4 text-xl  mt-10 font-nunito font-normal text-[#3F4D61]">Book Analytics</h3>
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-0 text-center ">
                <thead>
                    <tr >
                        <th className=" px-8 py-4">Cover Page</th>
                        <th className=" px-8 py-4">Book Details</th>
                        <th className=" px-8 py-4">Views</th>
                        <th className=" px-8 py-4">Downloads</th>
                        <th className=" px-8 py-4">Rating</th>
                        <th className=" px-8 py-4">Like</th>
                        <th className=" px-8 py-4">Dislike</th>
                        <th className=" px-8 py-4">Action</th>

                    </tr>
                </thead>

                <tbody>
                    {books.map((book) => (
                        <tr key={book._id}>
                            <td className=" px-8 py-4 flex items-center justify-center" >
                                {book.coverUrl ? (
                                    <img
                                        src={book.coverUrl}
                                        alt={book.title}
                                        className="w-14 h-20 object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-400">No Cover</span>
                                )}
                            </td>
                            <td className="px-8 py-4 text-left">
                                <div className="font-semibold">{book.title}</div>
                                <div className="text-sm text-gray-600">
                                    {book.author?.firstName} {book.author?.lastName}
                                </div>
                            </td>



                            <td className=" px-8 py-4">
                                250
                            </td>
                            <td className=" px-8 py-4">
                                250
                            </td>
                            <td className=" px-8 py-4">
                                5
                            </td>
                            <td className=" px-8 py-4">
                                100
                            </td>
                            <td className=" px-8 py-4">
                                02
                            </td>
                            <td className=" px-8 py-4">
                                View More
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>

        </div>
    );
};

export default AuthorDashboardAfter;
