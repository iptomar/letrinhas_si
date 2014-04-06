declare module "mysql" {

    function createConnection(params: Object): Connection;

    function createPool(params: Object): Pool;

    class Connection {
        query(sql: string, onResult: (err: Error, rows: Array<any>, fields: any) => void);
        query(sql: string, data: any, callback: (err: Error, result: any) => void);

        connect(onConnect: (err: Error) => void): void;

        /**
         * Ends this connection and returns it to its pool.
         */
        release(): void;
        /**
         * Ends this connection but does NOT return it to the pool.
         * A new connection is created if needed.
         */
        destroy(): void;
        end(onEnd: (err: Error) => void): void;

        on(event: string, onConnect: (connection: Connection) => void);
    }

    class Pool {
        query(sql: string, callback: (err: Error, rows: Array<any>, fields: any) => void);
        query(sql: string, data: any, callback: (err: Error, rows: Array<any>, fields: any) => void);

        getConnection(onConnection: (err: Error, connection: Connection) => void);
    }
}