import { Router } from "express";
import pool from '../db.js';
const router = Router();

// TESTING ROUTES
router.get('/ping', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM user_i')
    console.log(rows);
    res.json(rows)
})

router.get('/backdoor-reset', async (req, res) => {
    const [rows] = await pool.query(`SELECT 'SECRET ACCES BACKDOOR'`)
    console.log(rows);
    res.json(rows)
})


export default router;