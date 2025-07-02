import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { expensesAPI, budgetAPI } from '../services/api';
import { DollarSign, TrendingUp, Calendar, PlusCircle, Target, CreditCard, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];
const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'];

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [budget, setBudget] = useState({ monthly_budget: 0 });
  const [budgetInput, setBudgetInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesRes, monthlyRes, categoriesRes, budgetRes] = await Promise.all([
        expensesAPI.getAll(),
        expensesAPI.getMonthly(currentYear, currentMonth),
        expensesAPI.getByCategory(currentYear, currentMonth),
        budgetAPI.get(currentYear, currentMonth)
      ]);

      setExpenses(expensesRes.data);
      setMonthlyExpenses(monthlyRes.data);
      setCategoryData(categoriesRes.data.map(cat => ({
        name: cat.category,
        value: cat.total,
        amount: cat.total
      })));
      setBudget(budgetRes.data);
      setBudgetInput(budgetRes.data.monthly_budget || '');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await expensesAPI.delete(expenseId);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    try {
      await budgetAPI.set({
        monthly_budget: parseFloat(budgetInput),
        month: currentMonth,
        year: currentYear
      });
      fetchData();
      setShowBudgetForm(false);
    } catch (error) {
      console.error('Error setting budget:', error);
    }
  };

  const totalMonthlySpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budgetProgress = budget.monthly_budget ? (totalMonthlySpent / budget.monthly_budget) * 100 : 0;
  const remainingBudget = budget.monthly_budget - totalMonthlySpent;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Overview
            </p>
          </div>
          <Link
            to="/add-expense"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Expense</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Monthly Spent</p>
                <p className="text-2xl font-bold text-gray-900">${totalMonthlySpent.toFixed(2)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Monthly Budget</p>
                <p className="text-2xl font-bold text-gray-900">${budget.monthly_budget?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Remaining</p>
                <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${remainingBudget.toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">{monthlyExpenses.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Budget Progress</h3>
            <button
              onClick={() => setShowBudgetForm(!showBudgetForm)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {budget.monthly_budget ? 'Update Budget' : 'Set Budget'}
            </button>
          </div>
          
          {showBudgetForm && (
            <form onSubmit={handleSetBudget} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="Enter monthly budget"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          {budget.monthly_budget > 0 && (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>${totalMonthlySpent.toFixed(2)} spent</span>
                <span>${budget.monthly_budget.toFixed(2)} budget</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    budgetProgress > 100 ? 'bg-red-500' : budgetProgress > 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                {budgetProgress.toFixed(1)}% of budget used
              </p>
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Pie Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No expense data for this month
              </div>
            )}
          </div>

          {/* Recent Expenses */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {monthlyExpenses.slice(0, 8).map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    <p className="text-sm text-gray-600">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">${expense.amount.toFixed(2)}</span>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {monthlyExpenses.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No expenses recorded this month
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;