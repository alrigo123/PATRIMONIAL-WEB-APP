import pool from '../db.js';

// FUNCTION to get all data including the conservation state
export const getItemsGeneralState = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
            I.N, I.CODIGO_PATRIMONIAL, I.DESCRIPCION, I.TRABAJADOR, 
            I.DEPENDENCIA, I.UBICACION, I.FECHA_REGISTRO, 
            I.FECHA_ALTA, I.FECHA_COMPRA, I.ESTADO, I.DISPOSICION,
            I.SITUACION, I.CONSERV, C.CONSERV AS EST_CONSERVACION
        FROM item AS I
        INNER JOIN conservacion AS C
        ON I.CONSERV = C.id`
        );

        // Check if there are results
        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron elementos" });
        }

        res.json(rows);
        // console.log(rows)

    } catch (error) {
        console.error("Error en la consulta a la base de datos:", error.message);
        return res.status(500).json({ error: "Error al obtener los datos de la base de datos" });
    }
};

// FUNCTION to get disposition of the item
export const getItemsGeneralDisposition = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `select N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION, 
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, DISPOSICION 
            FROM item`
        );

        res.json(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
};

// FUNCTION to get disposition of the item
export const getItemsStateTrue = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION, 
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, ESTADO 
            FROM item WHERE ESTADO = 1`
        );

        res.json(rows);
        // console.log(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const getItemsStateFalse = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION, 
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, ESTADO 
            FROM item WHERE ESTADO = 0`
        );

        res.json(rows);
        // console.log(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const getItemsDispositionTrue = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `select N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION, 
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, DISPOSICION 
            FROM item WHERE DISPOSICION = 1`
        );

        res.json(rows)
        // console.log(rows)


    } catch (error) {
        return res.status(500).json(error);
    }
}

export const getItemsDispositionFalse = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `select N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION, TRABAJADOR, 
            FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, DISPOSICION 
            FROM item WHERE DISPOSICION = 0`
        );

        res.json(rows)
        // console.log(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const getItemsGeneralSituation = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION, 
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, SITUACION 
            FROM item`
        );

        // Validar si hay resultados
        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron elementos" });
        }
        res.json(rows);
        // console.log(rows)

    } catch (error) {
        console.error("Error en la consulta a la base de datos:", error.message);
        return res.status(500).json({ error: "Error al obtener los datos de la base de datos" });
    }
};

export const getItemsSituationTrue = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `select N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION, 
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, SITUACION
            FROM item WHERE SITUACION = 1`
        );

        res.json(rows)
        // console.log(rows)


    } catch (error) {
        return res.status(500).json(error);
    }
}

export const getItemsSituationFalse = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `select N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION, TRABAJADOR, 
            FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, SITUACION 
            FROM item WHERE SITUACION = 0`
        );

        res.json(rows)
        // console.log(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const getAllItemsToExport = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `select * FROM item`
        );

        res.json(rows)
        // console.log(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
}