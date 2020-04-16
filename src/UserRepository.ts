import { MysqlConnection } from './MysqlConnection';

export class UserRepository extends MysqlConnection {
    public constructor() {
        super();
    }

    public async addUser(email: string): Promise<void> {
        return new Promise((resolve) => {
            // TODO: define these types better
            // eslint-disable-next-line
            this.connection.query('INSERT INTO User SET email=?', email, (error: any, result: any, fields: any) => {
                if (error) {
                    return this.connection.rollback(() => {
                        throw error;
                    });
                }

                resolve();
            });
        });
    }
}
