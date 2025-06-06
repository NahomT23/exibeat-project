import Link from 'next/link';
import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6 text-center">
        <p className="text-gray-600">
         Get started.
        </p>
        <div className="space-y-4">
          <Link href="/producer">
            <p className="block w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
              Producer Dashboard
            </p>
          </Link>
          <Link href="/dj">
            <p className="block w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition mt-5">
              DJ Dashboard
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
