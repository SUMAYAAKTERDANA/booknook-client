"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  totalCopies: number;
}

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "BookNook | All Books"; 
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books`);
        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">All Books</h1>
      
      {books.length === 0 ? (
        <p className="text-center text-gray-500">No books available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {books.map((book) => (
            <div key={book._id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
              
             
              <div className="w-full h-56 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 flex flex-col grow">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">{book.category}</span>
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1 line-clamp-1">{book.title}</h2>
                <p className="text-sm text-gray-600 mb-4 line-clamp-1">by {book.author}</p>
                
                <div className="mt-auto">
                  <p className={`text-sm mb-3 font-medium ${book.totalCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {book.totalCopies > 0 ? `Available: ${book.totalCopies}` : "Not Available"}
                  </p>
                  <Link href={`/books/${book._id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">View Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}