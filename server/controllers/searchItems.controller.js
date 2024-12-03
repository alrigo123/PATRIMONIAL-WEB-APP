import pool from '../db.js';

export const searchGeneral = async (req, res, next) => {
    try {
        const searchTerm = req.query.q; // El término de búsqueda que el usuario ingresa
        /* 
        ##FULL TEXT PARA OPTIMIZAR LA BUSQUEDA SIN ORDEN 
        ##CREAR UN INDEX EN LA BD Y LUEGO LA CONSULTA LO MATCHEA
       
       "SHOW INDEX FROM item;" ## PARA VER LOS FULLTEXT
        "CREATE FULLTEXT INDEX idx_trabajador_desc ON item(TRABAJADOR, DESCRIPCION, DEPENDENCIA);"
        */
        const [rows] = await pool.query(
            `SELECT * FROM item 
             WHERE MATCH(DESCRIPCION, TRABAJADOR, DEPENDENCIA) 
             AGAINST (? IN NATURAL LANGUAGE MODE)`,
            [searchTerm]
        );

        if (!rows.length) return res.status(404).json({ message: 'No se encontraron resultados' });

        res.json(rows); // Retorna todos los resultados coincidentes
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const searchItemsByWorker = async (req, res, next) => {
    try {
        const trabajador = req.query.q;
        const [rows] = await pool.query(
            `SELECT * FROM item 
            WHERE MATCH(TRABAJADOR) AGAINST 
            (? IN NATURAL LANGUAGE MODE)`,
            [trabajador]
        );

        if (!rows.length) return res.status(404).json({ message: 'No se encontraron ítems para el trabajador especificado' });
        res.json(rows);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const searchItemsByDependece = async (req, res, next) => {
    try {
        const dependece = req.query.q;
        const [rows] = await pool.query(
            `SELECT * FROM item 
             WHERE MATCH(DEPENDENCIA) AGAINST 
             (? IN NATURAL LANGUAGE MODE)`,
            [dependece]
        );

        if (!rows.length) return res.status(404).json({ message: 'No se encontraron ítems para la dependencia especificada' });
        res.json(rows);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const searchItemsByWorkerAndDescription = async (req, res, next) => {
    try {
        // Extraemos los valores de trabajador y descripcion de la consulta
        const trabajador = `%${req.query.trabajador}%`;
        const descripcion = `%${req.query.descripcion}%`;

        // Realizamos la consulta SQL con los parámetros
        const [rows] = await pool.query(`
            SELECT * FROM item WHERE TRABAJADOR LIKE ? 
            AND DESCRIPCION LIKE ? ORDER BY DESCRIPCION
        `, [trabajador, descripcion]);

        // Validamos si hay resultados
        if (!rows.length) return res.status(404).json({ message: 'No se encontraron ítems con los criterios especificados' });
        res.json(rows); // Enviamos los resultados
        
    } catch (error) {
        console.error("Error en la consulta:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

// export const searchItemsByWorkerAndDescription = async (req, res, next) => {
// CREAR UN FULLTEXT ESPECIFICO PARA LOS DOS ??? , PRIMERO PROBAR SIN CREAR EL FULLTEXT Y LUEGO YA
//     try {
//         // Extraemos los valores de trabajador y descripción de la consulta
//         const trabajador = req.query.trabajador || '';
//         const descripcion = req.query.descripcion || '';

//         // Realizamos la consulta SQL con MATCH ... AGAINST
//         const [rows] = await pool.query(`
//             SELECT * 
//             FROM item 
//             WHERE MATCH(TRABAJADOR) AGAINST(? IN BOOLEAN MODE)
//               AND MATCH(DESCRIPCION) AGAINST(? IN BOOLEAN MODE)
//             ORDER BY DESCRIPCION
//         `, [trabajador, descripcion]);

//         // Validamos si hay resultados
//         if (!rows.length) 
//             return res.status(404).json({ message: 'No se encontraron ítems con los criterios especificados' });

//         res.json(rows); // Enviamos los resultados
//     } catch (error) {
//         console.error("Error en la consulta:", error);
//         return res.status(500).json({ message: "Error en el servidor" });
//     }
// };
