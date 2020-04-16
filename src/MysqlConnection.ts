import config from "./config"
import * as mysql from 'mysql';

export class MysqlConnection {
    public connection: any;

    public constructor() {
        const connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        });

        this.connection = connection;
        this.connection.connect();
    }
}
