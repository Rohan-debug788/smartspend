import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { createOrUpdateBudget, getCurrentBudget } from '../models/budgetModel.js';

const router = express.Router();

// Get current budget
router.get('/:year/:month', authenticateToken, async (req, res) => {
  try {
    const { year, month } = req.params;
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
    
    const budget = await getCurrentBudget(req.user.userId, monthName, parseInt(year));
    
    if (!budget) {
      return res.json({ monthly_budget: 0 });
    }

    res.json(budget);
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Set or update budget
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { monthly_budget, month, year } = req.body;

    if (!monthly_budget || !month || !year) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
    
    await createOrUpdateBudget(req.user.userId, monthly_budget, monthName, year);
    
    res.json({ message: 'Budget updated successfully' });
  } catch (error) {
    console.error('Set budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;