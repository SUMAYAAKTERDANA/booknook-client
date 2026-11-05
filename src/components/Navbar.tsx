"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "All Books", path: "/books" },
  ];

  const privateLinks = [
    { name: "Add Book", path: "/add-book" },
    { name: "My Books", path: "/my-books" },
    { name: "My Borrows", path: "/my-borrows" },
  ];

  const authButtons = session ? null : (
    <div className="flex flex-col space-y-2 mt-4 md:flex-row md:space-y-0 md:space-x-2 md:mt-0">
      <Link href="/login">
        <Button variant="ghost" className="w-full md:w-auto">Login</Button>
      </Link>
      <Link href="/register">
        <Button className="w-full md:w-auto bg-blue-600 text-white hover:bg-blue-700">Register</Button>
      </Link>
    </div>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              📚 BookNook
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {publicLinks.map((link) => (
              <Link key={link.name} href={link.path} className="text-gray-700 hover:text-blue-600 font-medium">
                {link.name}
              </Link>
            ))}
            {session && privateLinks.map((link) => (
              <Link key={link.name} href={link.path} className="text-gray-700 hover:text-blue-600 font-medium">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side (Auth & Mobile Menu) */}
          <div className="flex items-center space-x-4">
            {isPending ? (
              <span className="text-gray-500 text-sm">Loading...</span>
            ) : session ? (
              <DropdownMenu>
                
                <DropdownMenuTrigger className="relative h-10 w-10 rounded-full border-2 border-blue-500 overflow-hidden focus:outline-none">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                    <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-2">
                {authButtons}
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Sheet>
                
                <SheetTrigger className="inline-flex items-center justify-center rounded-md hover:bg-gray-100 h-10 w-10 cursor-pointer border-none bg-transparent">
                  <Menu className="h-6 w-6" />
                </SheetTrigger>
                <SheetContent side="right" className="w-62.5 sm:w-75">
                  <div className="flex flex-col space-y-4 mt-8">
                    {publicLinks.map((link) => (
                      <Link key={link.name} href={link.path} className="text-gray-700 hover:text-blue-600 font-medium text-lg">
                        {link.name}
                      </Link>
                    ))}
                    {session && privateLinks.map((link) => (
                      <Link key={link.name} href={link.path} className="text-gray-700 hover:text-blue-600 font-medium text-lg">
                        {link.name}
                      </Link>
                    ))}
                    {!session && (
                      <div className="pt-4 border-t border-gray-200">
                        {authButtons}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}