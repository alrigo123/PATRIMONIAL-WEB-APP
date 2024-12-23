export const model = {}

model.registerUser = async (pool, dni, name_and_last, passHash) => {
    const stmt = 'INSERT INTO user_i (dni, name_and_last, password) VALUES (?, ?, ?)'
    const registerUser = await pool.query(stmt, [dni, name_and_last, passHash])
    return registerUser;
}

model.findUserByDNI = async (pool, dni) => {
const stmt = 'SELECT * FROM user_i WHERE dni = ?'
const getSingleUser = await pool.query(stmt, [dni])
const user = await getSingleUser
return user[0][0];

}