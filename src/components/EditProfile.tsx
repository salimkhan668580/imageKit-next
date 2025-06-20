'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function EditProfile() {
    const { data: session } = useSession();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [email, setEmail] = useState(''); // assume readonly

  // Example: prefill with current user data (replace with actual session/user fetch)
  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch(`/api/user/`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session?.user.email }),

      }); // your backend API
      const data = await res.json();
      console.log('Fetched user data:', data.getUser);
      setName(data.getUser.name || '');
      setImage(data.getUser.image || '');
      setEmail(data.getUser.email || '');
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, image,email:session?.user.email }),
    });

    const result = await res.json();
    if(!res.ok) return toast.error(result.error);
    toast.success(result.message);
    console.log('Updated:', result);

  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Edit Profile</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your name"
              required
            />
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Profile Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://..."
            />
          </div>

          {/* Email - Readonly */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-2 bg-gray-800 text-gray-400 border border-gray-700 rounded-lg cursor-not-allowed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition duration-200"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
