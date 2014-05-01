declare module "mysql" {

    function createConnection(params: Object): Connection;

    function createPool(params: Object): Pool;

    class Connection {
        query(sql: string, onResult: (err: Error, rows: Array<any>, fields: any) => void);
        query(sql: string, data: any, callback: (err: Error, result: any) => void);
        escape(sql: string): string;

        connect(onConnect: (err: Error) => void): void;

        beginTransation(onStart: (err: Error) => void): void;

        commit(onCommit: (err: Error) => void): void;

        rollback(onRollback: (err: Error) => void): void;




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
        query(sql: string, data: any, callback: (err: Error, result: any) => void);

        getConnection(onConnection: (err: Error, connection: Connection) => void);
        escape(sql: string): string;
    }
}