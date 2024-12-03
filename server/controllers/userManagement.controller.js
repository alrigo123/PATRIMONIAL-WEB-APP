import pool from '../db.js';
import * as bcrypt from 'bcrypt'

export const getUser = async (req, res, next) => {
    try {
    } catch (error) {
    }
};

export const registerUser = async (req, res) => {
    const { user, name, last_name, email, password } = req.body;

    try {
        // Validación básica
        if (!user || !name || !last_name || !email || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Verificar si el correo ya existe
        const [existingEmail] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);
        if (existingEmail.length > 0) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        // Verificar si el correo ya existe
        const [existingUser] = await pool.query("SELECT * FROM user WHERE user = ?", [user]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "El nombre usuario ya está registrado" });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar el usuario en la base de datos
        await pool.query(
            "INSERT INTO user (user, name, last_name, email, password) VALUES (?, ?, ?, ?, ?)",
            [user, name, last_name, email, hashedPassword]
        );

        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
};