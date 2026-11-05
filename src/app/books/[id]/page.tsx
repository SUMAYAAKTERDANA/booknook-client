"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  userName: string;
  userEmail: string;
}

export default function BookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [borrowing, setBorrowing] = useState(false);

  // data fetch
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books/${id}`);
        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.error("Failed to fetch book", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBook();
  }, [id]);

  // privat route protection
  useEffect(() => {
    if (!isPending && !session) {
      router.push(`/login?callbackUrl=/books/${id}`);
    }
  }, [session, isPending, router, id]);

  const handleBorrow = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/books/${id}`);
      return;
    }

    setBorrowing(true);
    try {
      const borrowData = {
        bookId: book?._id,
        bookTitle: book?.title,
        bookImage: book?.image,
        userEmail: session.user.email,
        userName: session.user.name,
        borrowDate: new Date(),
        returnDate: new Date(new Date().setDate(new Date().getDate() + 7)), // ৭ দিন পর ফেরত
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(borrowData),
      });

      if (res.ok) {
        toast.success("Book borrowed successfully!");
        setIsModalOpen(false);
        router.push("/my-borrows");
      } else {
        
        const errorData = await res.json();
        console.log("Server Error Details:", errorData);
        toast.error(errorData.message || "Failed to borrow book!");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Something went wrong!");
    } finally {
      setBorrowing(false);
    }
  };

  if (loading || isPending) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) {
    return <p className="text-center mt-10">Book not found!</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
       
        <div className="md:w-1/2 h-80 md:h-auto relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>

      
        <div className="md:w-1/2 p-8 flex flex-col">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
            {book.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
          <p className="text-lg text-gray-600 mb-4">by {book.author}</p>
          
          <p className="text-gray-700 mb-6 grow">{book.description}</p>

          <div className="mb-6 space-y-2">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Added by:</span> {book.userName}
            </p>
            <p className={`text-sm font-medium ${book.totalCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {book.totalCopies > 0 ? `Available Copies: ${book.totalCopies}` : "Currently Not Available"}
            </p>
          </div>

          <Button 
            onClick={() => setIsModalOpen(true)}
            disabled={book.totalCopies <= 0}
            className={`w-full py-6 text-lg font-bold ${book.totalCopies > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {book.totalCopies > 0 ? "Borrow This Book" : "Not Available"}
          </Button>
        </div>
      </div>

      {/* Borrow Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Borrow</h2>
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm text-gray-500">User Name</label>
                <input type="text" value={session?.user.name || ""} readOnly className="w-full bg-gray-100 p-2 rounded border" />
              </div>
              <div>
                <label className="block text-sm text-gray-500">User Email</label>
                <input type="email" value={session?.user.email || ""} readOnly className="w-full bg-gray-100 p-2 rounded border" />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleBorrow} disabled={borrowing} className="bg-blue-600 hover:bg-blue-700">
                {borrowing ? "Borrowing..." : "Confirm Borrow"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}