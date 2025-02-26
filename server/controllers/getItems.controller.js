import pool from '../db.js';

//FUNCTION TO GET CONSERVATION STATUS DATA
export const getConservationStatus = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `select * FROM conservacion`
        );
        res.json(rows)
    } catch (error) {
        return res.status(500).json(error);
    }
}

//FUNCTION TO GET DATA FROM A SINGLE ITEM BY THEIR "CODIGO_PATRIMONIAL"
export const getItemByCodePat = async (req, res, next) => {
    try {
        const id = req.params.id
        const [row] = await pool.query("SELECT * FROM item WHERE CODIGO_PATRIMONIAL = ?", [id]); 
        //with the [] just get an array with the components neede, without that give us more rows

        // Check if the item exist
        if (!row.length) return res.status(404).json({ message: 'Item not found' })
        res.json(row[0])
        // res.json({ item :  row[0].id })
    } catch (error) {
        return res.status(500).json(error)
    }
}

//FUNCTION TO GET ALL DATA INCLUDING CONSERVATION STATE LIMITED TO SHOW n SAMPLES
export const getAllItemsAndConservationLimited = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
        const limit = parseInt(req.query.limit) || 50; // Límite de registros por página, por defecto 50
        const offset = (page - 1) * limit; // Cálculo del offset

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
            ORDER BY I.TRABAJADOR ASC
            LIMIT ? OFFSET ?
            `,
            [limit, offset] // Query parameters
        );

        const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM item');
        const total = totalRows[0].total;

        res.json({ total, page, limit, items: rows });

    } catch (error) {
        console.error("ERROR EN getAllItemsAndConservationLimited:", error);
        return res.status(500).json(error);
    }
};

//FUNCTION TO GET ALL DATA INCLUDING CONSERVATION STATE FROM A SINGLE CODIGO_PATRIMONIAL
export const getItemByCodePatAndConservation = async (req, res, next) => {
    try {
        const id = req.params.id
        const [row] = await pool.query(`
            SELECT I.CODIGO_PATRIMONIAL, I.DESCRIPCION, I.TRABAJADOR, 
            I.DEPENDENCIA, I.UBICACION, I.FECHA_REGISTRO, I.OBSERVACION,
            I.FECHA_ALTA, I.FECHA_COMPRA, I.ESTADO, I.DISPOSICION,
            I.SITUACION, I.CONSERV, C.CONSERV AS EST_CONSERVACION
            FROM item AS I
            INNER JOIN conservacion AS C
            ON I.CONSERV = C.id   
            WHERE I.CODIGO_PATRIMONIAL = ?
            `, [id]); //with the [] just get an array with the components neede, without that give us more rows

        // if (!row.length) return res.status(404).json({ message: 'Item not found' })
        if (!row.length) return res.status(404).json({ message: 'Item not found' })
        res.json(row[0])
        // res.json(row)  //LLAMA A TODOS LOS ITEMS , PERO COMO E REPITE SU COD NO PUEDE PRINTEAR EN EL FORM
        // res.json({ item :  row[0].id })
    } catch (error) {
        return res.status(500).json(error)
    }
}

//FUNCTION TO GET ITEMS QUANTITY FROM A "TRABAJADOR" BY THEIR NAME AND LAST NAME 
export const getItemsQtyByWorker = async (req, res, next) => {
    try {
        const input = req.query.q;
        if (!input) return res.status(400).json({ message: 'No se proporcionó el término de búsqueda' });

        // Divide el input en palabras
        const palabras = input.split(' ');

        // Construye dinámicamente la consulta WHERE
        const condiciones = palabras.map(() => `TRABAJADOR LIKE ?`).join(' AND ');
        const parametros = palabras.map((palabra) => `%${palabra}%`);

        const [rows] = await pool.query(`
            SELECT 
                TRABAJADOR,
                DESCRIPCION,
                DEPENDENCIA,
                COUNT(*) AS CANTIDAD_ITEMS,
                SUM(CASE WHEN ESTADO = 1 THEN 1 ELSE 0 END) AS CANTIDAD_PATRIMONIZADOS,
                SUM(CASE WHEN ESTADO = 0 THEN 1 ELSE 0 END) AS CANTIDAD_NO_PATRIMONIZADOS
            FROM 
                item
            WHERE 
                ${condiciones}
            GROUP BY 
                TRABAJADOR,
                DESCRIPCION,
                DEPENDENCIA
            ORDER BY
                DESCRIPCION
        `, parametros);

        if (!rows.length) return res.status(404).json({ message: 'No se encontraron ítems para el trabajador especificado' });
        res.json(rows);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

//FUNCTION TO GET ITEMS QUANTITY FROM A "DEPENDENCIA" BY THEIR SEDE NAME
export const getItemsQtyByDependece = async (req, res, next) => {
    try {
        const input = req.query.q;
        if (!input) return res.status(400).json({ message: 'No se proporcionó el término de búsqueda' });

        // Divide el input en palabras
        const palabras = input.split(' ');

        // Construye dinámicamente la consulta WHERE
        const condiciones = palabras.map(() => `DEPENDENCIA LIKE ?`).join(' AND ');
        const parametros = palabras.map((palabra) => `%${palabra}%`);

        const [rows] = await pool.query(`
            SELECT 
                TRABAJADOR,
                DESCRIPCION,
                DEPENDENCIA,
                COUNT(*) AS CANTIDAD_ITEMS,
                SUM(CASE WHEN ESTADO = 1 THEN 1 ELSE 0 END) AS CANTIDAD_PATRIMONIZADOS,
                SUM(CASE WHEN ESTADO = 0 THEN 1 ELSE 0 END) AS CANTIDAD_NO_PATRIMONIZADOS
            FROM 
                item
            WHERE 
                ${condiciones}
            GROUP BY 
                TRABAJADOR,
                DESCRIPCION,
                DEPENDENCIA
            ORDER BY
                DESCRIPCION
        `, parametros); // Aplicamos la búsqueda por coincidencia

        // console.log("ROWS: ",rows);
        if (!rows.length) return res.status(404).json({ message: 'No se encontraron ítems para el trabajador especificado' });
        res.json(rows);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

export const searchItemByCodeAndWorker = async (req, res) => {
    try {
        // Extraer los parámetros de la solicitud
        const { code } = req.params; // Código patrimonial desde la URL
        const { worker } = req.query; // Nombre completo del trabajador desde la query string

        // Validar los parámetros
        if (!code || !worker) {
            return res.status(400).json({ message: 'El código patrimonial y el nombre del trabajador son requeridos.' });
        }

        // Consulta a la base de datos para buscar el ítem
        const [rows] = await pool.query(
            `
        SELECT * FROM item
        WHERE CODIGO_PATRIMONIAL = ? AND TRABAJADOR = ?
        LIMIT 1;
        `,
            [code, worker]
        );

        // Verificar si se encontró un resultado
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró ningún ítem para el código y trabajador especificados.' });
        }

        // Devolver el resultado
        res.json(rows[0]);
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};