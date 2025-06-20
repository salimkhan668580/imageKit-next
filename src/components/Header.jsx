
"use client"

import { useSession ,signOut } from "next-auth/react"
import Link from "next/link"


 function Header() {
  
  const { data: session, status } = useSession();

  
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 border-b border-gray-800 z-50 shadow-md">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      
      {/* Logo or Title */}
      <div className="text-xl font-bold text-white">
        🎥 VideoUploader
      </div>

      {/* Navigation */}
      <nav className="space-x-6">
        <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>
        {session &&
        <>
          <Link href="/upload" className="text-gray-300 hover:text-white transition">Upload</Link>
          <Link href="/profile" className="text-gray-300 hover:text-white transition">Profile</Link>
        </>
          
        
        }
        {session ? (
          <button onClick={() => signOut()} className="text-red-400 cursor-pointer hover:text-red-300">
            Logout
          </button>
        ) : (
          <Link href="/login" className="text-green-400 hover:text-green-300">Login</Link>
        )}
      </nav>
    </div>
  </div>
</header>

  )
}

export default Header