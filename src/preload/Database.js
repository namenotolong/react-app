const pg = require('pg');
const mysql = require('mysql');
// 定义抽象类
class DatabaseConn {
    constructor(connectionData) {
        if (new.target === DatabaseConn) {
            throw new TypeError("Cannot construct Database instances directly");
        }
        this.connectionData = connectionData;
    }
    connect() {
        throw new Error("Method 'connect' must be implemented");
    }

    disconnect() {
        throw new Error("Method 'disconnect' must be implemented");
    }

    async run(sql) {
        throw new Error("Method 'run' must be implemented");
    }

    async query(sql) {
        throw new Error("Method 'query' must be implemented");
    }

    async listDatabases() {
        throw new Error("Method 'listDatabases' must be implemented");
    }

    async showTables() {
        throw new Error("Method 'fetchTables' must be implemented");
    }
    async executeParams(sql, params) {
        throw new Error("Method 'executeParams' must be implemented");
    }
}

class Result {
    constructor(columns, data) {
        this.columns = columns;
        this.data = data;
    }
}

class ParseFieldInfo {

    static {
        this.postgreFieldMap = new Map()
        for (const key in pg.types.builtins) {
            if (Object.hasOwnProperty.call(pg.types.builtins, key)) {
                const element = pg.types.builtins[key];
                this.postgreFieldMap.set(element, key)
            }
        }
    }
    static parsePostgreSQL(fields) {
        return fields.map(e =>
            ({ 'dataIndex': e.name, 'type': this.postgreFieldMap.get(e.dataTypeID), 'title': e.name, 'key': e.name })
        )
    }
    static parseMySQL(fields) {
        return fields.map(e => ({ 'dataIndex': e.name, 'type': mysql.Types[e.type], 'title': e.name, 'key': e.name }))
    }
}
class ConnPostgreSQL extends DatabaseConn {

    connect() {
        this.client = new pg.Client({
            user: this.connectionData.user,
            host: this.connectionData.host,
            password: this.connectionData.password,
            port: this.connectionData.port,
            database: this.connectionData.database
        });
        this.client.connect();
    }

    disconnect() {
        this.client.end()
    }
    async run(sql) {
        return await new Promise((resolve, reject) => {
            this.client.query(sql, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    if (res.command === "SELECT") {
                        resolve(new Result(ParseFieldInfo.parsePostgreSQL(res.fields), res.rows));
                    } else {
                        resolve("Changed: " + res.rowCount)
                    }
                }
            });
        });
    }

    async query(sql) {
        return await new Promise((resolve, reject) => {
            this.client.query(sql, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Result(ParseFieldInfo.parsePostgreSQL(res.fields), res.rows));
                }
            });
        });
    }

    async listDatabases() {
        return await new Promise((resolve, reject) => {
            this.client.query('SELECT datname FROM pg_database', (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows.map(e => e.datname));
                }
            });
        })
    }

    async showTables() {
        return await new Promise((resolve, reject) => {
            this.client.query("select tablename from pg_tables where schemaname='public'", (error, res) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(res.rows.map(e => e[Object.keys(e)[0]]))
                }
            });
        });
    }

    async executeParams(sql, params) {
        return await new Promise((resolve, reject) => {
            this.client.query(sql, params, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    if (Object.hasOwnProperty.call(res, 'rowCount')) {
                        resolve("Changed: " + res.rowCount)
                    } else {
                        resolve()
                    }
                }
            });
        });
    }

}

class ConnMySQL extends ConnPostgreSQL {

    connect() {
        this.connection = mysql.createConnection({
            user: this.connectionData.user,
            host: this.connectionData.host,
            password: this.connectionData.password,
            port: this.connectionData.port,
            database: this.connectionData.database
        });
    }

    async run(sql) {
        return await new Promise((resolve, reject) => {
            this.connection.query(sql, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    if (Object.hasOwnProperty.call(results, 'message')) {
                        resolve(results.message);
                    } else {
                        resolve(new Result(ParseFieldInfo.parseMySQL(fields), results));
                    }
                }
            });
        });
    }

    async query(sql) {
        return await new Promise((resolve, reject) => {
            this.connection.query(sql, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(new Result(ParseFieldInfo.parseMySQL(fields), results));
                }
            });
        });
    }

    async listDatabases() {
        return await new Promise((resolve, reject) => {
            this.connection.query('show databases', (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.map(e => e.Database));
                }
            });
        })
    }

    disconnect() {
        this.connection.end()
    }

    async showTables() {
        return await new Promise((resolve, reject) => {
            this.connection.query("show tables", (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.map(e => e[Object.keys(e)[0]]))
                }
            });
        });
    }

    async executeParams(sql, params) {
        return await new Promise((resolve, reject) => {
            this.connection.query(sql, params, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.message);
                }
            });
        });
    }

}

function createConnection(connParams) {
    let dbtype = connParams.type.toLowerCase()
    let databaseConn = null;
    switch (dbtype) {
        case "mysql": databaseConn = new ConnMySQL(connParams); break;
        case "postgresql": databaseConn = new ConnPostgreSQL(connParams); break;
    }
    if (databaseConn == null) {
        throw new Error(`dbtype:[${dbtype}] donot support`);
    }
    databaseConn.connect();
    return databaseConn;
}

async function fetchData(sql, connParams) {
    let databaseConn = createConnection(connParams);
    const result = await databaseConn.query(sql);
    databaseConn.disconnect();
    return result;
}

async function executeSql(sql, connParams) {
    let databaseConn = createConnection(connParams);
    const result = await databaseConn.run(sql);
    databaseConn.disconnect();
    return result;
}

async function showDatabases(connParams) {
    let databaseConn = createConnection(connParams);
    const result = await databaseConn.listDatabases();
    databaseConn.disconnect();
    return result;
}

async function fetchTotalConns() {
    return new Promise((resolve, reject) => {
        const list = [
            {
                name: 'localhost-postgres',
                type: 'postgresql',
                user: "postgres",
                host: "master",
                password: "Guan&*(123",
                port: 5435,
            },
            {
                name: 'localhost-mysql',
                type: 'mysql',
                user: "root",
                host: "master",
                password: "123456",
                port: 3306,
            }
        ]
        resolve(list);
    })
}

async function showTables(connParams) {
    let databaseConn = createConnection(connParams);
    const result = await databaseConn.showTables();
    databaseConn.disconnect();
    return result;
}

async function executeParams(sql, params, connParams) {
    let databaseConn = createConnection(connParams);
    const result = await databaseConn.executeParams(sql, params);
    databaseConn.disconnect();
    return result;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export { fetchData, fetchTotalConns, showDatabases, showTables, executeSql, executeParams }