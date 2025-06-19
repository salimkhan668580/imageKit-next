'use client';

import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function UserProfile() {
  const { data: session } = useSession()
  const [user, setUser] = useState<{}>({})

  useEffect(() => {
 if (session) {
      getUser(session);
    }
  }, [session]);
  async function getUser(session:Session){
    try {
      const res = await fetch(`http://localhost:3000/api/user`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ email: session?.user.email })
      });
      const data = await res.json();
      setUser(data.getUser)
      console.log("user data",data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  return (
   
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
        {/* Profile Picture */}
        <div className="flex flex-col items-center text-center">
          <Image
            src={user?.image}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full border-2 border-gray-600"
          />
          <h2 className="text-2xl font-bold mt-4">{user?.name || 'Unknown User'}</h2>
          <p className="text-gray-400 text-sm">{user?.provider || 'local'} account</p>
        </div>

        {/* Info Section */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400">Email</label>
            <p className="text-lg">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400">Joined</label>
            <p className="text-lg">
              {new Date(user?.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-between">
          <button className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-semibold">
            Edit Profile
          </button>
          <button className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-semibold">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
