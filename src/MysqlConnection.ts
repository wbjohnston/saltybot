import * as mysql from 'mysql';

export class MysqlConnection {
    public connection: mysql.Connection;

    public constructor() {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });

        this.connection = connection;
        this.connection.connect();
    }
}
