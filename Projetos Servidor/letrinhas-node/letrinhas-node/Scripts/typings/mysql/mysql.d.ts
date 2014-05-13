declare module "mysql" {

    function createConnection(url?: string, params?: {
        host?: string;
        port?: number;
        localAddress?: string;
        socketPath?: string;
        user: string;
        password: string;
        database?: string;
        charset?: string;
        timezone?: string;
        connectTimeout?: number;
        stringifyObjects?: boolean;
        insecureAuth?: boolean;
        typeCast?: boolean;
        queryFormat?: (query: string, ...values: any[]) => string;
        supportBigNumbers?: boolean;
        bigNumberStrings?: boolean;
        dateStrings?: boolean;
        debug?: boolean;
        trace?: boolean;
        multipleStatements?: boolean;
        flags?: string;
        ssl?: any
    }): Connection;

    function createPool(params?: {
        waitForConnections?: boolean;
        connectionLimit?: number;
        queueLimit?: number;
        host?: string;
        port?: number;
        localAddress?: string;
        socketPath?: string;
        user: string;
        password: string;
        database?: string;
        charset?: string;
        timezone?: string;
        connectTimeout?: number;
        stringifyObjects?: boolean;
        insecureAuth?: boolean;
        typeCast?: boolean;
        queryFormat?: (query: string, ...values: any[]) => string;
        supportBigNumbers?: boolean;
        bigNumberStrings?: boolean;
        dateStrings?: boolean;
        debug?: boolean;
        trace?: boolean;
        multipleStatements?: boolean;
        flags?: string;
        ssl?: any
    }): Pool;

    function createpoolCluster(params?: {
        canRetry?: boolean;
        removeNodeErrorCount?: number;
        defaultSelector?: string;
    }): PoolCluster;

    class PoolCluster {
        add(group: any): void;
        add(groupName: string, group: any);

        getConnection(cb: (err: Error, connection: Connection) => void): void;
        getConnection(groupName: string, cb: (err: Error, connection: Connection) => void): void;

        on(eventName: string, cb: (nodeId: any) => void): void;
    }

    class Connection {
        connect(onConnect: (err: Error) => void): void;

        beginTransation(onStart: (err: Error) => void): void;

        /**
         * Commits this transaction.
         */
        commit(onCommit: (err: Error) => void): void;

        /**
         * Rolls back this transaction.
         */
        rollback(onRollback: (err: Error) => void): void;

        /**
         * Ends this connection and returns it to its pool.
         */
        release(): void;
        /**
         * Ends this connection but does NOT return it to the pool.
         * Any events attached to this connection won't be triggered.
         */
        destroy(): void;

        /**
         * Ends this connection and returns it to the pool.
         */
        end(onEnd: (err: Error) => void): void;

        on(event: string, onConnect: (connection: Connection) => void): void;

        query(sql: string, callback: (err: Error, rows: Array<any>, fields: any) => void): void;
        query(sql: string, data: any, callback: (err: Error, result: any) => void): void;

        escape(sql: string): string;
    }

    class Pool {
        getConnection(onConnection: (err: Error, connection: Connection) => void): void;

        query(sql: string, callback: (err: Error, rows: Array<any>, fields: any) => void): void;
        query(sql: string, data: any, callback: (err: Error, result: any) => void): void;

        escape(sql: string): string;
    }

    function format(sql: string, values: any[], stringifyObjects?: boolean, timeZone?: string): string;

}