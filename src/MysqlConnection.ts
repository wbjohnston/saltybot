import config from "./config"

const mysql = require('mysql');

export class MysqlConnection {
    public connection: any;

    public constructor() {
        let connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        });

        this.connection = connection;
        this.connection.connect();
    }
}
