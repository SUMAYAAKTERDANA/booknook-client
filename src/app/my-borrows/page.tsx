"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  borrowDate: string;
  returnDate: string;
  userEmail: string;
}

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);

  // data featch
  useEffect(() => {
    const fetchBorrows = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/borrows?email=${session.user.email}`);
          const data = await res.json();
          setBorrows(data);
        } catch (error) {
          console.error("Failed to fetch borrows", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (session) fetchBorrows();
  }, [session]);

  // protection
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleReturn = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/borrows/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Book returned successfully!");
        setBorrows(borrows.filter((b) => b._id !== id)); 
      } else {
        toast.error("Failed to return book");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  if (loading || isPending) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Borrows</h1>

      {borrows.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">You haven't borrowed any books yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-4 border-b">Book</th>
                <th className="p-4 border-b">Borrow Date</th>
                <th className="p-4 border-b">Return Date</th>
                <th className="p-4 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((borrow) => (
                <tr key={borrow._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 flex items-center space-x-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={borrow.bookImage} alt={borrow.bookTitle} className="w-12 h-16 object-cover rounded" />
                    <span className="font-semibold text-gray-800">{borrow.bookTitle}</span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(borrow.borrowDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(borrow.returnDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <Button onClick={() => handleReturn(borrow._id)} variant="destructive" className="bg-red-500 hover:bg-red-600">
                      Return Book
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}