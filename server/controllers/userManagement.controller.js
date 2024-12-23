import pool from '../db.js'; // Asegúrate de importar tu pool de conexión a la base de datos
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

// export const authenticateToken = (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
//     if (!token) return res.status(401).json({ message: 'Acceso no autorizado' });

//     try {
//         const user = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = user; // Agregar los datos del usuario al request
//         next();
//     } catch (error) {
//         return res.status(403).json({ message: 'Token inválido' });
//     }
// };

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

        // Respuesta exitosa
        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: {
                dni: user.dni,
                name_and_last: user.name_and_last
            }
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
        const [existingDNI] = await pool.query("    ", [dni]);
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