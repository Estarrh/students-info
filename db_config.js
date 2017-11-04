/*This is the file that holds our database configuration*/

var dbconfig = {
    database: {
        host: 'localhost', //Database Host
        user: 'root', //Database User
        password: '',
        port: 3306,
        db: 'info'
    },
    server: {
        host: '127.0.0.1',
        port: '3000'
    }
}

module.exports = dbconfig;