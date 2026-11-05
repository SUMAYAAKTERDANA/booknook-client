"use client";

import { Suspense } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, RefreshCw } from "lucide-react";

export default function HomePage() {
  // স্লাইডারের ডেটা
  const slides = [
    {
      id: 1,
      title: "Discover Your Next Favorite Book",
      text: "Explore a vast collection of books across different genres.",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Borrow Anytime, Anywhere",
      text: "Our library is open 24/7. Borrow a book with just one click.",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Share the Joy of Reading",
      text: "Add your own books and share them with the community.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <div className="w-full">
      {/* 1. Swiper Slider Section (Suspense দিয়ে মোড়ানো) */}
      <Suspense fallback={<div className="w-full h-[500px] md:h-[600px] flex items-center justify-center bg-gray-200 text-gray-500">Loading Slider...</div>}>
        <section className="w-full h-[500px] md:h-[600px]">
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="w-full h-full"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* ব্যাকগ্রাউন্ড ইমেজ */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  >
                    <div className="absolute inset-0 bg-black/50" />
                  </div>
                  
                  {/* স্লাইড টেক্সট */}
                  <div className="relative z-10 text-center text-white px-4 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                    <p className="text-lg md:text-xl mb-8">{slide.text}</p>
                    <Link href="/books">
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                        Browse Books
                      </Button>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </Suspense>

      {/* 2. Extra Section: How Borrowing Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">How Borrowing Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex justify-center mb-4 text-blue-600">
                <BookOpen size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Browse Books</h3>
              <p className="text-gray-600">Explore our vast collection and find the book you want to read.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex justify-center mb-4 text-blue-600">
                <Users size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Borrow Easily</h3>
              <p className="text-gray-600">Click borrow, and the book is yours for the next few days.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex justify-center mb-4 text-blue-600">
                <RefreshCw size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Return on Time</h3>
              <p className="text-gray-600">Return the book when you are done and let others enjoy it too.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Extra Section: Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose BookNook?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            We provide a seamless experience for book lovers. Whether you want to read or share, BookNook is your ultimate destination.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="border p-4 rounded-lg">
              <h4 className="font-bold text-lg text-blue-600 mb-2">10,000+</h4>
              <p className="text-gray-600">Books Available</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h4 className="font-bold text-lg text-blue-600 mb-2">5,000+</h4>
              <p className="text-gray-600">Active Readers</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h4 className="font-bold text-lg text-blue-600 mb-2">24/7</h4>
              <p className="text-gray-600">Accessibility</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h4 className="font-bold text-lg text-blue-600 mb-2">100%</h4>
              <p className="text-gray-600">Free to Borrow</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 4. New Arrivals Section Placeholder */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">New Arrivals</h2>
            <Link href="/books">
               <Button variant="outline">See All Books</Button>
            </Link>
          </div>
          {/* এখানে পরবর্তী ধাপে ডাটাবেস থেকে বই দেখানো হবে */}
          <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
             [New Arrivals Books from Database will appear here soon]
          </div>
        </div>
      </section>

    </div>
  );
}