"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function AddBookPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Fiction",
    description: "",
    totalCopies: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please upload a book cover image!");
      return;
    }

    setLoading(true);

    try {
      
      const imageFormData = new FormData();
      imageFormData.append("image", imageFile);

      const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: "POST",
        body: imageFormData,
      });
      const imgData = await imgRes.json();
      
      if (!imgData.success) {
        throw new Error("Image upload failed");
      }

      const imageUrl = imgData.data.url;

     
      const bookData = {
        ...formData,
        image: imageUrl,
        userName: session?.user.name,
        userEmail: session?.user.email,
        addedDate: new Date().toISOString(),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });

      if (res.ok) {
        toast.success("Book added successfully!");
        router.push("/books"); 
      } else {
        toast.error("Failed to add book to database");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Add a New Book</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
            <input type="text" name="title" required onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
            <input type="text" name="author" required onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-blue-500 bg-white">
              <option value="Fiction">Fiction</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Kids">Kids</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies</label>
            <input type="number" name="totalCopies" min="1" defaultValue={1} required onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Book Image</label>
          <input type="file" accept="image/*" required onChange={handleImageChange} className="w-full px-3 py-2 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
          <textarea name="description" required rows={4} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-blue-500"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-md">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">User Name (Read Only)</label>
            <input type="text" value={session?.user.name || ""} readOnly className="w-full px-3 py-2 border bg-gray-100 rounded-md text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">User Email (Read Only)</label>
            <input type="email" value={session?.user.email || ""} readOnly className="w-full px-3 py-2 border bg-gray-100 rounded-md text-gray-500 cursor-not-allowed" />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
          {loading ? "Adding Book..." : "Add Book"}
        </Button>
      </form>
    </div>
  );
}