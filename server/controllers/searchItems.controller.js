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

// export const searchItemsByWorker = async (req, res, next) => {
//     try {
//         const trabajador = req.query.q;
//         const [rows] = await pool.query(
//             `SELECT * FROM item 
//             WHERE MATCH(TRABAJADOR) AGAINST 
//             (? IN NATURAL LANGUAGE MODE)`,
//             [trabajador]
//         );

//         if (!rows.length) return res.status(404).json({ message: 'No se encontraron ítems para el trabajador especificado' });
//         res.json(rows);
//     } catch (error) {
//         return res.status(500).json(error);
//     }
// };


// export const searchItemsByWorker = async (req, res, next) => {
//     try {
//         const trabajador = `%${req.query.q}%`;

//         // Ejecutar la consulta y desestructurar para obtener solo las filas
//         const [rows] = await pool.query(
//             `
//             SELECT 
//                 I.N, I.CODIGO_PATRIMONIAL, I.DESCRIPCION, I.TRABAJADOR, 
//                 I.DEPENDENCIA, I.UBICACION, I.FECHA_REGISTRO, 
//                 I.FECHA_ALTA, I.FECHA_COMPRA, I.ESTADO, I.DISPOSICION,
//                 I.SITUACION, I.CONSERV, C.CONSERV AS EST_CONSERVACION
//             FROM item AS I
//             INNER JOIN conservacion AS C
//                 ON I.CONSERV = C.id
//             WHERE I.TRABAJADOR LIKE ?
//             ORDER BY I.DESCRIPCION ASC;
//             `, [trabajador]
//         );

//         // console.log(rows)

//         // Verificar si hay resultados
//         if (rows.length === 0) {
//             return res.status(404).json({ message: 'No se encontraron ítems para el trabajador especificado' });
//         }

//         // Devolver los datos encontrados
//         res.json(rows);
//     } catch (error) {
//         // Manejo de errores
//         return res.status(500).json({ error: error.message });
//     }
// };

export const searchItemsByWorker = async (req, res, next) => {
    try {
        const input = req.query.q;
        if (!input) return res.status(400).json({ message: 'No se proporcionó el término de búsqueda' });

        // Divide el input en palabras
        const palabras = input.split(' ');

        // Construye dinámicamente la consulta WHERE
        const condiciones = palabras.map(() => `I.TRABAJADOR LIKE ?`).join(' AND ');
        const parametros = palabras.map((palabra) => `%${palabra}%`);

        // Ejecuta la consulta
        const [rows] = await pool.query(
            `
            SELECT 
                I.N, I.CODIGO_PATRIMONIAL, I.DESCRIPCION, I.TRABAJADOR, 
                I.DEPENDENCIA, I.UBICACION, I.FECHA_REGISTRO, 
                I.FECHA_ALTA, I.FECHA_COMPRA, I.ESTADO, I.DISPOSICION,
                I.SITUACION, I.CONSERV, C.CONSERV AS EST_CONSERVACION
            FROM item AS I
            INNER JOIN conservacion AS C
                ON I.CONSERV = C.id
            WHERE ${condiciones}
            ORDER BY I.DESCRIPCION ASC;
            `,
            parametros
        );

        // console.log(rows);

        // Verificar si hay resultados
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ítems para el trabajador especificado' });
        }

        // Devolver los datos encontrados
        res.json(rows);
    } catch (error) {
        // Manejo de errores
        return res.status(500).json({ error: error.message });
    }
};

// export const searchItemsByDependece = async (req, res, next) => {
//     try {
//         const dependece = req.query.q;
//         const [rows] = await pool.query(
//             `SELECT * FROM item 
//              WHERE MATCH(DEPENDENCIA) AGAINST 
//              (? IN NATURAL LANGUAGE MODE)`,
//             [dependece]
//         );

//         if (!rows.length) return res.status(404).json({ message: 'No se encontraron ítems para la dependencia especificada' });
//         res.json(rows);
//     } catch (error) {
//         return res.status(500).json(error);
//     }
// };

export const searchItemsByDependece = async (req, res, next) => {
    try {
        const input = req.query.q;
        if (!input) return res.status(400).json({ message: 'No se proporcionó el término de búsqueda' });

        // Divide el input en palabras
        const palabras = input.split(' ');

        // Construye dinámicamente la consulta WHERE
        const condiciones = palabras.map(() => `I.DEPENDENCIA LIKE ?`).join(' AND ');
        const parametros = palabras.map((palabra) => `%${palabra}%`);

        // Ejecuta la consulta
        const [rows] = await pool.query(
            `
            SELECT 
                I.N, I.CODIGO_PATRIMONIAL, I.DESCRIPCION, I.TRABAJADOR, 
                I.DEPENDENCIA, I.UBICACION, I.FECHA_REGISTRO, 
                I.FECHA_ALTA, I.FECHA_COMPRA, I.ESTADO, I.DISPOSICION,
                I.SITUACION, I.CONSERV, C.CONSERV AS EST_CONSERVACION
            FROM item AS I
            INNER JOIN conservacion AS C
                ON I.CONSERV = C.id
            WHERE ${condiciones}
            ORDER BY I.DESCRIPCION ASC;
            `,
            parametros
        );

        // console.log(rows);

        // Verificar si hay resultados
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ítems para el trabajador especificado' });
        }

        // Devolver los datos encontrados
        res.json(rows);
    } catch (error) {
        // Manejo de errores
        return res.status(500).json({ error: error.message });
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
