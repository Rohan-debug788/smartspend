import db from '../db/database.js';
import bcrypt from 'bcryptjs';

export const createUser = (email, password, name) => {
  return new Promise((resolve, reject) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)');
    stmt.run([email, hashedPassword, name], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastInsertRowid: this.lastID });
      }
    });
    stmt.finalize();
  });
};

export const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    stmt.get([email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
    stmt.finalize();
  });
};

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?');
    stmt.get([id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
    stmt.finalize();
  });
};

export const validatePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};