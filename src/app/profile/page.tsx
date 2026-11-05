"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) return <div className="text-center mt-20">Loading...</div>;
  if (!session) return null;

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow-md text-center">
      <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-blue-100">
        <AvatarImage src={session.user.image || ""} />
        <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{session.user.name}</h1>
      <p className="text-gray-600 mb-6">{session.user.email}</p>
      
      <div className="bg-gray-50 p-4 rounded-lg text-left">
        <h3 className="font-semibold text-gray-700 mb-2">Account Status</h3>
        <p className="text-sm text-green-600 font-medium">✓ Logged In</p>
      </div>
    </div>
  );
}