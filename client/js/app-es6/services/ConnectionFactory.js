const _DB_NAME = 'aluraframe';
const _VERSION = 5;
const _STORES = ['negociacoes'];

let connection = null;
let close = null;

export class ConnectionFactory {

    constructor() {

        throw new Error('ConnectionFactory não pode ser instanciada');
    }

    static getConnection() {
        return new Promise((resolve, reject) => {

            let openRequest = window.indexedDB.open(_DB_NAME, _VERSION);

            openRequest.onupgradeneeded = e => {
                ConnectionFactory._getConnetion(e.target.result);
            };

            openRequest.onsuccess = e => {
                if (!connection) {
                    connection = e.target.result;
                    close = connection.close.bind(connection);
                    connection.close = function() {
                        throw new Error('Você não pode fechar diretamente a conexão');
                    };
                };
                resolve(connection);
            };

            openRequest.onerror = e => {
                console.log(e.target.error);
                reject(e.target.error.name);
            };
        });
    }

    static _getConnetion(connection) {

        _STORES.forEach(store => {
            if (connection.objectStoreNames.contains(store)) connection.deleteObjectStore(store);
            connection.createObjectStore(store, { autoIncrement: true });
        })
    }

    static closeConnection() {
        if (connection) {
            close();
            connection = null;
        }
    }
}