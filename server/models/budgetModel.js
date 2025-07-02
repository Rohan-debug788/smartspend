import db from '../db/database.js';

export const createOrUpdateBudget = (userId, monthlyBudget, month, year) => {
  return new Promise((resolve, reject) => {
    // First try to update existing budget
    const updateStmt = db.prepare(`
      UPDATE budgets 
      SET monthly_budget = ? 
      WHERE user_id = ? AND month = ? AND year = ?
    `);
    
    updateStmt.run([monthlyBudget, userId, month, year], function(err) {
      if (err) {
        reject(err);
        return;
      }
      
      // If no rows were updated, insert new budget
      if (this.changes === 0) {
        const insertStmt = db.prepare(`
          INSERT INTO budgets (user_id, monthly_budget, month, year) 
          VALUES (?, ?, ?, ?)
        `);
        
        insertStmt.run([userId, monthlyBudget, month, year], function(insertErr) {
          if (insertErr) {
            reject(insertErr);
          } else {
            resolve({ lastInsertRowid: this.lastID });
          }
        });
        insertStmt.finalize();
      } else {
        resolve({ changes: this.changes });
      }
    });
    updateStmt.finalize();
  });
};

export const getCurrentBudget = (userId, month, year) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('SELECT * FROM budgets WHERE user_id = ? AND month = ? AND year = ?');
    stmt.get([userId, month, year], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
    stmt.finalize();
  });
};