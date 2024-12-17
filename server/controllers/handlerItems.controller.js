import pool from '../db.js';

export const updateDisposition = async (req, res) => {
    const { id } = req.params;
    const { DISPOSICION } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE item SET DISPOSICION = ? WHERE CODIGO_PATRIMONIAL = ?',
            [DISPOSICION, id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Item not found' });

        res.json({ message: 'Disposition updated successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const updateSituation = async (req, res) => {
    const { id } = req.params;
    const { SITUACION } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE item SET SITUACION = ? WHERE CODIGO_PATRIMONIAL = ?',
            [SITUACION, id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Item not found' });

        res.json({ message: 'Situation updated successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getItemByCodePatAndUpdate = async (req, res, next) => {
    try {
        const id = req.params.id;  // Código patrimonial del item
        const { trabajador_data } = req.query; // trabajador
        const { dependencia_data } = req.query; // trabajador

        // Verificar si el código patrimonial existe en la base de datos
        const [rows] = await pool.query("SELECT * FROM item WHERE CODIGO_PATRIMONIAL = ?", [id]);

        if (!rows.length) {
            console.log('Item no encontrado.');
            return res.status(404).json({ message: 'El código patrimonial no existe en la base de datos' });
        }

        const item = rows[0];

        // console.log("TRABAJADAOR", trabajador_data, "DEPEDNENICA", dependencia_data)

        if (trabajador_data) {
            console.log("se envio el trabajador")
            const [trabajador] = await pool.query(
                "SELECT * FROM item WHERE TRABAJADOR = ? AND CODIGO_PATRIMONIAL = ?",
                [trabajador_data, id]
            );

            if (trabajador.length === 0) {
                // Verificar si el código pertenece a otro trabajador
                const [otroTrabajador] = await pool.query(
                    "SELECT * FROM item WHERE CODIGO_PATRIMONIAL = ?",
                    [id]
                );

                if (otroTrabajador.length > 0) {
                    // console.log('El código patri monial pertenece a otro trabajador:', otroTrabajador[0]);
                    return res.status(400).json({
                        message: 'El código patrimonial pertenece a otro trabajador',
                        otroTrabajador: {
                            TRABAJADOR: otroTrabajador[0].TRABAJADOR,
                            DEPENDENCIA: otroTrabajador[0].DEPENDENCIA,
                            UBICACION: otroTrabajador[0].UBICACION, // Incluye más campos si es necesario
                        },
                    });
                }

                console.log('El código patrimonial no pertenece a este trabajador');
                return res.status(400).json({ message: 'El código patrimonial no pertenece a este trabajador' });
            }
        } else if (dependencia_data) {
            console.log("se envio la dependencia")
            const [dependencia] = await pool.query(
                "SELECT * FROM item WHERE DEPENDENCIA = ? AND CODIGO_PATRIMONIAL = ?",
                [dependencia_data, id]
            );

            if (dependencia.length === 0) {
                // Verificar si el código pertenece a otro trabajador
                const [otraDependencia] = await pool.query(
                    "SELECT * FROM item WHERE CODIGO_PATRIMONIAL = ?",
                    [id]
                );

                if (otraDependencia.length > 0) {
                    // console.log('El código patri monial pertenece a otro trabajador:', otroTrabajador[0]);
                    return res.status(400).json({
                        message: 'El código patrimonial pertenece a otra dependencia',
                        otraDependencia: {
                            TRABAJADOR: otraDependencia[0].TRABAJADOR,
                            DEPENDENCIA: otraDependencia[0].DEPENDENCIA,
                            UBICACION: otraDependencia[0].UBICACION, // Incluye más campos si es necesario
                        },
                    });
                }
                console.log('El código patrimonial no pertenece a esta dependencia');
                return res.status(400).json({ message: 'El código patrimonial no pertenece a esta dependencia' });
            }
        }

        // Si el código pertenece al trabajador o dependencia, proceder con la actualización
        const fechaRegistro = new Date(); // Fecha actual

        const [updateResult] = await pool.query(
            "UPDATE item SET ESTADO = 1, SITUACION = 1, FECHA_REGISTRO = ? WHERE CODIGO_PATRIMONIAL = ?",
            [fechaRegistro, id]
        );

        // Verificar si se actualizó algún registro
        if (updateResult.affectedRows === 0) {
            console.log('No se actualizó ningún registro.');
            return res.status(400).json({ message: 'No se pudo actualizar el registro' });
        }

        // Retornar el item actualizado
        res.json({ ...item, ESTADO: 1, SITUACION: 1, FECHA_REGISTRO: fechaRegistro });

    } catch (error) {
        console.error('Error en la actualización:', error.message);
        return res.status(500).json({ message: 'Error en el servidor', error });
    }
};


export const updateItem = async (req, res) => {
    const { id } = req.params;
    const { DESCRIPCION, TRABAJADOR, DEPENDENCIA, UBICACION, FECHA_ALTA, FECHA_COMPRA, DISPOSICION, SITUACION, CONSERV } = req.body;

    try {
        // Verificar si el ítem existe y está relacionado con la tabla 'conservacion'
        const [item] = await pool.query(
            `
            SELECT I.CODIGO_PATRIMONIAL
            FROM item AS I
            INNER JOIN conservacion AS C
            ON I.CONSERV = C.id
            WHERE I.CODIGO_PATRIMONIAL = ?
            `,
            [id]
        );

        // Si no se encuentra el ítem, retornar un mensaje de error
        if (item.length === 0) {
            console.log("NO SE ENCONTRO EL ITEM O NO ESTA RELACIONADO CON CONSERVACION");
            return res.status(404).json({ message: 'Item not found or not related to conservacion' });
        }

        // Consulta SQL para actualizar el item, incluyendo la actualización del campo CONSERV
        const [result] = await pool.query(
            `
            UPDATE item
            SET
                DESCRIPCION = ?,
                TRABAJADOR = ?,
                DEPENDENCIA = ?,
                UBICACION = ?,
                FECHA_ALTA = ?,
                FECHA_COMPRA = ?,
                DISPOSICION = ?,
                SITUACION = ?,
                CONSERV = ?
            WHERE
                CODIGO_PATRIMONIAL = ?
            `,
            [
                DESCRIPCION, TRABAJADOR, DEPENDENCIA, UBICACION,
                FECHA_ALTA || null, FECHA_COMPRA || null,
                DISPOSICION, SITUACION,
                CONSERV || null,  // Aquí se actualiza CONSERV
                id
            ]
        );

        // Verificar si el ítem fue encontrado y actualizado
        if (result.affectedRows === 0) {
            console.log("NO SE ENCONTRO EL ITEM");
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        console.log("ERROR EN HANDLER: ", error);
        res.status(500).json({ message: 'Error updating item', error });
    }
};

// SELECT * FROM item WHERE TRABAJADOR LIKE '%ESTRADA CHILE%' AND ESTADO = 0;

export const insertExcelData = async (req, res) => {
    const { data } = req.body; // Datos enviados desde el frontend
    try {
        // Start a transaction to ensure atomicity
        await pool.query('START TRANSACTION');

        for (let row of data) {
            const { CODIGO_PATRIMONIAL, DESCRIPCION,
                TRABAJADOR, DEPENDENCIA, UBICACION,
                FECHA_COMPRA, FECHA_ALTA } = row;

            // Verificar si el código ya existe en la base de datos
            const [existingRows] = await pool.query(
                'SELECT 1 FROM item WHERE CODIGO_PATRIMONIAL = ?',
                [CODIGO_PATRIMONIAL]
            );

            if (existingRows.length > 0) {
                // Si el código ya existe, devuelve un mensaje de error
                await pool.query('ROLLBACK');
                return res.status(400).json({
                    message: `El código patrimonial ${CODIGO_PATRIMONIAL} ya existe en la base de datos.`
                });
            }

            // Insertar los datos si no hay duplicados
            await pool.query(
                `INSERT INTO item (CODIGO_PATRIMONIAL, DESCRIPCION,
                TRABAJADOR, DEPENDENCIA, UBICACION,
                FECHA_COMPRA, FECHA_ALTA) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [CODIGO_PATRIMONIAL, DESCRIPCION,
                    TRABAJADOR, DEPENDENCIA, UBICACION,
                    FECHA_COMPRA, FECHA_ALTA]
            );
        }

        // Commit the transaction
        await pool.query('COMMIT');
        res.json({ message: 'Datos importados correctamente.' });
    } catch (error) {
        // Rollback en caso de error
        await pool.query('ROLLBACK');
        console.log("DATOS ERRADOS EN EL BACKEND")
        res.status(500).json({ message: 'Error al importar datos.', error });

    }
};

export const addItem = async (req, res) => {
    const {
        codigoPatrimonial,
        descripcion,
        trabajador,
        dependencia,
        ubicacion,
        FECHA_COMPRA,
        FECHA_ALTA,
        conservacion,
        disposicion,
        situacion
    } = req.body;

    try {
        // Verificar si el código patrimonial ya existe
        const [existingRows] = await pool.query(
            'SELECT 1 FROM item WHERE CODIGO_PATRIMONIAL = ?',
            [codigoPatrimonial]
        );

        if (existingRows.length > 0) {
            return res.status(400).json({
                message: `El código patrimonial ${codigoPatrimonial} ya existe en la base de datos.`,
            });
        }

        // Generar un valor único y aleatorio para N
        let randomN;
        let isUnique = false;

        while (!isUnique) {
            randomN = Math.floor(10000 + Math.random() * 90000); // Generar número entre 10000 y 99999
            const [rows] = await pool.query(
                'SELECT 1 FROM item WHERE N = ?',
                [randomN]
            );

            if (rows.length === 0) {
                isUnique = true; // Asegurar que el valor no exista
            }
        }

        // Insertar nuevo bien patrimonial con el valor único para N
        await pool.query(
            `INSERT INTO item (
                CODIGO_PATRIMONIAL,
                DESCRIPCION,
                TRABAJADOR,
                DEPENDENCIA,
                UBICACION,
                FECHA_COMPRA,
                FECHA_ALTA,
                CONSERV,
                DISPOSICION,
                SITUACION
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                codigoPatrimonial,
                descripcion,
                trabajador,
                dependencia,
                ubicacion,
                FECHA_COMPRA || null,
                FECHA_ALTA || null,
                conservacion,
                disposicion,
                situacion
            ]
        );

        res.json({
            message: 'Bien patrimonial agregado correctamente.',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al agregar el bien patrimonial.',
            error,
        });
    }
};

export const addObservation = async (req, res) => {
    const { id } = req.params;
    const { observacion } = req.body;
    // console.log('Datos recibidos:', { id, observacion });
    try {
        // Actualiza el campo OBSERVACION en la base de datos
        await pool.query('UPDATE item SET OBSERVACION = ? WHERE CODIGO_PATRIMONIAL = ?', [observacion, id]);
        res.status(200).json({ message: 'Observación actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la observación:', error);
        res.status(500).json({ message: 'Error al actualizar la observación' });
    }
};
