import { Router } from "express";
import pool from '../db.js';
const router = Router();

// TESTING ROUTES
router.get('/ping', async (req, res) => {
    const rows = await pool.query('SELECT * FROM test')
    console.log(rows);
    res.json(rows)
})

export default router;