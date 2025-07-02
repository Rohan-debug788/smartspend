import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
  createExpense,
  getUserExpenses,
  getMonthlyExpenses,
  getExpensesByCategory,
  deleteExpense
} from '../models/expenseModel.js';

const router = express.Router();

// Get all expenses for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const expenses = await getUserExpenses(req.user.userId);
    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get monthly expenses
router.get('/monthly/:year/:month', authenticateToken, async (req, res) => {
  try {
    const { year, month } = req.params;
    const expenses = await getMonthlyExpenses(req.user.userId, year, month.padStart(2, '0'));
    res.json(expenses);
  } catch (error) {
    console.error('Get monthly expenses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get expenses by category
router.get('/categories/:year/:month', authenticateToken, async (req, res) => {
  try {
    const { year, month } = req.params;
    const categories = await getExpensesByCategory(req.user.userId, year, month.padStart(2, '0'));
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new expense
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;

    if (!amount || !description || !category || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await createExpense(req.user.userId, amount, description, category, date);
    
    res.status(201).json({
      message: 'Expense added successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete expense
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteExpense(id, req.user.userId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;