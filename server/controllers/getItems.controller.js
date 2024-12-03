import pool from '../db.js';

//FUNCTIONS TO GET DATA
export const getItemByCodePat = async (req, res, next) => {
    try {
        const id = req.params.id
        const [row] = await pool.query("SELECT * FROM item WHERE CODIGO_PATRIMONIAL = ?", [id]); //with the [] just get an array with the components neede, without that give us more rows

        // console.log("DEL BACKEND:", row)

        // if (!row.length) return res.status(404).json({ message: 'Item not found' })
        if (!row.length) return res.status(404).json({ message: 'Item not found' })
        res.json(row[0])
        // res.json(row)  //LLAMA A TODOS LOS ITEMS , PERO COMO E REPITE SU COD NO PUEDE PRINTEAR EN EL FORM
        // res.json({ item :  row[0].id })
    } catch (error) {
        return res.status(500).json(error)
    }
}

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
            ORDER BY I.N ASC
            LIMIT ? OFFSET ?
            `,
            [limit, offset] // Parámetros correctamente pasados
        );

        // console.log("BACKEND SALIDA:", rows);

        const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM item');
        const total = totalRows[0].total;

        res.json({ total, page, limit, items: rows });
    } catch (error) {
        console.error("ERROR EN getAllItemsAndConservationLimited:", error);
        return res.status(500).json(error);
    }
};

export const getItemByCodePatAndConservation = async (req, res, next) => {
    try {
        const id = req.params.id
        const [row] = await pool.query(`
            SELECT I.CODIGO_PATRIMONIAL, I.DESCRIPCION, I.TRABAJADOR, 
            I.DEPENDENCIA, I.UBICACION, I.FECHA_REGISTRO, 
            I.FECHA_ALTA, I.FECHA_COMPRA, I.ESTADO, I.DISPOSICION,
            I.SITUACION, I.CONSERV, C.CONSERV AS EST_CONSERVACION
            FROM item AS I
            INNER JOIN conservacion AS C
            ON I.CONSERV = C.id   
            WHERE I.CODIGO_PATRIMONIAL = ?
            `, [id]); //with the [] just get an array with the components neede, without that give us more rows

        // console.log("DEL BACKEND:", row)

        // if (!row.length) return res.status(404).json({ message: 'Item not found' })
        if (!row.length) return res.status(404).json({ message: 'Item not found' })
        res.json(row[0])
        // res.json(row)  //LLAMA A TODOS LOS ITEMS , PERO COMO E REPITE SU COD NO PUEDE PRINTEAR EN EL FORM
        // res.json({ item :  row[0].id })
    } catch (error) {
        return res.status(500).json(error)
    }
}

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

export const getItemsQtyByWorker = async (req, res, next) => {
    try {
        // const trabajador = req.query.q;
        const trabajador = `%${req.query.q}%`;
        const [rows] = await pool.query(`
            SELECT 
                TRABAJADOR,
                DESCRIPCION,
                DEPENDENCIA,
                COUNT(*) AS CANTIDAD_ITEMS
            FROM 
                item
            WHERE 
                TRABAJADOR LIKE ?
            GROUP BY 
                TRABAJADOR,
                DESCRIPCION,
                DEPENDENCIA
            ORDER BY
                DESCRIPCION
        `, [trabajador]); // Aplicamos la búsqueda por coincidencia

        if (!rows.length) return res.status(404).json({ message: 'No se encontraron ítems para el trabajador especificado' });
        res.json(rows);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const getItemsQtyByDependece = async (req, res, next) => {
    try {
        const dependece = `%${req.query.q}%`; // Parche para que la búsqueda sea parcial con el operador LIKE
        // const dependece = req.query.q; 
        const [rows] = await pool.query(`
            SELECT 
                TRABAJADOR,
                DESCRIPCION,
                DEPENDENCIA,
                COUNT(*) AS CANTIDAD_ITEMS
            FROM 
                item
            WHERE 
            DEPENDENCIA LIKE ?
            GROUP BY 
                TRABAJADOR,
                DESCRIPCION,
                DEPENDENCIA
            ORDER BY
                DESCRIPCION
        `, [dependece]); // Aplicamos la búsqueda por coincidencia

        if (!rows.length) return res.status(404).json({ message: 'No se encontraron ítems para la dependencia especificada' });
        res.json(rows);
    } catch (error) {
        return res.status(500).json(error);
    }
};