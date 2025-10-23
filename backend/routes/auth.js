const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');
require('dotenv').config();
const SECRET_KEY =  process.env.SECRET_KEY;

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login 
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login, returns JWT and user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 role:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             example:
 *               error: Hibás jelszó
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: Felhasználó nem található
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Szerverhiba
 *               message: Something went wrong...
 */


const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const adminQuery = await db.pool.query("SELECT * FROM admins WHERE email = $1", [email]);
      if (adminQuery.rows.length > 0) {
        const admin = adminQuery.rows[0];
        const match = await bcrypt.compare(password, admin.password);
  
        if (!match) {
          return res.status(401).json({ error: 'Hibás jelszó' });
        }
  
        const token = jwt.sign({ id: admin.id, role: 'admin' }, SECRET_KEY, { expiresIn: '1d' });
  
        return res.status(200).json({
          message: 'Sikeres bejelentkezés',
          role: 'admin',
          token,
          user: { id: admin.id, name: admin.name, email: admin.email }
        });
      }
  
      const caregiverQuery = await db.pool.query("SELECT * FROM caregivers WHERE email = $1", [email]);
      if (caregiverQuery.rows.length > 0) {
        const caregiver = caregiverQuery.rows[0];
        const match = await bcrypt.compare(password, caregiver.password);
  
        if (!match) {
          return res.status(401).json({ error: 'Hibás jelszó' });
        }
  
        const token = jwt.sign({ id: caregiver.id, role: 'caregiver' }, SECRET_KEY, { expiresIn: '1d' });
  
        return res.status(200).json({
          message: 'Sikeres bejelentkezés',
          role: 'caregiver',
          token,
          user: { id: caregiver.id, name: caregiver.name, email: caregiver.email }
        });
      }
  
      return res.status(404).json({ error: 'Felhasználó nem található' });
  
    } catch (err) {
      console.error('Hiba a bejelentkezés során:', err);
      res.status(500).json({ error: 'Szerverhiba', message: err.message });
    }
  };


  const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; 
  
    if (!token) {
      return res.status(401).json({ error: 'Nincs token megadva' });
    }
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded; 
      next();
    } catch (err) {
      res.status(401).json({ error: 'Érvénytelen token' });
    }
  };
  

const authorize = (roles = []) => {
    if (typeof roles === 'string') {
      roles = [roles];
    }
  
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Nincs jogosultságod ehhez a művelethez' });
      }
  
      next(); 
    };
  };
  
  module.exports = { 
    login,
    authenticate,
    authorize
 };
