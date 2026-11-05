import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 text-lg">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}