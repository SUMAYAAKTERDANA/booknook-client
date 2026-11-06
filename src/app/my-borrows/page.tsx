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

  // ডাটা ফেচ
  useEffect(() => {
    document.title = "BookNook | My Borrows";
    
    const fetchBorrows = async () => {
      if (session?.user?.email) {
        try {
         
          const { data: tokenData } = await authClient.token();

          
          const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/borrows?email=${session.user.email}`, {
            headers: {
              "Authorization": `Bearer ${tokenData?.token}`
            }
          });
          
          const data = await res.json();
          
         
          if (Array.isArray(data)) {
            setBorrows(data);
          } else {
            console.error("Expected array but got:", data);
            setBorrows([]); 
          }

        } catch (error) {
          console.error("Failed to fetch borrows", error);
          setBorrows([]);
        } finally {
          setLoading(false);
        }
      } else if (!isPending && !session) {
       
        setLoading(false);
      }
    };

    fetchBorrows();
  }, [session, isPending]);
 
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleReturn = async (id: string) => {
    try {
     
      const { data: tokenData } = await authClient.token();

      
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/borrows/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${tokenData?.token}`
        },
      });

      if (res.ok) {
        toast.success("Book returned successfully!");
        setBorrows(borrows.filter((b) => b._id !== id)); 
      } else {
        toast.error("Failed to return book");
      }
    } catch {
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
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">My Borrows</h1>

      {borrows.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">You haven&apos;t borrowed any books yet.</p>
      ) : (
        <>
        
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
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
                    <td className="p-4 text-gray-600">{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                    <td className="p-4 text-gray-600">{new Date(borrow.returnDate).toLocaleDateString()}</td>
                    <td className="p-4 text-center">
                      <Button onClick={() => handleReturn(borrow._id)} className="bg-red-500 hover:bg-red-600 text-white">
                        Return Book
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

         
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {borrows.map((borrow) => (
              <div key={borrow._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-3">
                <div className="flex items-center space-x-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={borrow.bookImage} alt={borrow.bookTitle} className="w-16 h-20 object-cover rounded" />
                  <div>
                    <h3 className="font-bold text-gray-800">{borrow.bookTitle}</h3>
                    <p className="text-sm text-gray-500 mt-1">Borrowed: {new Date(borrow.borrowDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">Return: {new Date(borrow.returnDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button onClick={() => handleReturn(borrow._id)} className="w-full bg-red-500 hover:bg-red-600 text-white mt-2">
                  Return Book
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}