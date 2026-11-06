"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";

interface Book {
  _id: string;
  title: string;
  author: string;
  image: string;
  category: string;
  totalCopies: number;
  description: string;
  userEmail: string;
}

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [updating, setUpdating] = useState(false);

  const [editFormData, setEditFormData] = useState({
    title: "",
    author: "",
    category: "Fiction",
    totalCopies: 1,
    description: "",
  });

  useEffect(() => {
    document.title = "BookNook | My Books"; 
    const fetchMyBooks = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books`);
          const data = await res.json();
          const myBooks = data.filter((book: Book) => book.userEmail === session.user.email);
          setBooks(myBooks);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else if (!isPending && !session) {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [session, isPending]);

  
  useEffect(() => {
    if (!isPending && !session && !loading) {
      router.push("/login");
    }
  }, [session, isPending, loading, router]);

  const handleEditClick = (book: Book) => {
    setEditBook(book);
    setEditFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      totalCopies: book.totalCopies,
      description: book.description || "",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBook) return;

    setUpdating(true);
    try {
      const { data: tokenData } = await authClient.token();

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books/${editBook._id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenData?.token}`, 
        },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        toast.success("Book updated successfully!");
        setBooks(books.map((b) => b._id === editBook._id ? { ...b, ...editFormData } : b));
        setEditBook(null);
      } else {
        toast.error("Failed to update book");
      }
    } catch  {
      toast.error("Something went wrong!");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { data: tokenData } = await authClient.token();

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${tokenData?.token}`,
        },
      });

      if (res.ok) {
        toast.success("Book deleted successfully!");
        setBooks(books.filter((b) => b._id !== deleteId));
        setDeleteId(null);
      } else {
        toast.error("Failed to delete book");
      }
    } catch{
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
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">My Books</h1>

      {books.length === 0 ? (
        <p className="text-center text-gray-500">You haven&apos;t added any books yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book._id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
              <div className="w-full h-56 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
              </div>

              <div className="p-4 flex flex-col grow">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1 line-clamp-1">{book.title}</h2>
                <p className="text-sm text-gray-600 mb-4">by {book.author}</p>
                
                <div className="mt-auto grid grid-cols-3 gap-2">
                  <Link href={`/books/${book._id}`}>
                    <Button variant="outline" className="w-full px-2 text-xs">View</Button>
                  </Link>
                  <Button onClick={() => handleEditClick(book)} className="bg-green-600 hover:bg-green-700 px-2 text-xs text-white">
                    Edit
                  </Button>
                  <Button onClick={() => setDeleteId(book._id)} className="bg-red-500 hover:bg-red-600 px-2 text-xs text-white">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Are you sure?</h2>
            <p className="text-gray-600 mb-6">Do you really want to delete this book?</p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {editBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Edit Book</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
                <input type="text" value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} required className="w-full px-3 py-2 border rounded-md focus:outline-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                <input type="text" value={editFormData.author} onChange={(e) => setEditFormData({...editFormData, author: e.target.value})} required className="w-full px-3 py-2 border rounded-md focus:outline-blue-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={editFormData.category} onChange={(e) => setEditFormData({...editFormData, category: e.target.value})} className="w-full px-3 py-2 border rounded-md focus:outline-blue-500 bg-white">
                    <option value="Fiction">Fiction</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Kids">Kids</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies</label>
                  <input type="number" min="1" value={editFormData.totalCopies} onChange={(e) => setEditFormData({...editFormData, totalCopies: Number(e.target.value)})} required className="w-full px-3 py-2 border rounded-md focus:outline-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <textarea value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} required rows={3} className="w-full px-3 py-2 border rounded-md focus:outline-blue-500"></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditBook(null)}>Cancel</Button>
                <Button type="submit" disabled={updating} className="bg-blue-600 hover:bg-blue-700">
                  {updating ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}