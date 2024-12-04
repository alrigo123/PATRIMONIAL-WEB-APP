import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { config } from 'dotenv';
import helmet from 'helmet';
// npm install helmet --> Protege tu aplicación Express.js de vulnerabilidades comunes
import rateLimit from 'express-rate-limit';
// npm install express-rate-limit --> Esto evita ataques de denegación de servicio (DoS).

// Cargar las variables del archivo .env
config();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por IP
    message: 'Demasiadas solicitudes desde esta IP, por favor inténtalo de nuevo más tarde.'
});
const app = express();
   
//Middleware
// Configuración CORS para permitir accesos desde cualquier origen
app.use(cors({ origin: '*' }));
app.use(express.json()) //process data to send to the backend
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(limiter);

////// PRUEBA DEL OPEN AI 
// Ruta para manejar mensajes del chatbot
app.post('/api/chat', async (req, res) => {
    const now = Date.now();
    const delay = Math.max(0, 1000 - (now - lastRequestTime)); // 1 solicitud por segundo
    lastRequestTime = now + delay;

    setTimeout(async () => {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: req.body.message }],
                    max_tokens:100
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    },
                }
            );
            res.json({ reply: response.data.choices[0].message.content });
        } catch (error) {
            console.error('Error en el backend:', error);
            res.status(500).json({ error: 'Error al procesar tu mensaje' });
        }
    }, delay);
});
//////

// Middleware para deshabilitar el caché
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.header('Surrogate-Control', 'no-store');
    next();
});

//Routes
import routes from './routes/index.routes.js';
import item_routes from './routes/item.routes.js';
import user_routes from './routes/user.routes.js';
import export_reports from './routes/export.routes.js'

//app
app.use(routes)
app.use('/items', item_routes)
app.use('/user', user_routes)
app.use('/export', export_reports)

const puerto = process.env.SERVER_PORT;

app.listen(puerto, () => {
    console.log(`listening on http://localhost:${puerto}`);
}); 