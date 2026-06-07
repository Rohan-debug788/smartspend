import React from 'react';

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">SmartSpend</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name}!</span>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-gray-600 text-sm font-medium">Total Balance</h2>
            <p className="text-3xl font-bold text-indigo-600 mt-2">$0.00</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-gray-600 text-sm font-medium">Monthly Budget</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">$0.00</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-gray-600 text-sm font-medium">Spent This Month</h2>
            <p className="text-3xl font-bold text-red-600 mt-2">$0.00</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Expenses</h2>
          <p className="text-gray-600">No expenses recorded yet. Start by adding your first expense!</p>
        </div>
      </div>
    </div>
  );
}
