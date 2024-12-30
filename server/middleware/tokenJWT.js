import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_KEY;

export const authenticateToken = function (req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token no válido o expirado' });
        }
        req.user = user; // Los datos decodificados del token se almacenan en `req.user`
        next();
    });
}
