const oracledb = require('oracledb');

// Configurar Oracle
oracledb.autoCommit = true;
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Pool de conexiones (más eficiente)
let connectionPool;

// Inicializar Pool
async function initializeDB() {
  try {
    // Configurar charset para soporte UTF-8
    process.env.NLS_LANG = 'AMERICAN_AMERICA.AL32UTF8';
    
    connectionPool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1
    });
    console.log('✅ Pool de conexiones Oracle inicializado correctamente');
  } catch (err) {
    console.error('❌ Error al inicializar Pool:', err);
    throw err;
  }
}

// Obtener conexión del pool
async function getConnection() {
  try {
    if (!connectionPool) {
      throw new Error('Pool no inicializado');
    }
    const connection = await connectionPool.getConnection();
    return connection;
  } catch (err) {
    console.error('❌ Error obteniendo conexión:', err);
    throw err;
  }
}

// Ejecutar query simple
async function executeQuery(query, params = {}, options = {}) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(query, params, options);
    return result;
  } catch (err) {
    console.error('❌ Error ejecutando query:', err);
    throw err;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Ejecutar query y retornar solo filas
async function fetchQuery(query, params = {}) {
  const result = await executeQuery(query, params);
  return result.rows || [];
}

// Ejecutar una fila
async function fetchOne(query, params = {}) {
  const rows = await fetchQuery(query, params);
  return rows.length > 0 ? rows[0] : null;
}

// Cerrar pool
async function closePool() {
  try {
    if (connectionPool) {
      await connectionPool.close();
      console.log('✅ Pool de conexiones cerrado');
    }
  } catch (err) {
    console.error('❌ Error cerrando pool:', err);
  }
}

module.exports = {
  initializeDB,
  getConnection,
  executeQuery,
  fetchQuery,
  fetchOne,
  closePool,
  oracledb
};
