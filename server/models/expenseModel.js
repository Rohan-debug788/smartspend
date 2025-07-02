import db from '../db/database.js';

export const createExpense = (userId, amount, description, category, date) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO expenses (user_id, amount, description, category, date) VALUES (?, ?, ?, ?, ?)');
    stmt.run([userId, amount, description, category, date], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastInsertRowid: this.lastID });
      }
    });
    stmt.finalize();
  });
};

export const getUserExpenses = (userId) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC');
    stmt.all([userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
    stmt.finalize();
  });
};

export const getMonthlyExpenses = (userId, year, month) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      SELECT * FROM expenses 
      WHERE user_id = ? 
      AND strftime('%Y', date) = ? 
      AND strftime('%m', date) = ?
      ORDER BY date DESC
    `);
    stmt.all([userId, year, month], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
    stmt.finalize();
  });
};

export const getExpensesByCategory = (userId, year, month) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      SELECT category, SUM(amount) as total
      FROM expenses 
      WHERE user_id = ? 
      AND strftime('%Y', date) = ? 
      AND strftime('%m', date) = ?
      GROUP BY category
    `);
    stmt.all([userId, year, month], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
    stmt.finalize();
  });
};

export const deleteExpense = (expenseId, userId) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('DELETE FROM expenses WHERE id = ? AND user_id = ?');
    stmt.run([expenseId, userId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
    stmt.finalize();
  });
};