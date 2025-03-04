import { Router } from "express";
import pool from '../db.js';
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
const router = Router();

// TESTING ROUTES
router.get('/ping', async (req, res) => {
    const [rows] = await pool.query('SELECT CODIGO_PATRIMONIAL FROM item')
    console.log(rows);
    res.json(rows)
})

router.get(`${process.env.SECRETE_URL}`, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM item LIMIT 5')
    res.json(rows)
})

export default router;