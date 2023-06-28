const pg = require("pg");
//we must give the path of environmental variables if they are to be used here
const client = new pg.Client(process.env.PSQL_URL);
module.exports = client;
