import pool from '../db.js'; // Asegúrate de importar tu pool de conexión a la base de datos
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_KEY

// Lista negra para tokens
let blacklist = [];

const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    // Verifica si el token está en la lista negra
    if (blacklist.includes(token)) {
        return res.status(401).json({ message: "Token invalidado" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token no válido" });
        req.user = user;
        next();
    });
};

export const loginUser = async (req, res) => {
    try {
        // console.log("Cuerpo de la solicitud:", req.body);
        const { dni, password } = req.body;

        // Verifica que ambos campos estén presentes
        if (!dni || !password) {
            return res.status(400).json({ message: 'DNI y contraseña son requeridos BACKEND' });
        }

        // Buscar al usuario por DNI
        const [rows] = await pool.query("SELECT * FROM user_i WHERE dni = ?", [dni]); // Destructuring para evitar niveles anidados

        // Verificar si el usuario existe
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = rows[0]; // Primer resultado

        // Verificar si la contraseña existe en los datos del usuario
        if (!user.password) {
            return res.status(500).json({ message: 'Error del servidor: contraseña no encontrada en el usuario' });
        }

        // Verificar si el usuario está activo
        if (user.status === 0) {
            return res.status(403).json({ message: 'Usuario desactivado. Contacte al administrador' });
        }

        // Comparar contraseñas con bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar un token JWT
        const token = jwt.sign({ dni: user.dni, name: user.name_and_last }, SECRET_KEY, { expiresIn: '20s' }); // 1h de expiración

        // Respuesta exitosa
        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: {
                dni: user.dni,
                name_and_last: user.name_and_last
            },
            token: token
        });
    } catch (error) {
        console.error("Error en loginUser:", error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const registerUser = async (req, res) => {
    const { dni, name_and_last, password } = req.body;
    try {
        // Validación básica
        if (!dni || !name_and_last || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Verificar si el DNI ya existe
        const [existingDNI] = await pool.query("SELECT * FROM user_i WHERE dni = ?", [dni]);
        if (existingDNI.length > 0) {
            return res.status(400).json({ message: "El DNI ya está registrado" });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar el usuario en la base de datos
        await pool.query(
            "INSERT INTO user_i (dni, name_and_last, password) VALUES (?, ?, ?)",
            [dni, name_and_last, hashedPassword]
        );
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

export const logoutUser = (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "No token provided" });

    // Agregar el token a la lista negra
    blacklist.push(token);

    // Opcional: Limpiar tokens antiguos de la lista negra para optimizar memoria
    setTimeout(() => {
        blacklist = blacklist.filter((t) => t !== token);
    }, 3600000); // 1 hora

    res.status(200).json({ message: "Sesión cerrada correctamente" });
}