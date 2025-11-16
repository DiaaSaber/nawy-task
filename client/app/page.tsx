'use client';

import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch users');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-4 text-gray-800 dark:text-white">
            Nawy Task
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
            Monorepo with Next.js + Tailwind & Node.js + Express + PostgreSQL
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
              Users
            </h2>

            {loading && (
              <p className="text-gray-600 dark:text-gray-300">Loading users...</p>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {!loading && !error && users.length === 0 && (
              <p className="text-gray-600 dark:text-gray-300">
                No users found. The database is empty.
              </p>
            )}

            {!loading && !error && users.length > 0 && (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                      {user.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <a
              href="http://localhost:3001/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              View API Documentation
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
