//------------------------------------
// app.js
//------------------------------------
const pg = require('pg');

//------------------------------------
// Configurations
//------------------------------------
let connection;
exports.connect = function () {
  var connectionString = "postgres://dqiuljny:gxbeI7HywQXM6euU4qf01bemR3MYE06J@isilo.db.elephantsql.com/dqiuljny"
  if (connection) {
    const oldConnection = connection;
    connection = null;
    return oldConnection.end().then(() => exports.connect(connectionString));
  }
    connection = new pg.Pool({
    connectionString,
    max: 5, // New things
  });
  return connection.connect().catch(function (error) {
    connection = null;
    throw error;
  });
};

exports.query = function (text, params) {
  if (!connection) {
    return Promise.reject(new Error('Not connected to database'));
  }
  return connection.query(text, params)
};

exports.transaction = async function (asyncFn) {
  if (!connection) {
    return Promise.reject(new Error('Not connected to database'));
  }
  const dbClient = await connection.connect();

  try {
    await dbClient.query(`BEGIN`);
    try {
      const result = await asyncFn(dbClient);
      await dbClient.query(`COMMIT`);
      console.log("This is database.js: " + JSON.stringify(result));
      return result;
    } catch (err) {
      await dbClient.query(`ROLLBACK`);
      throw err;
    }
  } finally {
    dbClient.release();
  }
}



