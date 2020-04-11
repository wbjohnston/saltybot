import { MysqlConnection } from "./MysqlConnection";

export class UserRepository extends MysqlConnection{
    public constructor() {
        super();
    }

    public async addUser(email: string): Promise<void> {
        let self = this;

        return new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO User SET email=?', email, function (error: any, result: any, fields: any) {
                if (error) {
                    return self.connection.rollback(function () {
                        throw error;
                    });
                }

                resolve()
            });
        })

    }
}